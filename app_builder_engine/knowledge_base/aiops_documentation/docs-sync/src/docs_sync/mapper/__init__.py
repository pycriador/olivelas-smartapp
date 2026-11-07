"""Map Documentation model → Confluence page descriptors (no HTTP)."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from docs_sync.config import AppConfig
from docs_sync.links import (
    github_blob_url,
    git_relative_path,
    resolve_confluence_hrefs,
    resolve_under_doc_root,
)
from docs_sync.models import ConfluencePageMapping, Document, DocumentationTree
from docs_sync.parser import markdown_to_storage_html, resolve_page_title


FOOTER_MARKER_START = "<!-- docs-sync:footer:start -->"
FOOTER_MARKER_END = "<!-- docs-sync:footer:end -->"

# Confluence label names reject: space ! # & ( ) * , . : ; < > ? @ [ ] ^
_INVALID_LABEL_CHARS = str.maketrans(
    {
        " ": "-",
        "!": "-",
        "#": "-",
        "&": "-",
        "(": "-",
        ")": "-",
        "*": "-",
        ",": "-",
        ".": "-",
        ":": "-",
        ";": "-",
        "<": "-",
        ">": "-",
        "?": "-",
        "@": "-",
        "[": "-",
        "]": "-",
        "^": "-",
    }
)


def _sanitize_confluence_label(label: str) -> str:
    cleaned = label.strip().lower().translate(_INVALID_LABEL_CHARS)
    while "--" in cleaned:
        cleaned = cleaned.replace("--", "-")
    return cleaned.strip("-")


class ConfluenceMapper:
    def __init__(self, config: AppConfig) -> None:
        self.config = config

    def resolve_title(self, document: Document) -> str:
        return resolve_page_title(
            metadata=document.metadata,
            body=document.content,
            path=document.path,
            is_directory_index=document.is_directory_index,
        )

    def resolve_parent(self, document: Document, tree: DocumentationTree) -> str | None:
        if document.parent_path and document.parent_path in tree.documents:
            return tree.documents[document.parent_path].stable_id
        return None

    def resolve_labels(self, document: Document) -> list[str]:
        labels = list(self.config.sync.labels)
        project = self.config.project.name.strip().lower().replace(" ", "-")
        if project:
            # Confluence rejects ':' and other punctuation in label names
            labels.append(f"project-{project}")
        if document.metadata.doc_type:
            labels.append(f"type-{document.metadata.doc_type.lower()}")
        # unique preserve order; sanitize invalid Confluence label characters
        seen: set[str] = set()
        out: list[str] = []
        for label in labels:
            cleaned = _sanitize_confluence_label(label)
            if cleaned and cleaned not in seen:
                seen.add(cleaned)
                out.append(cleaned)
        return out

    def map_document(
        self,
        document: Document,
        tree: DocumentationTree,
        *,
        page_ids: dict[str, str] | None = None,
    ) -> ConfluencePageMapping:
        title = self.resolve_title(document)
        body = self._rewrite_relative_links(document, tree)
        html = markdown_to_storage_html(body)
        if page_ids and self.config.confluence.url and self.config.confluence.space:
            html, _ = resolve_confluence_hrefs(
                html,
                stable_id_to_page_id=page_ids,
                base_url=self.config.confluence.url,
                space_key=self.config.confluence.space,
            )
        if self.config.sync.include_footer:
            html = self._append_footer(html, document)
        properties = {
            "managed_by": self.config.sync.managed_by,
            "source_path": document.path,
            "document_id": document.metadata.document_id or "",
            "stable_id": document.stable_id,
            "content_hash": document.content_hash,
            "repository": self.config.project.repository_url or "",
            "project": self.config.project.name,
            "last_sync": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
        return ConfluencePageMapping(
            stable_id=document.stable_id,
            title=title,
            parent_stable_id=self.resolve_parent(document, tree),
            source_path=document.path,
            labels=self.resolve_labels(document),
            properties=properties,
            body_storage=html,
            content_hash=document.content_hash,
        )

    def map_tree(
        self,
        tree: DocumentationTree,
        *,
        page_ids: dict[str, str] | None = None,
    ) -> list[ConfluencePageMapping]:
        # parents before children: directory indexes first by path depth
        docs = sorted(
            tree.iter_documents(),
            key=lambda d: (d.path.count("/"), 0 if d.is_directory_index else 1, d.path),
        )
        mappings = [self.map_document(doc, tree, page_ids=page_ids) for doc in docs]
        return self._ensure_unique_titles(mappings)

    @staticmethod
    def _ensure_unique_titles(
        mappings: list[ConfluencePageMapping],
    ) -> list[ConfluencePageMapping]:
        """Confluence requires unique page titles within a space."""
        from collections import Counter
        from pathlib import PurePosixPath

        counts = Counter(m.title for m in mappings)
        if all(n == 1 for n in counts.values()):
            return mappings

        used: set[str] = set()
        for mapping in mappings:
            title = mapping.title
            if counts[title] == 1 and title not in used:
                used.add(title)
                continue
            parent = PurePosixPath(mapping.source_path).parent.as_posix()
            if parent and parent != ".":
                candidate = f"{title} ({parent})"
            else:
                candidate = f"{title} ({mapping.source_path})"
            if candidate in used:
                candidate = f"{title} [{mapping.stable_id}]"
            mapping.title = candidate
            used.add(candidate)
        return mappings

    def _rewrite_relative_links(self, document: Document, tree: DocumentationTree) -> str:
        # In-tree .md → confluence://stable-id.
        # Same-repo files that exist on disk → GitHub blob URL (never invent paths).
        # Escaping / missing targets are left unchanged; validate_tree must ERROR first.
        import re
        from pathlib import Path

        pattern = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
        repo = (self.config.project.repository_url or "").rstrip("/")

        def repl(match: re.Match[str]) -> str:
            text, href = match.group(1), match.group(2).strip()
            if href.startswith(("http://", "https://", "mailto:", "#", "confluence://")):
                return match.group(0)
            if "://" in href:
                return match.group(0)
            if "#" in href:
                target, frag = href.split("#", 1)
                fragment = f"#{frag}"
            else:
                target, fragment = href, ""
            if not target:
                return match.group(0)

            resolved = resolve_under_doc_root(document.path, target)
            if resolved is not None and target.endswith(".md") and resolved in tree.documents:
                return f"[{text}](confluence://{tree.documents[resolved].stable_id}{fragment})"

            if not repo:
                return match.group(0)

            abs_candidate = Path(document.absolute_path).parent / target
            try:
                if not abs_candidate.resolve().exists():
                    return match.group(0)
            except OSError:
                return match.group(0)

            rel = git_relative_path(abs_candidate)
            if not rel:
                return match.group(0)
            return f"[{text}]({github_blob_url(repo, rel, fragment)})"

        return pattern.sub(repl, document.content)

    def _append_footer(self, html: str, document: Document) -> str:
        if FOOTER_MARKER_START in html:
            # strip previous footer
            start = html.find(FOOTER_MARKER_START)
            end = html.find(FOOTER_MARKER_END)
            if start != -1 and end != -1:
                html = html[:start] + html[end + len(FOOTER_MARKER_END) :]
        display_path, source_url = self._github_source_link(document)
        if source_url:
            source_line = (
                f'<p>Source (GitHub): <a href="{source_url}">{display_path}</a></p>'
            )
        else:
            source_line = f"<p>Source: {display_path}</p>"
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        footer = (
            f"{FOOTER_MARKER_START}"
            f"<hr/>"
            f"<p><em>Documentation managed by {self.config.sync.managed_by}.</em></p>"
            f"{source_line}"
            f"<p>Last synchronized: {now}</p>"
            f"{FOOTER_MARKER_END}"
        )
        return html.rstrip() + "\n" + footer

    def _github_source_link(self, document: Document) -> tuple[str, str]:
        """Return (display_path, blob_url). URL empty when repository_url is unset."""
        display = document.path
        repo = (self.config.project.repository_url or "").rstrip("/")
        if not repo:
            return display, ""
        rel = git_relative_path(document.absolute_path)
        if rel:
            return rel, github_blob_url(repo, rel)
        language = (self.config.documentation.language or "").strip()
        if language and not document.path.startswith("docs/"):
            abs_posix = Path(document.absolute_path).as_posix()
            marker = f"/docs/{language}/"
            if marker in abs_posix:
                display = "docs/" + language + "/" + abs_posix.split(marker, 1)[1]
                return display, github_blob_url(repo, display)
            display = f"docs/{language}/{document.path}"
            return display, github_blob_url(repo, display)
        return display, github_blob_url(repo, display)

    @staticmethod
    def _git_relative_path(absolute_path: str) -> str | None:
        return git_relative_path(absolute_path)
