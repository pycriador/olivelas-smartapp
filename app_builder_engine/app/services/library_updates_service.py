"""
Library Updates Central — Service Layer
----------------------------------------
Backend for the "Central de Atualizações de Bibliotecas": an admin-triggered
module that scans the public npm/PyPI registries for the latest versions of
every library in the platform's scaffolded-app ecosystem (see
`library_updates/stack_versions.json`), classifies candidate upgrades into
"safe" / "newer" / "test" buckets, lets an admin actually install+build a
throwaway guinea-pig app with a candidate version applied before trusting it,
and — only once an admin explicitly applies a choice — rewrites
stack_versions.json on disk.

This module never touches git. Committing/pushing the resulting
stack_versions.json change to the shared `main` branch remains a deliberate,
manual, human step.
"""
from __future__ import annotations

import asyncio
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import httpx

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
# app/services/library_updates_service.py -> app -> app_builder_engine
_APP_BUILDER_ENGINE_DIR = Path(__file__).resolve().parents[2]
LIBRARY_UPDATES_DIR = _APP_BUILDER_ENGINE_DIR / "library_updates"
STACK_VERSIONS_PATH = LIBRARY_UPDATES_DIR / "stack_versions.json"
FIXTURE_FRONTEND_DIR = LIBRARY_UPDATES_DIR / "fixture" / "frontend"
FIXTURE_BACKEND_DIR = LIBRARY_UPDATES_DIR / "fixture" / "backend"

NPM_REGISTRY_URL = "https://registry.npmjs.org/{package}"
PYPI_REGISTRY_URL = "https://pypi.org/pypi/{package}/json"
REGISTRY_TIMEOUT_SECONDS = 5.0

# In-memory bookkeeping for GET /status — intentionally not a DB table, this
# is throwaway operational metadata about the last manual scan, not a domain
# entity that needs persistence or audit history of its own.
_last_scan_at: Optional[str] = None


# ---------------------------------------------------------------------------
# stack_versions.json I/O
# ---------------------------------------------------------------------------
def load_stack_versions() -> dict[str, Any]:
    """Reads stack_versions.json fresh from disk (no caching — this service
    is the admin-facing read/write path and must always reflect the latest
    applied state)."""
    with open(STACK_VERSIONS_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _write_stack_versions(data: dict[str, Any]) -> None:
    with open(STACK_VERSIONS_PATH, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


# ---------------------------------------------------------------------------
# Version parsing helpers (no external semver dependency required)
# ---------------------------------------------------------------------------
_SPEC_PREFIX_RE = re.compile(r"^[\^~>=<!\s]*")
_NUM_CORE_RE = re.compile(r"^(\d+)(?:\.(\d+))?(?:\.(\d+))?")
_PIP_PRERELEASE_RE = re.compile(r"(a|b|rc|dev|pre)\d*", re.IGNORECASE)


def _bare_version(spec: str) -> str:
    """Strips a semver-range prefix (^, ~, >=, ...) off a version spec."""
    if not spec:
        return ""
    return _SPEC_PREFIX_RE.sub("", spec.strip())


def _version_tuple(v: str) -> tuple[int, int, int]:
    m = _NUM_CORE_RE.match(v or "")
    if not m:
        return (0, 0, 0)
    return tuple(int(g) if g else 0 for g in m.groups())


def _is_npm_stable(v: str) -> bool:
    # npm/semver prereleases carry a "-" suffix, e.g. 19.0.0-beta.1
    return "-" not in v


def _is_pip_prerelease(v: str) -> bool:
    core = _NUM_CORE_RE.match(v)
    rest = v[core.end():] if core else v
    return bool(_PIP_PRERELEASE_RE.search(rest))


def _format_like(current_spec: str, bare: Optional[str]) -> Optional[str]:
    """Re-applies the same range-prefix style as `current_spec` to a bare
    version string, so a suggestion can be pasted straight back into
    package.json / requirements.txt."""
    if not bare:
        return None
    if current_spec.startswith("^"):
        return f"^{bare}"
    if current_spec.startswith("~"):
        return f"~{bare}"
    if current_spec.startswith(">="):
        return f">={bare}"
    return bare


def _pip_base_name(spec: str) -> str:
    """Strips a pip extras suffix (e.g. 'psycopg[binary]' -> 'psycopg')."""
    m = re.match(r"^\s*([A-Za-z0-9_.\-]+)", spec or "")
    return m.group(1) if m else spec


def _tail(text: str, max_chars: int = 4000) -> str:
    text = text or ""
    return text[-max_chars:]


# ---------------------------------------------------------------------------
# scan_registries()
# ---------------------------------------------------------------------------
async def _scan_npm_package(client: httpx.AsyncClient, package: str, current_spec: str) -> dict[str, Any]:
    resp = await client.get(NPM_REGISTRY_URL.format(package=package))
    resp.raise_for_status()
    payload = resp.json()

    dist_tags: dict[str, str] = payload.get("dist-tags", {}) or {}
    versions: dict[str, Any] = payload.get("versions", {}) or {}

    current_bare = _bare_version(current_spec)
    current_major = _version_tuple(current_bare)[0]

    same_major_stable = [v for v in versions.keys() if _is_npm_stable(v) and _version_tuple(v)[0] == current_major]
    safe_bare = max(same_major_stable, key=_version_tuple) if same_major_stable else None
    if safe_bare and _version_tuple(safe_bare) <= _version_tuple(current_bare):
        safe_bare = None

    latest_bare = dist_tags.get("latest")

    test_bare = None
    for tag in ("next", "beta", "rc"):
        if dist_tags.get(tag):
            test_bare = dist_tags[tag]
            break

    update_available = bool(latest_bare) and _version_tuple(latest_bare) > _version_tuple(current_bare)

    return {
        "package": package,
        "ecosystem": "npm",
        "current": current_spec,
        "safe_update": _format_like(current_spec, safe_bare),
        "latest_stable": _format_like(current_spec, latest_bare),
        "latest_test": test_bare,
        "update_available": update_available,
        "error": None,
    }


async def _scan_pip_package(client: httpx.AsyncClient, package: str, current_spec: str) -> dict[str, Any]:
    base_name = _pip_base_name(package)
    resp = await client.get(PYPI_REGISTRY_URL.format(package=base_name))
    resp.raise_for_status()
    payload = resp.json()

    latest_bare = payload.get("info", {}).get("version")
    releases: dict[str, Any] = payload.get("releases", {}) or {}

    current_bare = _bare_version(current_spec)
    current_major = _version_tuple(current_bare)[0]

    stable_releases = [v for v in releases.keys() if not _is_pip_prerelease(v)]
    same_major_stable = [v for v in stable_releases if _version_tuple(v)[0] == current_major]
    safe_bare = max(same_major_stable, key=_version_tuple) if same_major_stable else None
    if safe_bare and _version_tuple(safe_bare) <= _version_tuple(current_bare):
        safe_bare = None

    prerelease_versions = [v for v in releases.keys() if _is_pip_prerelease(v)]
    newer_prereleases = [v for v in prerelease_versions if _version_tuple(v) >= _version_tuple(latest_bare or "0")]
    test_bare = max(newer_prereleases, key=_version_tuple) if newer_prereleases else None

    update_available = bool(latest_bare) and _version_tuple(latest_bare) > _version_tuple(current_bare)

    return {
        "package": package,
        "ecosystem": "pip",
        "current": current_spec,
        "safe_update": _format_like(current_spec, safe_bare),
        "latest_stable": _format_like(current_spec, latest_bare),
        "latest_test": test_bare,
        "update_available": update_available,
        "error": None,
    }


_SCAN_CONCURRENCY = 8


async def _scan_one(
    client: httpx.AsyncClient, semaphore: asyncio.Semaphore, section: str, package: str, info: dict[str, Any]
) -> dict[str, Any]:
    ecosystem = info.get("ecosystem", "npm" if section == "frontend" else "pip")
    current = info.get("current", "")
    async with semaphore:
        try:
            if ecosystem == "npm":
                return await _scan_npm_package(client, package, current)
            if ecosystem == "pip":
                return await _scan_pip_package(client, package, current)
            return {
                "package": package,
                "ecosystem": ecosystem,
                "current": current,
                "safe_update": None,
                "latest_stable": None,
                "latest_test": None,
                "update_available": False,
                "error": f"Ecossistema desconhecido: '{ecosystem}'",
            }
        except Exception as exc:
            return {
                "package": package,
                "ecosystem": ecosystem,
                "current": current,
                "safe_update": None,
                "latest_stable": None,
                "latest_test": None,
                "update_available": False,
                "error": f"{type(exc).__name__}: {exc}",
            }


async def scan_registries() -> list[dict[str, Any]]:
    """Scans npm/PyPI for the latest versions of every package listed in
    stack_versions.json.

    Fully async (httpx.AsyncClient, same pattern as app/ai/providers.py) so
    this never blocks the event loop — a bounded semaphore caps concurrency
    at `_SCAN_CONCURRENCY` simultaneous registry requests instead of hammering
    npm/PyPI with ~40 requests at once.

    A failure talking to a single package's registry (timeout, 404, DNS
    error, ...) is captured and reported as `error` on that one entry — it
    never aborts the rest of the scan.
    """
    global _last_scan_at
    stack = load_stack_versions()
    semaphore = asyncio.Semaphore(_SCAN_CONCURRENCY)

    async with httpx.AsyncClient(timeout=REGISTRY_TIMEOUT_SECONDS) as client:
        tasks = [
            _scan_one(client, semaphore, section, package, info)
            for section in ("frontend", "backend")
            for package, info in stack.get(section, {}).items()
        ]
        results = await asyncio.gather(*tasks)

    _last_scan_at = datetime.now(timezone.utc).isoformat()
    return list(results)


# ---------------------------------------------------------------------------
# test_candidate()
# ---------------------------------------------------------------------------
_FIXTURE_COPY_IGNORE = shutil.ignore_patterns(
    "node_modules", "dist", "package-lock.json", ".venv_candidate", "__pycache__", "*.pyc"
)


def _test_npm_candidate(package: str, version: str) -> dict[str, Any]:
    tmp_dir = tempfile.mkdtemp(prefix="lib_update_npm_")
    try:
        # Only copy source files — never the fixture's own node_modules/dist/
        # package-lock.json. Those are build artifacts from whatever was last
        # tested locally; copying them (instead of letting npm resolve fresh)
        # can carry over broken symlinks (e.g. node_modules/.bin/vite) across
        # directories and produce false failures unrelated to the candidate
        # version under test. Every candidate test must install from scratch.
        shutil.rmtree(tmp_dir, ignore_errors=True)
        shutil.copytree(FIXTURE_FRONTEND_DIR, tmp_dir, ignore=_FIXTURE_COPY_IGNORE)

        pkg_json_path = os.path.join(tmp_dir, "package.json")
        with open(pkg_json_path, "r", encoding="utf-8") as fh:
            pkg = json.load(fh)

        applied = False
        for section in ("dependencies", "devDependencies"):
            if package in pkg.get(section, {}):
                pkg[section][package] = version
                applied = True
        if not applied:
            pkg.setdefault("dependencies", {})[package] = version

        with open(pkg_json_path, "w", encoding="utf-8") as fh:
            json.dump(pkg, fh, indent=2)

        install_proc = subprocess.run(
            ["npm", "install"], cwd=tmp_dir, capture_output=True, text=True, timeout=600
        )
        if install_proc.returncode != 0:
            return {
                "passed": False,
                "step_failed": "npm install",
                "log_excerpt": _tail(install_proc.stdout + "\n" + install_proc.stderr),
                "vulnerabilities_found": 0,
            }

        build_proc = subprocess.run(
            ["npm", "run", "build"], cwd=tmp_dir, capture_output=True, text=True, timeout=600
        )
        if build_proc.returncode != 0:
            return {
                "passed": False,
                "step_failed": "npm run build",
                "log_excerpt": _tail(build_proc.stdout + "\n" + build_proc.stderr),
                "vulnerabilities_found": 0,
            }

        vulnerabilities_found = 0
        audit_log = ""
        try:
            audit_proc = subprocess.run(
                ["npm", "audit", "--json"], cwd=tmp_dir, capture_output=True, text=True, timeout=120
            )
            audit_data = json.loads(audit_proc.stdout or "{}")
            vulnerabilities_found = (
                audit_data.get("metadata", {}).get("vulnerabilities", {}).get("total", 0)
            )
            audit_log = audit_proc.stdout
        except Exception as exc:
            audit_log = f"npm audit não pôde ser interpretado: {exc}"

        return {
            "passed": True,
            "step_failed": None,
            "log_excerpt": _tail(build_proc.stdout + "\n" + audit_log),
            "vulnerabilities_found": vulnerabilities_found,
        }
    except subprocess.TimeoutExpired as exc:
        return {
            "passed": False,
            "step_failed": "timeout",
            "log_excerpt": _tail(str(exc)),
            "vulnerabilities_found": 0,
        }
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def _test_pip_candidate(package: str, version: str) -> dict[str, Any]:
    tmp_dir = tempfile.mkdtemp(prefix="lib_update_pip_")
    try:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        shutil.copytree(FIXTURE_BACKEND_DIR, tmp_dir, ignore=_FIXTURE_COPY_IGNORE)

        req_path = os.path.join(tmp_dir, "requirements.txt")
        with open(req_path, "r", encoding="utf-8") as fh:
            lines = fh.read().splitlines()

        base_name = _pip_base_name(package).lower()
        version_op_prefix = version.strip()[0] if version.strip() and version.strip()[0] in "=<>!~" else None
        pin = f"{package}{version}" if version_op_prefix else f"{package}=={version}"

        new_lines: list[str] = []
        found = False
        for line in lines:
            if _pip_base_name(line.strip()).lower() == base_name:
                new_lines.append(pin)
                found = True
            else:
                new_lines.append(line)
        if not found:
            new_lines.append(pin)

        with open(req_path, "w", encoding="utf-8") as fh:
            fh.write("\n".join(new_lines) + "\n")

        venv_dir = os.path.join(tmp_dir, ".venv_candidate")
        venv_proc = subprocess.run(
            [sys.executable, "-m", "venv", venv_dir], capture_output=True, text=True, timeout=120
        )
        if venv_proc.returncode != 0:
            return {
                "passed": False,
                "step_failed": "venv create",
                "log_excerpt": _tail(venv_proc.stdout + "\n" + venv_proc.stderr),
                "vulnerabilities_found": 0,
            }

        pip_bin = os.path.join(venv_dir, "bin", "pip")
        python_bin = os.path.join(venv_dir, "bin", "python")

        install_proc = subprocess.run(
            [pip_bin, "install", "-q", "-r", req_path],
            cwd=tmp_dir,
            capture_output=True,
            text=True,
            timeout=600,
        )
        if install_proc.returncode != 0:
            return {
                "passed": False,
                "step_failed": "pip install",
                "log_excerpt": _tail(install_proc.stdout + "\n" + install_proc.stderr),
                "vulnerabilities_found": 0,
            }

        # Reuses fixture/backend/main.py's own import list as the "build" /
        # smoke-test step for the backend ecosystem (it is guarded by
        # `if __name__ == "__main__":`, so importing it never starts uvicorn).
        import_proc = subprocess.run(
            [python_bin, "-c", "import main"],
            cwd=tmp_dir,
            capture_output=True,
            text=True,
            timeout=60,
        )
        if import_proc.returncode != 0:
            return {
                "passed": False,
                "step_failed": "import check",
                "log_excerpt": _tail(import_proc.stdout + "\n" + import_proc.stderr),
                "vulnerabilities_found": 0,
            }

        return {
            "passed": True,
            "step_failed": None,
            "log_excerpt": _tail(install_proc.stdout),
            "vulnerabilities_found": 0,
        }
    except subprocess.TimeoutExpired as exc:
        return {
            "passed": False,
            "step_failed": "timeout",
            "log_excerpt": _tail(str(exc)),
            "vulnerabilities_found": 0,
        }
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def test_candidate(ecosystem: str, package: str, version: str) -> dict[str, Any]:
    """Actually installs (and, for npm, builds) a candidate library version
    inside a throwaway copy of the guinea-pig fixture app before trusting it.

    This is a real `npm install`/`npm run build`/`pip install` run, so it is
    deliberately synchronous and can take anywhere from a few seconds to a
    couple of minutes depending on the package and the network — this is
    fine because it is a manual action an admin triggers once per candidate
    from the Library Updates Central UI, not a hot path.
    """
    if ecosystem == "npm":
        return _test_npm_candidate(package, version)
    if ecosystem == "pip":
        return _test_pip_candidate(package, version)
    return {
        "passed": False,
        "step_failed": "validation",
        "log_excerpt": f"Ecossistema desconhecido: '{ecosystem}'. Use 'npm' ou 'pip'.",
        "vulnerabilities_found": 0,
    }


# ---------------------------------------------------------------------------
# apply_update()
# ---------------------------------------------------------------------------
def apply_update(ecosystem: str, package: str, chosen_version: str) -> dict[str, Any]:
    """Persists the chosen candidate version into stack_versions.json on
    disk. Never touches git — committing/pushing this change to the shared
    `main` branch is a deliberate, separate, manual step."""
    section = "frontend" if ecosystem == "npm" else "backend"
    stack = load_stack_versions()
    stack.setdefault(section, {})[package] = {"ecosystem": ecosystem, "current": chosen_version}
    _write_stack_versions(stack)
    return stack


# ---------------------------------------------------------------------------
# status()
# ---------------------------------------------------------------------------
def get_status() -> dict[str, Any]:
    return {
        "last_scan_at": _last_scan_at,
        "stack_versions": load_stack_versions(),
    }
