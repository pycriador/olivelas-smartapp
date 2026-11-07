# 📦 App Builder Engine Python SDK (`api_client`)

> SDK Python oficial e cliente de integração para a plataforma **Loft App Builder Engine**.  
> Permite compor blueprints de arquitetura via IA, consultar catálogos de componentes Copan, validar regras de engenharia e scaffoldar aplicações fullstack de forma 100% automatizada.

---

## 🚀 Instalação & Importação

O cliente foi desenvolvido com **zero dependências obrigatórias externas** (utiliza a biblioteca padrão do Python `urllib` e tipagens modernas), com suporte a `httpx` e `requests` se disponíveis.

```python
from api_client import AppBuilderClient, ApiClientConfig
```

---

## 💻 Guia Rápido de Uso

### 1. Inicializar o Cliente
```python
from api_client import AppBuilderClient

# Conectar à API local ou remota
client = AppBuilderClient(base_url="http://127.0.0.1:8000")

# Verificar status da plataforma
health = client.health_check()
print(health)
```

### 2. Autenticação & IAM
```python
# Login seguro com retorno de JWT Bearer Token via variáveis de ambiente
import os
login = client.auth.login(
    username_or_email=os.getenv("LOFT_ADMIN_USER", "admin@loft.com.br"),
    password=os.getenv("LOFT_ADMIN_PASSWORD", "")
)
print(f"Token ativo: {login.access_token}")
```

### 3. Composição de Blueprints via AI Gateway
```python
# O AI Gateway interpreta os requisitos em linguagem natural e resolve:
# - Padrão de arquitetura
# - Módulos de domínio
# - Componentes frontend/backend
# - Golden Rules de engenharia
# - Contratos REST de API
# - Checklist de segurança
blueprint = client.ai.compose_blueprint(
    name="Loft Fiança Aluguel",
    description="Portal de esteira de garantia locatícia e análise de crédito",
    requirements=[
        "Autenticação JWT com RBAC",
        "Tabela de propostas com filtros e paginação",
        "Formulário modal de cadastro com validação de CPF",
        "App Switcher 9-dots ancorado no cabeçalho",
    ]
)

print(f"Arquitetura: {blueprint.architecture_name}")
print(f"Módulos resolvidos: {len(blueprint.resolved_modules)}")
```

### 4. Consultas ao Catálogo e Grafo 360°
```python
# Listar componentes Copan
components = client.catalog.list_components(category="Data Display")

# Consultar Golden Rules de engenharia com Good vs Bad code
rules = client.catalog.list_rules(priority="REQUIRED")

# Consultar o Grafo de Conhecimento 360° de uma entidade
relations = client.catalog.get_relations_360("component", "cmp_fe_data_table")
```

### 5. Registro de Projetos & Blueprints
```python
project = client.projects.create_project(
    name="Loft Fiança Aluguel",
    description="Portal de esteira de garantia locatícia",
    template_id="tpl_loft_credit_risk_engine",
)
print(f"Projeto registrado na plataforma com ID: {project.id}")
```

### 6. Scaffolding 100% Automático no Disco
```python
from api_client.scaffolder import ApplicationScaffolder

scaffolder = ApplicationScaffolder(target_dir="./meu-novo-app")
resultado = scaffolder.scaffold(
    blueprint=blueprint,
    app_name="Loft Fiança Aluguel"
)
print(f"{resultado['files_created_count']} arquivos criados com sucesso!")
```

---

## 🏛️ Estrutura do Pacote `api_client`

```
api_client/
├── __init__.py                # Exports públicos do SDK
├── client.py                  # Classe unificada AppBuilderClient
├── config.py                  # Configurações (URL, timeouts, tokens)
├── exceptions.py              # Exceções tipadas (Auth, Validation, 404, Connection)
├── http_client.py             # Transporte HTTP resiliente com retries e envelopes
├── models.py                  # DTOs e modelos de dados
├── scaffolder/
│   ├── __init__.py
│   └── generator.py           # Gerador determinístico de código fullstack
└── services/
    ├── __init__.py
    ├── ai_agent_service.py    # AI Gateway (/api/v1/ai/...)
    ├── audit_service.py       # Trilha de auditoria (/api/v1/audit/...)
    ├── auth_service.py        # IAM & Autenticação (/api/v1/iam/...)
    ├── blueprints_service.py  # Gestão de Blueprints (/api/v1/blueprints/...)
    ├── builder_service.py     # Project Builder Engine (/api/v1/builder/...)
    ├── catalog_service.py     # Catálogos & Grafo 360° (/api/v1/...)
    ├── projects_service.py    # Gestão de Projetos (/api/v1/projects/...)
    └── settings_service.py    # Configurações & Matriz RBAC (/api/v1/settings/...)
```
