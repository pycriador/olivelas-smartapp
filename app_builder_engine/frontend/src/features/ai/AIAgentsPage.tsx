import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Spin,
  message,
  Typography,
  Radio,
  Slider,
  Popconfirm,
  Tooltip,
  Pagination,
} from 'antd';
import {
  RobotOutlined,
  CodeOutlined,
  SafetyCertificateOutlined,
  ExperimentOutlined,
  CrownOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  ThunderboltOutlined,
  ApartmentOutlined,
  DatabaseOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@/components/loft/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { aiAgentsService } from '@/services/aiAgents.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type {
  AiAgentItem,
  AiAgentExecuteResponse,
} from '@/types/ai.types';

const { Text, Paragraph } = Typography;

const DOMAINS = ['Todos', 'Frontend / UI', 'Data & Backend', 'Architecture', 'Security / RBAC', 'Testing & Contracts'];

const SDD_EXAMPLES: Record<string, { label: string; contextType: 'code' | 'blueprint' | 'spec' | 'freeform'; input: string }> = {
  frontend_copan: {
    label: '🎨 Frontend SDD: Refatorar Componente para Copan Design System & FSD',
    contextType: 'code',
    input: `// Componente legado sem tipagem e com CSS inline
export const PropertyCard = ({ property, onSelect }: any) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8, backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <img src={property.photo} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
      <h2 style={{ fontSize: 18, color: '#222', marginTop: 10 }}>{property.title}</h2>
      <p style={{ color: '#777', fontSize: 14 }}>{property.address} - R$ {property.price}</p>
      <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
        <button style={{ backgroundColor: '#ff774a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 4, cursor: 'pointer' }} onClick={() => onSelect(property.id)}>
          Agendar Visita
        </button>
      </div>
    </div>
  );
};`,
  },
  database_migration: {
    label: '🗄️ Backend SDD: Migração Alembic Zero-Downtime (Expand & Contract)',
    contextType: 'spec',
    input: `Requisito de Migração de Banco de Dados:
Tabela: property_reservations
Colunas:
- id: UUID (Primary Key, default uuid_generate_v4())
- property_id: UUID (Foreign Key para properties.id, ON DELETE RESTRICT)
- user_id: UUID (Foreign Key para users.id, ON DELETE CASCADE)
- tenant_id: VARCHAR(64) (NOT NULL, Index para isolamento multi-tenant)
- start_date: DATE (NOT NULL)
- end_date: DATE (NOT NULL, constraint end_date > start_date)
- total_amount_cents: BIGINT (NOT NULL, default 0)
- status: VARCHAR(32) (NOT NULL, default 'PENDING', index)
- created_at: TIMESTAMPTZ (NOT NULL, default now())
- updated_at: TIMESTAMPTZ (NOT NULL, default now())

Estratégia requerida:
1. Script de migração Alembic com upgrade() e downgrade() idempotentes e reversíveis.
2. Modelos ORM SQLAlchemy 2.0 com Mapped types.
3. Índice B-Tree composto em (tenant_id, status) e índice parcial em status='ACTIVE'.
4. Plano de rollout zero-downtime para aplicação em produção.`,
  },
  fastapi_clean_arch: {
    label: '⚡ Backend SDD: FastAPI Endpoint com Clean Architecture & Idempotência',
    contextType: 'spec',
    input: `Especificação de Endpoint Backend FastAPI:
Rota: POST /api/v1/payments/checkout
Requisitos de Engenharia:
1. Camada Router: Dependency Injection para DB Session e Current User (@require_permission('payments:create')).
2. Idempotência: Validação do cabeçalho 'Idempotency-Key' obrigatório via middleware/dependência.
3. Camada Service / Use Case: Processa pagamento com cálculo de taxa de corretagem e emite evento 'PaymentProcessedEvent'.
4. Camada Repository: SQLAlchemy 2.0 assíncrono com transação atômica.
5. Schemas Pydantic v2: CheckoutRequestSchema (validação estrita de amount > 0, currency='BRL', tenant_id) e CheckoutResponseSchema.
6. Tratamento de Erros: Retornar 409 Conflict se Idempotency-Key já processada com payload diferente.`,
  },
  security_bola: {
    label: '🛡️ Security SDD: Auditoria de Vulnerabilidades BOLA / BFLA & RBAC',
    contextType: 'spec',
    input: `Especificação de API para Auditoria de Segurança:
Endpoints:
1. GET /api/v1/tenants/{tenant_id}/contracts/{contract_id}/financials
   - Header: Authorization: Bearer <jwt_token>
   - Implementação atual:
     query = session.query(Contract).filter(Contract.id == contract_id).first()
     return query.financial_data
   - Riscos potenciais: Não há verificação se contract.tenant_id corresponde ao tenant_id do token autenticado!

2. DELETE /api/v1/admin/users/{user_id}/impersonate
   - Header: Authorization: Bearer <jwt_token>
   - Sem validação de permissão granular 'iam:impersonate'.

Por favor audite e forneça o plano de remediação estrito conforme a política de segurança da Loft.`,
  },
  test_contracts: {
    label: '🧪 Testing SDD: Geração de PyTest Suites & Contrato OpenAPI 3.1',
    contextType: 'blueprint',
    input: `Módulo para Geração de Testes & Contratos:
Serviço: RentalAgreementService
Métodos:
- calculate_monthly_rent(base_price: float, iptu: float, condo_fee: float, discount_percent: float = 0.0) -> float
- validate_guarantor(guarantor_id: str, monthly_income: float, required_income: float) -> bool
- cancel_agreement(agreement_id: str, actor_id: str, reason: str) -> AgreementStatusResponse

Requisitos:
1. Suite PyTest completa com fixtures de banco de dados SQLite/PostgreSQL e TestClient.
2. Cobertura de cenários felizes, descontos inválidos (> 100% ou < 0%), renda insuficiente e cancelamento não autorizado.
3. Definição do contrato OpenAPI 3.1 completo com schemas Pydantic e exemplos JSON.`,
  },
  golden_rules: {
    label: '👑 Architecture SDD: Validação contra Golden Rules da Loft',
    contextType: 'blueprint',
    input: `Proposta de Arquitetura de Microsserviço:
Nome: Loft Finance & Split Service
Comunicação:
- Consome eventos 'RentalLeaseSigned' via Apache Kafka com SemVer v2.
- Acesso direto ao banco de dados PostgreSQL do serviço 'Loft Auth' para consultar dados do locatário (Cross-Database Join).
- Endpoints REST com mutação sem cabeçalho Idempotency-Key.
- Tracing OpenTelemetry parcial configurado apenas na camada HTTP.

Avalie contra as Golden Rules RUL-01 (Isolamento de DB), RUL-02 (Idempotência), RUL-03 (Tracing Distribuído) e RUL-04 (SemVer).`,
  },
};

const ICON_OPTIONS = [
  { label: 'Robô (Geral)', value: 'RobotOutlined' },
  { label: 'Código (Frontend)', value: 'CodeOutlined' },
  { label: 'Segurança & RBAC', value: 'SafetyCertificateOutlined' },
  { label: 'Testes & QA', value: 'ExperimentOutlined' },
  { label: 'Arquitetura & Regras', value: 'CrownOutlined' },
  { label: 'Banco de Dados', value: 'DatabaseOutlined' },
  { label: 'API & Gateway', value: 'ApiOutlined' },
  { label: 'Diagrama & Componentes', value: 'ApartmentOutlined' },
];

const COLOR_OPTIONS = [
  { label: 'Laranja Loft', value: '#FF774A' },
  { label: 'Verde Floresta', value: '#0B6B4F' },
  { label: 'Azul Corporativo', value: '#1677FF' },
  { label: 'Roxo Deep', value: '#722ED1' },
  { label: 'Ciano Tech', value: '#13C2C2' },
  { label: 'Dourado Architecture', value: '#FA8C16' },
];

export const AIAgentsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [agents, setAgents] = useState<AiAgentItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedDomain, setSelectedDomain] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { currentPage, pageSize, onPaginationChange, resetToFirstPage } = useUrlPagination(6);

  // Execution Modal state
  const [executingAgent, setExecutingAgent] = useState<AiAgentItem | null>(null);
  const [contextType, setContextType] = useState<'blueprint' | 'code' | 'spec' | 'freeform'>('code');
  const [inputText, setInputText] = useState<string>('');
  const [tempOverride, setTempOverride] = useState<number>(0.2);
  const [running, setRunning] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<AiAgentExecuteResponse | null>(null);

  // Create / Edit Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<AiAgentItem | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState<boolean>(false);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await aiAgentsService.listAgentsPaginated({
        domain: selectedDomain !== 'Todos' ? selectedDomain : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        page_size: pageSize,
      });
      setAgents(res.items);
      setTotalItems(res.total);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar catálogo de agentes de IA.');
    } finally {
      setLoading(false);
    }
  }, [selectedDomain, searchQuery, currentPage, pageSize]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const handleOpenExecuteModal = (agent: AiAgentItem) => {
    setExecutingAgent(agent);
    setExecResult(null);
    setTempOverride(agent.temperature);

    const slug = agent.slug || agent.id;
    if (slug.includes('database') || agent.domain === 'Data & Backend') {
      setContextType(SDD_EXAMPLES.database_migration.contextType);
      setInputText(SDD_EXAMPLES.database_migration.input);
    } else if (slug.includes('copan') || agent.domain === 'Frontend / UI') {
      setContextType(SDD_EXAMPLES.frontend_copan.contextType);
      setInputText(SDD_EXAMPLES.frontend_copan.input);
    } else if (slug.includes('fastapi')) {
      setContextType(SDD_EXAMPLES.fastapi_clean_arch.contextType);
      setInputText(SDD_EXAMPLES.fastapi_clean_arch.input);
    } else if (slug.includes('security') || slug.includes('bola') || agent.domain === 'Security / RBAC') {
      setContextType(SDD_EXAMPLES.security_bola.contextType);
      setInputText(SDD_EXAMPLES.security_bola.input);
    } else if (slug.includes('test') || slug.includes('contract') || agent.domain === 'Testing & Contracts') {
      setContextType(SDD_EXAMPLES.test_contracts.contextType);
      setInputText(SDD_EXAMPLES.test_contracts.input);
    } else {
      setContextType(SDD_EXAMPLES.golden_rules.contextType);
      setInputText(SDD_EXAMPLES.golden_rules.input);
    }
  };

  const handleRunAgent = async () => {
    if (!executingAgent || !inputText.trim()) {
      message.warning('Insira o contexto ou código de entrada.');
      return;
    }
    setRunning(true);
    setExecResult(null);
    try {
      const res = await aiAgentsService.executeAgent(executingAgent.id, {
        agent_id: executingAgent.id,
        input_text: inputText,
        context_type: contextType,
        temperature_override: tempOverride,
      });
      setExecResult(res);
      message.success(`Agente executado com sucesso em ${res.latency_ms}ms!`);
      // Update local usage count
      setAgents((prev) =>
        prev.map((a) => (a.id === executingAgent.id ? { ...a, usage_count: a.usage_count + 1 } : a))
      );
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Erro durante a execução do agente';
      message.error(msg);
    } finally {
      setRunning(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingAgent(null);
    form.resetFields();
    form.setFieldsValue({
      domain: 'Architecture',
      model: 'gemini-2.5-flash',
      temperature: 0.2,
      avatar_icon: 'RobotOutlined',
      color: '#FF774A',
      capabilities: ['Validação técnica', 'Inspeção de código'],
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (agent: AiAgentItem) => {
    setEditingAgent(agent);
    form.resetFields();
    form.setFieldsValue({
      name: agent.name,
      role: agent.role,
      domain: agent.domain,
      description: agent.description,
      model: agent.model,
      temperature: agent.temperature,
      system_instruction: agent.system_instruction,
      capabilities: agent.capabilities,
      avatar_icon: agent.avatar_icon,
      color: agent.color,
    });
    setModalOpen(true);
  };

  const handleCloneAgent = (agent: AiAgentItem) => {
    setEditingAgent(null);
    form.resetFields();
    form.setFieldsValue({
      name: `${agent.name} (Cópia)`,
      role: agent.role,
      domain: agent.domain,
      description: agent.description,
      model: agent.model,
      temperature: agent.temperature,
      system_instruction: agent.system_instruction,
      capabilities: [...agent.capabilities],
      avatar_icon: agent.avatar_icon,
      color: agent.color,
    });
    setModalOpen(true);
    message.info(`Duplicando configurações de '${agent.name}'. Personalize e salve.`);
  };

  const handleSaveAgent = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editingAgent) {
        const updated = await aiAgentsService.updateAgent(editingAgent.id, values);
        setAgents((prev) => prev.map((a) => (a.id === editingAgent.id ? updated : a)));
        message.success(`Agente '${updated.name}' atualizado com sucesso!`);
      } else {
        const created = await aiAgentsService.createAgent(values);
        setAgents((prev) => [...prev, created]);
        message.success(`Agente '${created.name}' criado com sucesso!`);
      }
      setModalOpen(false);
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar agente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await aiAgentsService.deleteAgent(agentId);
      setAgents((prev) => prev.filter((a) => a.id !== agentId));
      message.success('Agente excluído com sucesso do catálogo.');
    } catch (err: any) {
      message.error(err.response?.data?.detail || err.message || 'Falha ao excluir agente.');
    }
  };

  const filteredAgents = agents;

  const getAgentIcon = (iconName: string, color: string) => {
    const style = { fontSize: '20px', color };
    switch (iconName) {
      case 'CodeOutlined':
        return <CodeOutlined style={style} />;
      case 'SafetyCertificateOutlined':
        return <SafetyCertificateOutlined style={style} />;
      case 'ExperimentOutlined':
        return <ExperimentOutlined style={style} />;
      case 'CrownOutlined':
        return <CrownOutlined style={style} />;
      case 'DatabaseOutlined':
        return <DatabaseOutlined style={style} />;
      case 'ApiOutlined':
        return <ApiOutlined style={style} />;
      case 'ApartmentOutlined':
        return <ApartmentOutlined style={style} />;
      default:
        return <RobotOutlined style={style} />;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Spin size="large" />
          <Text className="text-loft-muted text-sm">Carregando catálogo de agentes de engenharia...</Text>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Agentes Cognitivos de Engenharia"
        subtitle="Catálogo completo para CRUD (Criar, Editar, Excluir e Executar) de agentes especializados com prompts de sistema otimizados para refatoração Copan, auditoria BOLA, testes e arquitetura."
        breadcrumbs={[
          { title: 'AI & Integrações' },
          { title: 'AI Agents' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadAgents}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreateModal}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
            >
              Novo Agente Especialista
            </Button>
          </Space>
        }
      />

      {/* Filters and Search Bar */}
      <Card size="small" className="border-loft-border shadow-2xs mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Domain Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-loft-muted mr-1">Domínio:</span>
            {DOMAINS.map((dom) => (
              <Button
                key={dom}
                size="small"
                type={selectedDomain === dom ? 'primary' : 'default'}
                onClick={() => {
                  setSelectedDomain(dom);
                  resetToFirstPage();
                }}
                style={
                  selectedDomain === dom
                    ? { background: '#121619', borderColor: '#121619', borderRadius: '16px' }
                    : { borderRadius: '16px' }
                }
              >
                {dom}
              </Button>
            ))}
          </div>

          {/* Search Input */}
          <Input.Search
            placeholder="Buscar por nome, papel ou especialidade..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              resetToFirstPage();
            }}
            style={{ maxWidth: 320 }}
            allowClear
          />
        </div>
      </Card>

      {/* Agents Grid */}
      <Row gutter={[20, 20]}>
        {filteredAgents.map((agent) => (
          <Col xs={24} md={12} lg={12} key={agent.id}>
            <Card
              className="border-loft-border shadow-2xs hover:border-[#FF774A] transition-all rounded-xl h-full flex flex-col justify-between"
              title={
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${agent.color}15` }}
                    >
                      {getAgentIcon(agent.avatar_icon, agent.color)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-loft-dark">{agent.name}</span>
                        {agent.is_system && (
                          <Tag color="orange" className="text-[10px] font-bold">NATIVO</Tag>
                        )}
                      </div>
                      <div className="text-xs text-loft-muted">{agent.role}</div>
                    </div>
                  </div>

                  <Tag color="blue" className="font-mono text-xs m-0">
                    {agent.model}
                  </Tag>
                </div>
              }
            >
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <Paragraph className="text-xs text-loft-muted line-clamp-2 mb-3">
                    {agent.description}
                  </Paragraph>

                  {/* Capabilities Tags */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-loft-dark">Capacidades Principais:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.capabilities.map((cap, idx) => (
                        <Tag key={idx} className="text-[10px] bg-[#FAFBFD] text-loft-muted border-loft-border">
                          ✓ {cap}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-loft-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-loft-muted">
                      Execuções: <b className="text-loft-dark">{agent.usage_count}</b>
                    </span>
                    <span className="text-[11px] text-loft-success font-medium flex items-center gap-1">
                      <CheckCircleOutlined /> Pronto para Execução
                    </span>
                  </div>

                  {/* CRUD Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleOpenExecuteModal(agent)}
                      className="flex-1"
                      style={{ background: '#FF774A', borderColor: '#FF774A' }}
                    >
                      Executar
                    </Button>

                    <Tooltip title="Editar parâmetros e system prompt do agente">
                      <Button icon={<EditOutlined />} onClick={() => handleOpenEditModal(agent)}>
                        Editar
                      </Button>
                    </Tooltip>

                    <Tooltip title="Duplicar configurações como novo agente">
                      <Button icon={<CopyOutlined />} onClick={() => handleCloneAgent(agent)} />
                    </Tooltip>

                    <Popconfirm
                      title={`Excluir Agente '${agent.name}'?`}
                      description="Esta ação removerá este agente cognitivo do catálogo de IA."
                      okText="Sim, excluir"
                      cancelText="Cancelar"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDeleteAgent(agent.id)}
                    >
                      <Tooltip title="Excluir agente do catálogo">
                        <Button danger icon={<DeleteOutlined />} />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {totalItems > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-loft-border shadow-2xs">
          <span className="text-xs text-loft-muted">
            Exibindo {filteredAgents.length} de {totalItems} agentes cognitivos (Página {currentPage})
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={onPaginationChange}
            showSizeChanger
            pageSizeOptions={['4', '6', '10', '20']}
          />
        </div>
      )}

      {/* Execution Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ThunderboltOutlined className="text-[#FF774A]" />
            <span>Execução de Agente: {executingAgent?.name}</span>
          </div>
        }
        open={!!executingAgent}
        onCancel={() => setExecutingAgent(null)}
        width={800}
        footer={null}
      >
        {executingAgent && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 bg-[#FAFBFD] rounded-lg border border-loft-border">
              <div>
                <div className="text-xs font-bold text-loft-dark">{executingAgent.role}</div>
                <div className="text-[11px] text-loft-muted">{executingAgent.description}</div>
              </div>
              <Tag color="orange" className="font-mono text-xs">
                {executingAgent.model}
              </Tag>
            </div>

            {/* Quick SDD Presets Picker */}
            <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#D9E2EC]">
              <div className="text-[11px] font-bold text-loft-dark mb-1.5 flex items-center justify-between">
                <span>⚡ Exemplos Canônicos SDD Loft (Frontend / Backend):</span>
                <span className="text-[10px] text-loft-muted font-normal">Clique para carregar no editor</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="small"
                  className="text-[11px]"
                  onClick={() => {
                    setContextType(SDD_EXAMPLES.frontend_copan.contextType);
                    setInputText(SDD_EXAMPLES.frontend_copan.input);
                  }}
                >
                  🎨 Frontend Copan & FSD
                </Button>
                <Button
                  size="small"
                  className="text-[11px]"
                  onClick={() => {
                    setContextType(SDD_EXAMPLES.database_migration.contextType);
                    setInputText(SDD_EXAMPLES.database_migration.input);
                  }}
                >
                  🗄️ Backend DB Migration (Alembic)
                </Button>
                <Button
                  size="small"
                  className="text-[11px]"
                  onClick={() => {
                    setContextType(SDD_EXAMPLES.fastapi_clean_arch.contextType);
                    setInputText(SDD_EXAMPLES.fastapi_clean_arch.input);
                  }}
                >
                  ⚡ FastAPI Clean Arch & Idempotência
                </Button>
                <Button
                  size="small"
                  className="text-[11px]"
                  onClick={() => {
                    setContextType(SDD_EXAMPLES.security_bola.contextType);
                    setInputText(SDD_EXAMPLES.security_bola.input);
                  }}
                >
                  🛡️ BOLA / RBAC Audit
                </Button>
                <Button
                  size="small"
                  className="text-[11px]"
                  onClick={() => {
                    setContextType(SDD_EXAMPLES.test_contracts.contextType);
                    setInputText(SDD_EXAMPLES.test_contracts.input);
                  }}
                >
                  🧪 PyTest & Contrato OpenAPI
                </Button>
                <Button
                  size="small"
                  className="text-[11px]"
                  onClick={() => {
                    setContextType(SDD_EXAMPLES.golden_rules.contextType);
                    setInputText(SDD_EXAMPLES.golden_rules.input);
                  }}
                >
                  👑 Golden Rules Loft
                </Button>
              </div>
            </div>

            {/* Context Type Selector */}
            <div>
              <label className="text-xs font-bold text-loft-dark block mb-1.5">
                Tipo de Contexto
              </label>
              <Radio.Group
                value={contextType}
                onChange={(e) => setContextType(e.target.value)}
                size="small"
              >
                <Radio.Button value="code">Código React / TSX</Radio.Button>
                <Radio.Button value="blueprint">Blueprint / Arquitetura</Radio.Button>
                <Radio.Button value="spec">Especificação REST / DB</Radio.Button>
                <Radio.Button value="freeform">Prompt Livre</Radio.Button>
              </Radio.Group>
            </div>

            {/* Input Text Area */}
            <div>
              <label className="text-xs font-bold text-loft-dark block mb-1">
                Entrada / Código para Análise
              </label>
              <Input.TextArea
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="font-mono text-xs"
                placeholder="Insira o código ou especificação aqui..."
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-loft-dark mb-1">
                <span className="font-medium">Temperatura</span>
                <span className="font-mono font-bold text-[#0066CC]">{tempOverride}</span>
              </div>
              <Slider
                min={0.0}
                max={1.0}
                step={0.05}
                value={tempOverride}
                onChange={setTempOverride}
              />
            </div>

            {/* Run Button */}
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              loading={running}
              onClick={handleRunAgent}
              className="w-full"
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              size="large"
            >
              Processar Tarefa com {executingAgent.name}
            </Button>

            {/* Execution Result Box */}
            {execResult && (
              <div className="mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-loft-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag color="green" icon={<CheckCircleOutlined />}>Concluído com Sucesso</Tag>
                    <span className="text-xs font-mono font-bold text-[#0066CC]">
                      {execResult.latency_ms} ms
                    </span>
                  </div>

                  <Space>
                    <span className="text-xs text-loft-muted font-mono">
                      {execResult.tokens_used} tokens
                    </span>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(execResult.output_text);
                        message.success('Resultado copiado para a área de transferência!');
                      }}
                    >
                      Copiar Saída
                    </Button>
                  </Space>
                </div>

                <div className="text-xs text-loft-muted italic bg-white p-2.5 rounded-sm border border-loft-border">
                  💡 {execResult.reasoning_summary}
                </div>

                <div className="p-3 bg-white rounded-lg border border-loft-border text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {execResult.output_text}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create / Edit Custom Agent Modal */}
      <Modal
        title={editingAgent ? `Editar Agente: ${editingAgent.name}` : 'Criar Novo Agente Especialista'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSaveAgent}
        confirmLoading={saving}
        okText="Salvar Agente"
        cancelText="Cancelar"
        width={680}
      >
        <Form form={form} layout="vertical" className="pt-2">
          <Form.Item
            name="name"
            label="Nome do Agente"
            rules={[{ required: true, message: 'Insira o nome do agente' }]}
          >
            <Input placeholder="Ex: Database Migration Specialist" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Papel / Cargo Técnico"
                rules={[{ required: true, message: 'Insira o papel técnico' }]}
              >
                <Input placeholder="Ex: Lead DBA & Migration Engineer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="domain" label="Domínio" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Frontend / UI">Frontend / UI</Select.Option>
                  <Select.Option value="Data & Backend">Data & Backend</Select.Option>
                  <Select.Option value="Architecture">Architecture</Select.Option>
                  <Select.Option value="Security / RBAC">Security / RBAC</Select.Option>
                  <Select.Option value="Testing & Contracts">Testing & Contracts</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Descrição do Agente"
            rules={[{ required: true, message: 'Insira a descrição' }]}
          >
            <Input.TextArea rows={2} placeholder="Explique o propósito deste agente..." />
          </Form.Item>

          <Form.Item
            name="system_instruction"
            label="Instrução de Sistema (System Prompt)"
            rules={[{ required: true, message: 'Insira o system prompt do agente' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Você é o especialista em migração de banco de dados da Loft..."
            />
          </Form.Item>

          <Form.Item
            name="capabilities"
            label="Capacidades Técnicas (Pressione Enter para adicionar tags)"
          >
            <Select
              mode="tags"
              placeholder="Ex: Refatoração, OWASP, Testes"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="model" label="Modelo de IA">
                <Select>
                  <Select.Option value="gemini-3.0-flash">Google Gemini 3.0 Flash (Next-Gen Recomendado)</Select.Option>
                  <Select.Option value="gemini-3.0-pro">Google Gemini 3.0 Pro (Next-Gen Flagship)</Select.Option>
                  <Select.Option value="gemini-3.0-flash-preview">Google Gemini 3.0 Flash Preview</Select.Option>
                  <Select.Option value="gemini-3.0-pro-preview">Google Gemini 3.0 Pro Preview</Select.Option>
                  <Select.Option value="gemini-3-flash">Google Gemini 3 Flash</Select.Option>
                  <Select.Option value="gemini-3-pro">Google Gemini 3 Pro</Select.Option>
                  <Select.Option value="gemini-2.5-flash">Google Gemini 2.5 Flash</Select.Option>
                  <Select.Option value="gemini-2.5-pro">Google Gemini 2.5 Pro</Select.Option>
                  <Select.Option value="gemini-2.5-flash-lite">Google Gemini 2.5 Flash-Lite</Select.Option>
                  <Select.Option value="gemini-2.0-flash">Google Gemini 2.0 Flash</Select.Option>
                  <Select.Option value="gemini-2.0-flash-lite">Google Gemini 2.0 Flash-Lite</Select.Option>
                  <Select.Option value="gemini-1.5-pro">Google Gemini 1.5 Pro</Select.Option>
                  <Select.Option value="gemini-1.5-flash">Google Gemini 1.5 Flash</Select.Option>
                  <Select.Option value="gpt-4o">OpenAI GPT-4o</Select.Option>
                  <Select.Option value="claude-3-7-sonnet">Anthropic Claude 3.7 Sonnet</Select.Option>
                  <Select.Option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</Select.Option>
                  <Select.Option value="grok-2">xAI Grok-2</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="temperature" label="Temperatura">
                <Input type="number" step="0.05" min="0" max="1" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="avatar_icon" label="Ícone de Identidade">
                <Select options={ICON_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="color" label="Cor do Tema">
                <Select options={COLOR_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};
