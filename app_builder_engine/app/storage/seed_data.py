"""
Canonical Seed Data for App Builder Engine
Structured catalog of Components, Rules, Architecture Patterns, and Templates extracted from Loft SDDs
"""
from __future__ import annotations
from app.domain.models import (
    LoftComponent,
    ComponentLayer,
    ComponentCategory,
    ArchitecturalRule,
    RuleCategory,
    RuleSeverity,
    ArchitecturePattern,
    CodeTemplate,
)

# ---------------------------------------------------------------------------
# 1. CANONICAL COMPONENTS (Frontend + Backend)
# ---------------------------------------------------------------------------
SEED_COMPONENTS: list[LoftComponent] = [
    # FRONTEND COMPONENTS (Tier 1 Foundation + Navigation)
    LoftComponent(
        id="fe-page-header",
        name="PageHeader",
        layer=ComponentLayer.FRONTEND,
        category=ComponentCategory.UI_FOUNDATION,
        description="Cabeçalho padrão para páginas com título H1/H2, breadcrumbs, subtítulo e ações principais, composto a partir de primitivas Copan (Flex + Typography + Breadcrumbs + Button).",
        responsibilities=[
            "Renderizar título e hierarquia da página com Typography",
            "Exibir breadcrumbs contextuais com Breadcrumbs",
            "Posicionar ações primárias e secundárias à direita com Flex",
            "Exibir tags de status quando relevante com Tag",
        ],
        dependencies=["@loft/react-loft (Flex, Typography, Breadcrumbs, Button, Tag)"],
        allowed_imports=["@loft/react-loft", "@loft/tokens-loft", "@loft/react-icons"],
        forbidden_imports=["antd", "@ant-design/icons", "@mui/*", "styled-components"],
        interface_spec="interface PageHeaderProps { title: string; subtitle?: string; breadcrumbs?: { text: string; href?: string }[]; extra?: React.ReactNode; status?: React.ReactNode }",
        example_usage="<Flex flexDirection=\"column\" gap=\"base02\">\n  <Breadcrumbs items={breadcrumbs} />\n  <Flex justifyContent=\"space-between\" alignItems=\"center\">\n    <Typography textStyle=\"h2\" as=\"h1\">Contratos de Aluguel</Typography>\n    <Button variant=\"primary\">Novo Contrato</Button>\n  </Flex>\n</Flex>",
        rules_of_use=[
            "Toda página principal deve iniciar com um PageHeader",
            "Ação principal usa Button variant='primary' — a cor de marca já vem do Copan, nunca hardcode hex",
            "Breadcrumbs.items é data-driven ({text, href?}); o item da página atual não deve ter href",
        ],
    ),
    LoftComponent(
        id="fe-app-switcher",
        name="AppSwitcher (Waffle Menu)",
        layer=ComponentLayer.FRONTEND,
        category=ComponentCategory.NAVIGATION,
        description="Menu de 9 pontos ('waffle') fixo no canto esquerdo da viewport para alternar entre produtos do ecossistema Loft, composto com DropdownMenu + ActionButton do Copan.",
        responsibilities=[
            "Navegação entre produtos Loft (Fiança Aluguel, Sites, Adm Imóveis, CRM, Financiamento, Portal)",
            "Posicionamento fixed ancorado à esquerda da tela",
            "Lista de produtos via DropdownMenu.menuItems, com Typography para os títulos",
            "Produto atual destacado com Tag/StatusLight em vez de cor hardcoded",
        ],
        dependencies=["@loft/react-loft (DropdownMenu, ActionButton, Typography, Tag)", "@loft/react-icons", "@loft/tokens-loft (color)"],
        allowed_imports=["@loft/react-loft", "@loft/react-icons", "@loft/tokens-loft"],
        forbidden_imports=["antd", "@ant-design/icons", "@mui/*"],
        interface_spec="interface AppSwitcherProps { currentProductKey: string; onNavigate?: (productKey: string) => void }",
        example_usage="<DropdownMenu\n  menuItems={products.map((p) => ({ label: p.name, onClick: () => onNavigate?.(p.key) }))}\n  open={isOpen}\n  onDismiss={() => setIsOpen(false)}\n  placement=\"bottom-start\"\n>\n  <ActionButton aria-label=\"Alternar produto Loft\" quiet onClick={() => setIsOpen(true)}>\n    <GridIcon size=\"md\" color={color.icon.primary} />\n  </ActionButton>\n</DropdownMenu>",
        rules_of_use=[
            "Painel deve ser position: fixed com left: 0 abaixo do header",
            "Produto atual usa color.background.brand ou color.decorative.* + Tag de destaque — nunca hex fixo (#EAF9EF, #0B6B4F etc.)",
            "DropdownMenu é controlado (open/onDismiss geridos pelo componente pai); o trigger deve ser ActionButton para acessibilidade",
        ],
    ),
    LoftComponent(
        id="fe-data-table",
        name="DataTable",
        layer=ComponentLayer.FRONTEND,
        category=ComponentCategory.DATA_DISPLAY,
        description="Tabela padronizada com paginação, ordenação, seleção, estados de loading, empty state e actions por linha, construída sobre a família Table do Copan.",
        responsibilities=[
            "Apresentar dados tabulares com Table/TableHead/TableBody/TableRow/TableHeader/TableData",
            "Gerenciar paginação controlada (page, pageSize, total) fora da Table",
            "Exibir CircularLoader durante carregamento e um estado vazio (Typography) quando não há dados",
        ],
        dependencies=["@loft/react-loft (Table, TableHead, TableBody, TableRow, TableHeader, TableData, CircularLoader, Typography)"],
        allowed_imports=["@loft/react-loft", "@loft/tokens-loft"],
        forbidden_imports=["antd", "ag-grid", "react-table", "@mui/*"],
        interface_spec="interface DataTableProps<T> { columns: { key: string; header: string; render: (row: T) => React.ReactNode }[]; data: T[]; loading?: boolean; pagination?: { current: number; pageSize: number; total: number; onChange: (p: number, ps: number) => void } }",
        example_usage="<Table spacing=\"innerBase02\">\n  <TableHead>\n    <TableRow>\n      {columns.map((c) => <TableHeader asText key={c.key}>{c.header}</TableHeader>)}\n    </TableRow>\n  </TableHead>\n  <TableBody>\n    {data.map((row) => (\n      <TableRow key={row.id}>\n        {columns.map((c) => <TableData asText key={c.key}>{c.render(row)}</TableData>)}\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>",
        rules_of_use=[
            "Nunca fazer fetching interno dentro da tabela; dados e loading vêm exclusivamente via props",
            "Valores monetários formatados em R$ 1.234,56 e datas em DD/MM/YYYY, renderizados dentro de TableData asText",
            "Paginação é externa à Table (o Copan não tem Table.Pagination); sincronizar via pagination.onChange",
        ],
    ),
    LoftComponent(
        id="fe-filter-bar",
        name="FilterBar",
        layer=ComponentLayer.FRONTEND,
        category=ComponentCategory.DATA_DISPLAY,
        description="Barra de busca e filtros rápidos (Status, Período, Tags) com suporte a sincronização via URL query params, construída com Flex + TextField + Select do Copan.",
        responsibilities=[
            "Fornecer campo de busca textual com debounce via TextField",
            "Agrupar Select e filtros adicionais em um Flex",
            "Botão para limpar filtros ativos com Button variant='secondary'",
        ],
        dependencies=["@loft/react-loft (Flex, TextField, Select, Option, Button)"],
        allowed_imports=["@loft/react-loft", "@loft/tokens-loft"],
        forbidden_imports=["antd", "@mui/*"],
        interface_spec="interface FilterBarProps { onSearch: (val: string) => void; onFilterChange: (filters: Record<string, any>) => void; onClear: () => void }",
        example_usage="<Flex gap=\"base02\" alignItems=\"center\" flexWrap=\"wrap\">\n  <TextField id=\"search\" label=\"Buscar\" onChange={(e) => onSearch(e.target.value)} />\n  <Select id=\"status\" label=\"Status\" value={status} onChange={(e) => onFilterChange({ status: e.target.value })}>\n    <Option value=\"active\">Ativo</Option>\n    <Option value=\"inactive\">Inativo</Option>\n  </Select>\n  <Button variant=\"secondary\" onClick={onClear}>Limpar filtros</Button>\n</Flex>",
        rules_of_use=[
            "Filtros devem sincronizar com query params do TanStack Router para permitir compartilhamento de URL",
            "Não há um DatePicker confirmado no catálogo Copan — verificar a documentação oficial (copan-loft.loft.technology) antes de usar um para filtro de período, não assumir a API",
        ],
    ),

    # BACKEND COMPONENTS (Platform + Security + AI)
    LoftComponent(
        id="be-auth-service",
        name="AuthService & TokenService",
        layer=ComponentLayer.BACKEND,
        category=ComponentCategory.AUTH_SECURITY,
        description="Serviço de autenticação e geração/validação de tokens JWT com criptografia Argon2id.",
        responsibilities=[
            "Validar credenciais de usuários e senhas com Argon2id",
            "Emitir JWT assinados com expiração curta e allowlist de algoritmos",
            "Isolar lógica de autenticação sem vazar para os controllers",
        ],
        dependencies=["fastapi", "PyJWT", "pwdlib[argon2]"],
        allowed_imports=["jwt", "pwdlib", "pydantic"],
        forbidden_imports=["passlib", "flask_login"],
        interface_spec="class AuthService: async def authenticate_user(email, password) -> User; async def create_tokens(user_id, tenant_id, roles) -> TokenPair",
        example_usage="tokens = await auth_service.authenticate_user(body.email, body.password)",
        rules_of_use=[
            "Nunca colocar informações sensíveis (senhas, CPF, segredos) no payload do JWT",
            "Autenticação nunca substitui autorização sobre o recurso específico",
        ],
    ),
    LoftComponent(
        id="be-tenant-access-service",
        name="TenantAccessService",
        layer=ComponentLayer.BACKEND,
        category=ComponentCategory.AUTH_SECURITY,
        description="Garante isolamento estrito de dados multi-tenant em todas as queries e mutações.",
        responsibilities=[
            "Derivar tenant_id a partir do contexto de segurança autenticado",
            "Validar que o usuário possui acesso ao tenant solicitado",
            "Injetar filtro de tenant_id em todas as consultas a banco e busca RAG",
        ],
        dependencies=["fastapi", "sqlalchemy"],
        allowed_imports=["sqlalchemy.ext.asyncio"],
        forbidden_imports=[],
        interface_spec="class TenantAccessService: def enforce_tenant(session, current_user, tenant_id: UUID) -> None",
        example_usage="tenant_service.enforce_tenant(session, current_user, request.tenant_id)",
        rules_of_use=[
            "Nunca confiar em tenant_id enviado no body ou query pelo cliente — derivar sempre do token autenticado",
        ],
    ),
    LoftComponent(
        id="be-llm-gateway",
        name="LLMGateway & AIService",
        layer=ComponentLayer.BACKEND,
        category=ComponentCategory.AI_INTELLIGENCE,
        description="Gateway agnóstico para provedores de IA (OpenAI, Anthropic, Google, Local), com suporte a structured output, tracking de tokens e limites de execução.",
        responsibilities=[
            "Isolar o domínio da aplicação dos SDKs de provedores de IA",
            "Garantir structured output validado via Pydantic/Instructor",
            "Aplicar limites de tokens, iterações máximas e timeouts estritos",
            "Registrar telemetria de custos e latência",
        ],
        dependencies=["fastapi", "httpx", "pydantic", "instructor"],
        allowed_imports=["instructor", "pydantic"],
        forbidden_imports=["openai direto nos controllers", "anthropic direto nos services de domínio"],
        interface_spec="class LLMGateway: async def generate_structured[T: BaseModel](prompt: str, response_model: type[T], context: dict) -> T",
        example_usage="summary = await llm_gateway.generate_structured(prompt, ContractSummarySchema, context={'tenant_id': current_user.tenant_id})",
        rules_of_use=[
            "Nenhuma regra de negócio deve depender diretamente de um provedor de IA",
            "Saídas de IA devem ser sempre validadas contra schemas Pydantic antes de mutar dados de negócio",
        ],
    ),
    LoftComponent(
        id="be-audit-service",
        name="AuditService",
        layer=ComponentLayer.BACKEND,
        category=ComponentCategory.OBSERVABILITY,
        description="Serviço de auditoria e governança para rastreabilidade de ações privilegiadas e mutações de dados.",
        responsibilities=[
            "Registrar eventos imutáveis com actor_id, tenant_id, resource_type, resource_id, action e diff",
            "Garantir conformidade regulatória e auditoria de segurança",
        ],
        dependencies=["sqlalchemy (AsyncSession)"],
        allowed_imports=["sqlalchemy"],
        forbidden_imports=[],
        interface_spec="class AuditService: async def record_event(actor_id, tenant_id, action, resource_type, resource_id, metadata) -> AuditLog",
        example_usage="await audit_service.record_event(current_user.id, current_user.tenant_id, 'CONTRACT_APPROVED', 'contract', contract.id, {'amount': contract.amount})",
        rules_of_use=[
            "Audit é diferente de Logging: logs são operacionais; audit é governança e persistência permanente",
        ],
    ),
]

# ---------------------------------------------------------------------------
# 2. ARCHITECTURAL RULES (Golden Rules & Security)
# ---------------------------------------------------------------------------
SEED_RULES: list[ArchitecturalRule] = [
    # FRONTEND RULES
    ArchitecturalRule(
        id="FE-001",
        title="Uso Obrigatório do Copan (Design System Loft)",
        category=RuleCategory.FRONTEND,
        severity=RuleSeverity.CRITICAL,
        statement="Toda UI de uma aplicação padrão Loft deve ser construída com os pacotes reais do Copan — '@loft/react-loft' (componentes), '@loft/tokens-loft' (tokens de cor/espaçamento/tipografia) e '@loft/react-icons' (ícones). Nunca usar Ant Design, Material UI, Chakra ou qualquer biblioteca de UI genérica, nem hex/rgb hardcoded no lugar de tokens.",
        rationale="O Copan é o design system oficial da Loft (https://copan-loft.loft.technology/) — usá-lo de fato, e não apenas copiar sua paleta de cores, é o que garante acessibilidade, responsividade e consistência visual entre produtos. Os pacotes '@loft/*' são privados e exigem um NPM_TOKEN com acesso ao escopo '@loft' configurado no '.npmrc' do projeto gerado ('//registry.npmjs.org/:_authToken=${NPM_TOKEN}') — isso é esperado para aplicações internas Loft, que é o público deste gerador.",
        bad_example="import { Button, Table } from 'antd'; // usa só a cor de marca via ConfigProvider, não é Copan",
        good_example="import { Button } from '@loft/react-loft';\nimport { color } from '@loft/tokens-loft';\n// variant='primary' já aplica a cor de marca Loft — nunca hex hardcoded",
        referenced_sdd="sdd-frontend/Volume I — Loft Design System",
    ),
    ArchitecturalRule(
        id="FE-002",
        title="Separação de Server State e Client State",
        category=RuleCategory.FRONTEND,
        severity=RuleSeverity.MUST,
        statement="Dados de API devem ser gerenciados exclusivamente pelo TanStack Query; nunca armazenar cache de servidor em Zustand ou React state.",
        rationale="Evita inconsistências de cache, problemas de sincronização e mutações órfãs.",
        bad_example="const [users, setUsers] = useState([]); useEffect(() => { fetch('/api/users').then(...) }, []);",
        good_example="const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });",
        referenced_sdd="sdd-frontend/Volume II — Loft Frontend Foundation",
    ),
    ArchitecturalRule(
        id="FE-003",
        title="Tratamento Obrigatório de Estados de Interface",
        category=RuleCategory.FRONTEND,
        severity=RuleSeverity.MUST,
        statement="Toda tela com dados deve tratar explicitamente os 7 estados: Loading, Success, Empty (No Data), No Results (Filtro sem resultado), Error (com retry), Permission Denied e Not Found.",
        rationale="Garante experiência de usuário consistente e feedback claro em todas as condições operacionais.",
        bad_example="{data.map(item => <Row item={item} />)} // Falha silenciosa ou tela branca se data for undefined",
        good_example="if (isLoading) return <LoadingSkeleton />;\nif (isError) return <ErrorState onRetry={refetch} />;\nif (data.length === 0) return <EmptyState />;",
        referenced_sdd="sdd-frontend/Volume IV — Loft Frontend Specification",
    ),

    # BACKEND RULES
    ArchitecturalRule(
        id="BE-001",
        title="Routers sem Regra de Negócio ou SQL Direto",
        category=RuleCategory.BACKEND,
        severity=RuleSeverity.CRITICAL,
        statement="Routers FastAPI não devem conter regras de negócio, chamadas SQL diretas ou SDK de provedores de IA.",
        rationale="Mantém o baixo acoplamento e obedece ao fluxo: Router -> Service -> Domain/Policy -> Repository -> Database.",
        bad_example="@router.post('/orders')\nasync def create_order(db: AsyncSession = Depends(get_db)): db.execute(insert(...))",
        good_example="@router.post('/orders', response_model=OrderResponse)\nasync def create_order(body: OrderCreate, service: OrderService = Depends()): return await service.create_order(body)",
        referenced_sdd="sdd-backend/Loft Backend Engineering System",
    ),
    ArchitecturalRule(
        id="BE-002",
        title="SQLAlchemy Models não são Schemas de API",
        category=RuleCategory.BACKEND,
        severity=RuleSeverity.MUST,
        statement="Modelos do SQLAlchemy nunca devem ser expostos diretamente na resposta HTTP. Toda entrada e saída deve usar schemas Pydantic v2 separados (Create, Update, Response).",
        rationale="Evita vazamento de colunas internas (ex: password_hash, tenant_id interno) e vulnerabilidades de Mass Assignment.",
        bad_example="@router.get('/user/{id}', response_model=UserModel)",
        good_example="@router.get('/user/{id}', response_model=UserResponseSchema)",
        referenced_sdd="sdd-backend/Loft Backend Foundation",
    ),

    # SECURITY RULES
    ArchitecturalRule(
        id="SEC-001",
        title="Zero Trust e Isolamento Multi-Tenant",
        category=RuleCategory.SECURITY,
        severity=RuleSeverity.CRITICAL,
        statement="Nunca confiar em tenant_id enviado no payload ou query pelo cliente. O tenant_id deve ser derivado do contexto autenticado.",
        rationale="Previne vulnerabilidades de acesso indevido cruzado entre imobiliárias ou clientes (BOLA/IDOR).",
        bad_example="tenant_id = request.json.get('tenant_id')",
        good_example="tenant_id = current_authenticated_user.tenant_id",
        referenced_sdd="sdd-backend/Loft Backend Security Specification",
    ),
    ArchitecturalRule(
        id="SEC-002",
        title="Proibição de Segredos em Código e Logs",
        category=RuleCategory.SECURITY,
        severity=RuleSeverity.CRITICAL,
        statement="Nunca armazenar chaves de API, senhas ou segredos em código, repositório ou nos logs estruturados.",
        rationale="Protege a infraestrutura contra vazamentos e acessos não autorizados.",
        bad_example="logger.info(f'User logged in with password {password}')",
        good_example="logger.info('User authenticated successfully', extra={'user_id': user.id})",
        referenced_sdd="sdd-backend/Loft Backend Security Specification",
    ),

    # AI RULES (AI-BAS)
    ArchitecturalRule(
        id="AI-001",
        title="Isolamento de Provedores de IA via Gateway",
        category=RuleCategory.AI_BAS,
        severity=RuleSeverity.CRITICAL,
        statement="Nenhuma regra de negócio deve depender diretamente de SDK de fornecedor de IA (OpenAI, Anthropic). Todas as chamadas passam por AIService -> LLMGateway.",
        rationale="Permite troca de modelos, fallback, controle de custos e testes automatizados sem dependência de terceiros.",
        bad_example="import openai\nclient = openai.OpenAI()\nresp = client.chat.completions.create(...)",
        good_example="result = await llm_gateway.generate_structured(prompt, OutputSchema)",
        referenced_sdd="sdd-backend/Loft Backend AI Specification",
    ),
    ArchitecturalRule(
        id="AI-002",
        title="Validação Determinística Obrigatória de Structured Output",
        category=RuleCategory.AI_BAS,
        severity=RuleSeverity.MUST,
        statement="Toda resposta de LLM que for alterar o banco de dados deve ser validada contra um Schema Pydantic estrito e passar por validações determinísticas de negócio.",
        rationale="Modelos probabilísticos podem alucinar campos ou valores fora dos limites válidos.",
        bad_example="db.save(llm_output_dict)",
        good_example="validated_data = OutputSchema.model_validate(llm_output_json)\nawait domain_service.verify_business_rules(validated_data)",
        referenced_sdd="sdd-backend/Loft Backend AI Specification",
    ),
]

# ---------------------------------------------------------------------------
# 3. ARCHITECTURE PATTERNS
# ---------------------------------------------------------------------------
SEED_ARCHITECTURES: list[ArchitecturePattern] = [
    ArchitecturePattern(
        id="arch-fastapi-react-loft",
        name="Padrão Oficial Loft: FastAPI + React/Copan",
        description="Arquitetura desacoplada Fullstack recomendada pela Loft. Backend assíncrono em camadas limpas + Frontend SPA com Copan (@loft/react-loft + @loft/tokens-loft).",
        folder_structure="""project/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/ (config, security, errors, logging)
│   │   ├── api/v1/ (routers REST)
│   │   ├── models/ (SQLAlchemy models)
│   │   ├── schemas/ (Pydantic v2 Create/Update/Response)
│   │   ├── services/ (Application use cases)
│   │   ├── domain/ (Entities, Policies)
│   │   ├── repositories/ (Database access)
│   │   └── ai/ (Gateway, Providers, Prompts)
│   └── tests/
└── frontend/
    ├── src/
    │   ├── app/ (Providers, Root Router)
    │   ├── components/ (Loft Component Catalog)
    │   ├── features/ (Módulos por domínio)
    │   ├── services/ (API Clients)
    │   └── theme/ (@loft/tokens-loft re-exports, sem ConfigProvider de terceiros)
    └── package.json""",
        core_layers=[
            "Presentation (React + Copan — @loft/react-loft, @loft/tokens-loft, @loft/react-icons)",
            "API Layer (FastAPI Routers + Pydantic v2)",
            "Application Services (Business Use Cases)",
            "Domain & Policies (Core logic & Zero Trust Rules)",
            "Persistence & Repositories (SQLAlchemy 2.x Async + asyncpg)",
            "AI Layer (AI-BAS LLMGateway)",
        ],
        data_flow="UI Action -> TanStack Query -> API Client -> FastAPI Router -> Application Service -> Domain Policy -> Repository -> PostgreSQL / LLMGateway",
        best_for=[
            "Aplicações corporativas e portais Loft",
            "Sistemas imobiliários, CRM, gestão de contratos e esteiras de crédito",
            "Aplicações integradas com IA generativa e RAG",
        ],
        constraints=[
            "Sempre usar '@loft/react-loft' + '@loft/tokens-loft' para UI — nunca Ant Design/Material UI/Chakra nem hex hardcoded (ver FE-001)",
            "Nunca misturar lógica de banco de dados diretamente nos routers",
            "Sempre validar tenant_id no backend",
        ],
    ),
    ArchitecturePattern(
        id="arch-modular-monolith",
        name="Monólito Modular Backend (FastAPI)",
        description="Arquitetura de backend com isolamento estrito por módulos de domínio, ideal para sistemas de alta complexidade com evolução para microserviços.",
        folder_structure="""app/
├── core/
├── modules/
│   ├── auth/ (models, schemas, services, router)
│   ├── properties/ (models, schemas, services, router)
│   ├── contracts/ (models, schemas, services, router)
│   └── ai_assistant/ (gateway, prompts, tools, router)
└── main.py""",
        core_layers=[
            "Core (Cross-cutting concerns)",
            "Domain Modules (Bounded Contexts autônomos)",
            "Module Public Interfaces",
        ],
        data_flow="Module Router -> Module Service -> Module Repository",
        best_for=[
            "Sistemas com múltiplos domínios de negócio claros",
            "Equipes que desejam independência modular sem a sobrecarga de microserviços",
        ],
        constraints=[
            "Módulos não devem acessar tabelas de outros módulos diretamente via SQL; comunicação via services públicos",
        ],
    ),
]

# ---------------------------------------------------------------------------
# 4. CODE TEMPLATES
# ---------------------------------------------------------------------------
SEED_TEMPLATES: list[CodeTemplate] = [
    CodeTemplate(
        id="tpl-fastapi-router",
        name="FastAPI Standard Router",
        category="backend_api",
        layer=ComponentLayer.BACKEND,
        description="Template oficial de Router FastAPI com injeção de dependência de serviço, schemas padronizados e tratamento de erros.",
        target_path_template="app/api/v1/{resource_name}.py",
        content="""from fastapi import APIRouter, Depends, status, Query
from app.schemas.{resource_name} import {EntityName}Create, {EntityName}Update, {EntityName}Response
from app.schemas.common import PaginatedResponse
from app.services.{resource_name}_service import {EntityName}Service

router = APIRouter(prefix="/{resource_name}", tags=["{EntityName}"])

@router.get("", response_model=PaginatedResponse[{EntityName}Response])
async def list_{resource_name}(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    service: {EntityName}Service = Depends(),
):
    return await service.list_{resource_name}(page=page, page_size=page_size)

@router.get("/{id}", response_model={EntityName}Response)
async def get_{resource_name}(id: str, service: {EntityName}Service = Depends()):
    return await service.get_by_id(id)

@router.post("", response_model={EntityName}Response, status_code=status.HTTP_201_CREATED)
async def create_{resource_name}(body: {EntityName}Create, service: {EntityName}Service = Depends()):
    return await service.create(body)
""",
        parameters=["resource_name", "EntityName"],
    ),
    CodeTemplate(
        id="tpl-frontend-tanstack-query",
        name="Frontend TanStack Query Service Hook",
        category="frontend_data",
        layer=ComponentLayer.FRONTEND,
        description="Hook de consulta e mutação de dados usando TanStack Query integrado com API Client.",
        target_path_template="src/features/{feature_name}/hooks/use{FeatureName}.ts",
        content="""import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { {featureName}Service } from '../services/{featureName}Service';
import type { {FeatureName}CreateInput, {FeatureName} } from '../types';

export function use{FeatureName}List(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['{featureName}', page, pageSize],
    queryFn: () => {featureName}Service.list({ page, pageSize }),
  });
}

export function useCreate{FeatureName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {FeatureName}CreateInput) => {featureName}Service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{featureName}'] });
    },
  });
}
""",
        parameters=["featureName", "FeatureName"],
    ),
]
