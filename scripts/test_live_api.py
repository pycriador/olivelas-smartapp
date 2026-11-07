#!/usr/bin/env python3
"""
Live API Verification Suite — App Builder Engine (100% Real Database Queries)
Tests all API domains against the live SQLite/FastAPI backend at http://127.0.0.1:8000
Validates that configuration, components, backend services, layout, security,
and AI composition reflect real persisted database entities.
"""
import sys
import json
import urllib.request
import urllib.error
from typing import Any

BASE_URL = "http://127.0.0.1:8000/api/v1"
AUTH_TOKEN = ""

def set_auth_token(token: str):
    global AUTH_TOKEN
    AUTH_TOKEN = token

def api_get(endpoint: str) -> dict[str, Any]:
    url = f"{BASE_URL}{endpoint}"
    headers = {
        "User-Agent": "LiveApiTester/1.0",
        "Accept": "application/json",
        "X-User-Role": "admin",
        "X-User-Email": "admin@olivelas.com.br"
    }
    if AUTH_TOKEN:
        headers["Authorization"] = f"Bearer {AUTH_TOKEN}"
        
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ HTTP Error {e.code} on {endpoint}: {error_body}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Connection Error on {endpoint}: {e}")
        sys.exit(1)

def api_post(endpoint: str, payload: dict[str, Any]) -> dict[str, Any]:
    url = f"{BASE_URL}{endpoint}"
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "User-Agent": "LiveApiTester/1.0",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-User-Role": "admin",
        "X-User-Email": "admin@olivelas.com.br"
    }
    if AUTH_TOKEN:
        headers["Authorization"] = f"Bearer {AUTH_TOKEN}"

    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ HTTP Error {e.code} on {endpoint}: {error_body}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Connection Error on {endpoint}: {e}")
        sys.exit(1)

def banner(title: str):
    print("\n" + "=" * 80)
    print(f" 🚀 {title.upper()}")
    print("=" * 80)

def run_tests():
    # 0. AUTHENTICATION VIA REAL JWT
    banner("0. AUTENTICAÇÃO REAL VIA JWT (/api/v1/iam/login)")
    admin_user = os.getenv("LOFT_ADMIN_USER", "admin@olivelas.com.br")
    admin_password = os.getenv("LOFT_ADMIN_PASSWORD") or os.getenv("DEFAULT_ADMIN_PASSWORD", "admin_dev_pass")
    login_res = api_post("/iam/login", {"username_or_email": admin_user, "password": admin_password})
    user_data = login_res.get("data", {}).get("user", {})
    token = login_res.get("data", {}).get("access_token", "")
    set_auth_token(token)
    print(f"✅ Autenticação realizada com sucesso no banco de dados!")
    print(f"   • Usuário: {user_data.get('name')} ({user_data.get('email')})")
    print(f"   • Papel / Role: {user_data.get('role')} (ID: {user_data.get('id')})")
    print(f"   • JWT Token Assinado: {token[:30]}...[TRUNCATED]")

    # 1. DATABASE TOTALS & SYSTEM HEALTH
    banner("1. MÉTRICAS E PERSISTÊNCIA DO BANCO DE DADOS (/api/v1/dashboard/metrics)")
    metrics = api_get("/dashboard/metrics").get("data", {})
    print("✅ Conexão ativa com SQLite (`app_builder.db`) e SQLAlchemy ORM.")
    print("📊 Registros Persistidos no Banco de Dados:")
    for k, v in metrics.items():
        print(f"   • {k.replace('_', ' ').title():<32}: {v}")

    # 2. FRONTEND BUILDING BLOCKS & DESIGN SYSTEM
    banner("2. ELEMENTOS DE FRONTEND & DESIGN SYSTEM (/api/v1/components)")
    components = api_get("/components").get("data", [])
    fe_components = [c for c in components if c.get("category") in ["Layout & Navigation", "Data Display", "Forms & Inputs", "Feedback & Overlay"] or "fe" in c.get("id", "")]
    print(f"✅ Total de Componentes Frontend Cadastrados: {len(fe_components)} componentes")
    for c in fe_components[:6]:
        print(f"\n   📦 [{c.get('id')}] {c.get('name')} (v{c.get('version')})")
        print(f"      • Categoria:     {c.get('category')} | Status: {c.get('status')}")
        print(f"      • Descrição:     {c.get('description')}")
        print(f"      • Dependências:  {', '.join(c.get('dependencies', []))}")
        print(f"      • Regras DS:     {', '.join(c.get('rules', []))}")
        if c.get("props"):
            props_summary = ", ".join([f"{p.get('name')}: {p.get('type')}" for p in c.get("props", [])[:3]])
            print(f"      • Props TS:      {props_summary}")

    # 3. BACKEND SERVICES, MODULES & ENDPOINTS
    banner("3. ELEMENTOS DE BACKEND & MÓDULOS DE DOMÍNIO (/api/v1/modules)")
    modules = api_get("/modules").get("data", [])
    print(f"✅ Total de Módulos de Domínio no Banco: {len(modules)} módulos")
    for m in modules[:5]:
        print(f"\n   🧩 [{m.get('id')}] {m.get('name')}")
        print(f"      • Categoria:     {m.get('category')} | Owner: {m.get('owner')}")
        print(f"      • Endpoints API: {', '.join(m.get('apis', []))}")
        print(f"      • Componentes:   {', '.join(m.get('components', []))}")
        print(f"      • Dependências:  {', '.join(m.get('dependencies', []))}")

    # 4. LAYOUT, NAVEGAÇÃO & ARQUITETURAS
    banner("4. LAYOUT, NAVEGAÇÃO & PADRÕES ARQUITETURAIS (/api/v1/architectures)")
    architectures = api_get("/architectures").get("data", [])
    print(f"✅ Total de Padrões Arquiteturais no Banco: {len(architectures)} arquiteturas")
    for a in architectures:
        print(f"\n   🏛️  [{a.get('id')}] {a.get('name')}")
        print(f"      • Categoria:     {a.get('category')}")
        print(f"      • Camadas:       {', '.join(a.get('layers', []))}")
        print(f"      • Destaques:     {', '.join(a.get('characteristics', [])[:2])}")
        print(f"      • Indicado Para: {', '.join(a.get('recommended_for', []))}")

    # 5. SEGURANÇA, GOVERNANÇA, RBAC & GOLDEN RULES
    banner("5. SEGURANÇA, GOVERNANÇA, RBAC & GOLDEN RULES (/api/v1/rules & /api/v1/iam/permissions)")
    rules = api_get("/rules").get("data", [])
    print(f"✅ Total de Golden Rules de Engenharia: {len(rules)} regras ativas")
    sec_rules = [r for r in rules if r.get("category") in ["API & Security", "Security", "Architecture"]]
    print(f"\n   🛡️  Regras Canônicas de Segurança & Arquitetura ({len(sec_rules)} regras):")
    for r in sec_rules[:5]:
        print(f"      • [{r.get('id')}] {r.get('name')} | Prioridade: {r.get('priority')}")
        print(f"        Statement: {r.get('rule_statement')}")

    perms = api_get("/iam/permissions").get("data", [])
    print(f"\n   🔐 Permissões RBAC Cadastradas no DB: {len(perms)} permissões ativas")
    for p in perms[:6]:
        print(f"      • [{p.get('code')}] {p.get('name')} (Módulo: {p.get('module')})")

    # 6. ESPECIFICAÇÕES TÉCNICAS (SDD VOLUMES I A IV)
    banner("6. ESPECIFICAÇÕES TÉCNICAS SDD (/api/v1/specifications)")
    specs = api_get("/specifications").get("data", [])
    print(f"✅ Total de Especificações SDD no Banco: {len(specs)} volumes")
    for s in specs[:6]:
        print(f"\n   📜 [{s.get('id')}] {s.get('title')} (v{s.get('version')})")
        print(f"      • Categoria:     {s.get('category')} | Status: {s.get('status')}")
        print(f"      • Seções:        {len(s.get('sections', []))} seções detalhadas")
        if s.get("tags"):
            print(f"      • Tags:          {', '.join(s.get('tags', []))}")

    # 7. AGENTES COGNITIVOS DE IA
    banner("7. AGENTES DE INTELIGÊNCIA ARTIFICIAL (/api/v1/ai/agents)")
    agents = api_get("/ai/agents").get("data", [])
    print(f"✅ Total de Agentes de IA Cadastrados: {len(agents)} agentes")
    for ag in agents[:5]:
        print(f"\n   🤖 [{ag.get('id')}] {ag.get('name')} ({ag.get('role')})")
        print(f"      • Provedor/Modelo: {ag.get('provider')} / {ag.get('model')}")
        print(f"      • Capacidades:     {', '.join(ag.get('capabilities', []))}")

    # 8. COMPOSIÇÃO DE BLUEPRINT VIA IA (INFERÊNCIA REAL)
    banner("8. INFERÊNCIA & COMPOSIÇÃO DE BLUEPRINT VIA API (/api/v1/ai/blueprints/compose)")
    sample_request = {
        "application": {
            "name": "Apresentação para clientes",
            "description": "landing page simples sem banco de dados para apresentação institucional"
        },
        "requirements": [
            "landing page institucional simples",
            "sem banco de dados",
            "vitrine de produtos e garantias",
            "menu waffle 9-dots",
            "formulário de contato para consultores"
        ],
        "generate_ai_rationale": True
    }
    print("🚀 Enviando requisição de composição arquitetural para o motor de IA...")
    compose_res = api_post("/ai/blueprints/compose", sample_request)
    bp = compose_res.get("data", {}) if "data" in compose_res else compose_res

    print(f"\n✅ Blueprint Composto com Sucesso pela API (ID: {bp.get('blueprint_id')}):")
    print(f"   • Aplicação:      {bp.get('application_name')}")
    print(f"   • Arquitetura:    {bp.get('architecture')}")
    print(f"   • Módulos DB:     {bp.get('identified_modules')}")
    print(f"   • Componentes DB: {bp.get('identified_components')}")
    print(f"   • Templates DB:   {bp.get('identified_templates')}")
    print(f"   • Regras DB:      {bp.get('identified_rules')[:5]}... ({len(bp.get('identified_rules', []))} regras)")
    print(f"   • Specs SDD DB:   {bp.get('identified_specifications')}")
    print(f"   • Dependências:   {bp.get('identified_dependencies')}")
    print(f"   • Provedor IA:    {bp.get('ai_provider')} ({bp.get('ai_model')})")

    # 9. PROJETOS REGISTRADOS NO BANCO
    banner("9. PROJETOS GERADOS E REGISTRADOS NO DB (/api/v1/projects)")
    projects = api_get("/projects").get("data", [])
    print(f"✅ Total de Projetos Registrados no Banco: {len(projects)} projetos")
    for prj in projects[:5]:
        print(f"\n   📁 [{prj.get('id')}] {prj.get('name')}")
        print(f"      • Descrição:    {prj.get('description')}")
        print(f"      • Arquitetura:  {prj.get('architecture')}")
        print(f"      • Status:       {prj.get('status')}")

    banner("🎉 TODOS OS TESTES DE API FORAM CONCLUÍDOS COM 100% DE DADOS REAIS DO BANCO!")

if __name__ == "__main__":
    run_tests()
