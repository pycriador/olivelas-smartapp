"""
Olivelas Documentation Synchronizer & Full Indexer
Loads and indexes official Olivelas engineering guidelines, skills, ADRs,
security standards, runbooks, and architectures from pycriador/olivelas-smartapp.
"""
from __future__ import annotations
import os
import re
from pathlib import Path
from app.domain.models import KnowledgeDocument, KnowledgeCategory

DOCS_ROOT = Path(__file__).parent.parent.parent / "knowledge_base" / "aiops_documentation"


def slugify(text: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[\s_-]+", "-", cleaned).strip("-")


def extract_title_and_summary(content: str, default_title: str) -> tuple[str, str, list[str]]:
    lines = content.split("\n")
    title = default_title
    summary_lines = []
    key_points = []
    in_title = False
    in_summary = False

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if summary_lines:
                in_summary = False
            continue

        if (stripped.startswith("# ") or stripped.startswith("## ")) and not in_title:
            title = re.sub(r"^#+\s+", "", stripped).strip()
            # Clean any trailing or leading markdown symbols
            title = re.sub(r"[*_`]", "", title).strip()
            in_title = True
            in_summary = True
            continue

        if in_summary and not stripped.startswith("#") and not stripped.startswith(">"):
            summary_lines.append(stripped)
            if len(" ".join(summary_lines)) > 140:
                in_summary = False
        elif stripped.startswith("- ") or stripped.startswith("* "):
            if len(key_points) < 6:
                clean_pt = re.sub(r"^[-*]\s+(\*\*)?", "", stripped).replace("**", "")
                if len(clean_pt) > 10:
                    key_points.append(clean_pt)

    summary = " ".join(summary_lines) if summary_lines else f"Especificação técnica canônica para {title}."
    if len(summary) > 220:
        summary = summary[:217] + "..."

    if not key_points:
        key_points = [
            f"Diretriz oficial de engenharia Olivelas: {title}",
            "Padrão aplicável a todos os serviços e agentes de IA da Olivelas",
            "Em conformidade com as diretrizes de segurança, qualidade e observabilidade",
        ]

    return title, summary, key_points


def map_category_from_path(relative_path: str, filename: str) -> KnowledgeCategory:
    rel = relative_path.lower()
    fn = filename.lower()

    if "rules" in rel or "skills" in rel or fn.startswith("agent") or fn.startswith("claude"):
        return KnowledgeCategory.AI_SKILLS_PROMPTS
    if any(k in fn for k in ["security", "threat", "secret", "privacy", "identity", "privilege", "vulnerability"]):
        return KnowledgeCategory.SECURITY_IAM
    if any(k in fn for k in ["observability", "monitoring", "health", "incident", "metric", "sre", "reliability"]):
        return KnowledgeCategory.DEVOPS_SRE
    if any(k in fn for k in ["infra", "deploy", "k8s", "kubernetes", "operation"]):
        return KnowledgeCategory.DEVOPS_SRE
    if any(k in fn for k in ["contract", "idempotency", "timing-contract", "message-contract", "semantic"]):
        return KnowledgeCategory.API_INTEGRATIONS
    if any(k in fn for k in ["adr", "decision", "architecture", "boundaries", "system-context", "data-model"]):
        return KnowledgeCategory.ARCHITECTURE_ADR
    if any(k in fn for k in ["standard", "principle", "language", "style-guide", "lifecycle", "versioning", "quality"]):
        return KnowledgeCategory.MASTER_GUIDE
    if "frontend" in rel or "copan" in rel:
        return KnowledgeCategory.FRONTEND_SPEC
    if "backend" in rel or "fastapi" in rel:
        return KnowledgeCategory.BACKEND_SPEC

    return KnowledgeCategory.MASTER_GUIDE


def load_aiops_documentation() -> list[KnowledgeDocument]:
    """Scan and index markdown files from the aiops-documentation repository."""
    docs: list[KnowledgeDocument] = []
    seen_ids: set[str] = set()

    if not DOCS_ROOT.exists():
        return docs

    # Priority 1: Cursor rules (.cursor/rules/*.mdc)
    cursor_rules_dir = DOCS_ROOT / ".cursor" / "rules"
    if cursor_rules_dir.exists():
        for file in cursor_rules_dir.glob("*.mdc"):
            try:
                content = file.read_text(encoding="utf-8")
                doc_id = f"cursor-rule-{file.stem}"
                title, summary, key_points = extract_title_and_summary(content, f"Cursor Rule: {file.stem}")
                docs.append(
                    KnowledgeDocument(
                        id=doc_id,
                        title=f"Cursor Rule: {file.stem.replace('docs-', '').replace('-', ' ').title()}",
                        category=KnowledgeCategory.AI_SKILLS_PROMPTS,
                        summary=summary,
                        content=content,
                        tags=["cursor", "ai-rules", "aiops-documentation", "prompting"],
                        author="Olivelas AI Chapter",
                        version="1.0.0",
                        key_points=key_points,
                        source_url="https://github.com/pycriador/olivelas-smartapp/tree/main/.cursor/rules",
                    )
                )
                seen_ids.add(doc_id)
            except Exception:
                continue

    # Priority 2: Claude Skills (.claude/skills/*)
    claude_skills_dir = DOCS_ROOT / ".claude" / "skills"
    if claude_skills_dir.exists():
        for skill_dir in claude_skills_dir.iterdir():
            if skill_dir.is_dir():
                for md_file in skill_dir.glob("*.md"):
                    try:
                        content = md_file.read_text(encoding="utf-8")
                        doc_id = f"claude-skill-{skill_dir.name}"
                        title, summary, key_points = extract_title_and_summary(content, f"Claude Skill: {skill_dir.name}")
                        docs.append(
                            KnowledgeDocument(
                                id=doc_id,
                                title=f"Claude Skill: {skill_dir.name.replace('-', ' ').title()}",
                                category=KnowledgeCategory.AI_SKILLS_PROMPTS,
                                summary=summary,
                                content=content,
                                tags=["claude-code", "skills", "aiops-documentation", "automation"],
                                author="Olivelas AI Chapter",
                                version="1.0.0",
                                key_points=key_points,
                                source_url="https://github.com/pycriador/olivelas-smartapp/tree/main/.claude/skills",
                            )
                        )
                        seen_ids.add(doc_id)
                    except Exception:
                        continue

    # Priority 3: Root standards (CLAUDE.md, AGENTS.md, README.pt-BR.md, CONTRIBUTING.pt-BR.md)
    root_files = [
        ("AGENTS.md", KnowledgeCategory.AI_SKILLS_PROMPTS, "Olivelas Agents Standard & Governance"),
        ("README.pt-BR.md", KnowledgeCategory.MASTER_GUIDE, "Olivelas Documentation Hub — Visão Geral & Filosofia"),
        ("CONTRIBUTING.pt-BR.md", KnowledgeCategory.MASTER_GUIDE, "Guia de Contribuição de Documentação Técnica Olivelas"),
    ]

    for fname, cat, fallback_title in root_files:
        fpath = DOCS_ROOT / fname
        if fpath.exists():
            try:
                content = fpath.read_text(encoding="utf-8")
                doc_id = f"aiops-doc-{slugify(fname.replace('.md', '').replace('.pt-BR', ''))}"
                title, summary, key_points = extract_title_and_summary(content, fallback_title)
                docs.append(
                    KnowledgeDocument(
                        id=doc_id,
                        title=fallback_title,
                        category=cat,
                        summary=summary,
                        content=content,
                        tags=["loft-standard", "aiops", "governance"],
                        author="Olivelas Engineering Core",
                        version="2.0.0",
                        key_points=key_points,
                        source_url="https://github.com/pycriador/olivelas-smartapp",
                    )
                )
                seen_ids.add(doc_id)
            except Exception:
                continue

    # Priority 4: Core pt-BR Documentation files (docs/pt-BR/*.md)
    pt_br_dir = DOCS_ROOT / "docs" / "pt-BR"
    if pt_br_dir.exists():
        for root, _, files in os.walk(pt_br_dir):
            for file in sorted(files):
                if file.endswith(".md") and not file.startswith("."):
                    full_path = Path(root) / file
                    rel_path = str(full_path.relative_to(pt_br_dir))
                    doc_id = f"aiops-{slugify(rel_path.replace('.md', ''))}"

                    if doc_id in seen_ids:
                        continue

                    try:
                        content = full_path.read_text(encoding="utf-8")
                        category = map_category_from_path(rel_path, file)
                        fallback_title = file.replace(".md", "").replace("-", " ").title()
                        title, summary, key_points = extract_title_and_summary(content, fallback_title)

                        tags = ["aiops-documentation", "loft-standard", category.value]
                        if "loft-observability" in rel_path:
                            tags.append("observability")
                            tags.append("datadog")
                        if "loft-infra" in rel_path:
                            tags.append("infrastructure")
                            tags.append("aws")

                        docs.append(
                            KnowledgeDocument(
                                id=doc_id,
                                title=title if len(title) < 70 else fallback_title,
                                category=category,
                                summary=summary,
                                content=content,
                                tags=tags,
                                author="Olivelas Architecture & Operations",
                                version="1.0.0",
                                key_points=key_points,
                                source_url=f"https://github.com/pycriador/olivelas-smartapp/blob/main/docs/pt-BR/{rel_path}",
                            )
                        )
                        seen_ids.add(doc_id)
                    except Exception:
                        continue

    # Priority 5: Examples & Reference Services (examples/suggested-document-platform/pt-BR/docs)
    example_docs_dir = DOCS_ROOT / "examples" / "suggested-document-platform" / "pt-BR" / "docs"
    if example_docs_dir.exists():
        for root, _, files in os.walk(example_docs_dir):
            for file in sorted(files):
                if file.endswith(".md"):
                    full_path = Path(root) / file
                    rel_path = str(full_path.relative_to(example_docs_dir))
                    doc_id = f"example-doc-platform-{slugify(rel_path.replace('.md', ''))}"

                    if doc_id in seen_ids:
                        continue

                    try:
                        content = full_path.read_text(encoding="utf-8")
                        category = map_category_from_path(rel_path, file)
                        fallback_title = f"Plataforma de Documentação — {file.replace('.md', '').replace('-', ' ').title()}"
                        title, summary, key_points = extract_title_and_summary(content, fallback_title)

                        docs.append(
                            KnowledgeDocument(
                                id=doc_id,
                                title=title if len(title) < 70 else fallback_title,
                                category=category,
                                summary=summary,
                                content=content,
                                tags=["example-architecture", "reference-implementation", category.value],
                                author="Olivelas Platform Team",
                                version="1.0.0",
                                key_points=key_points,
                                source_url=f"https://github.com/pycriador/olivelas-smartapp/blob/main/examples/suggested-document-platform/pt-BR/docs/{rel_path}",
                            )
                        )
                        seen_ids.add(doc_id)
                    except Exception:
                        continue

    return docs
