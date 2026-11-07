import React, { useState } from 'react';
import {
  Tag,
  Button,
  Input,
  Select,
  Space,
  Table,
  Badge,
  Tabs,
  Avatar,
  Radio,
  message,
} from 'antd';
import {
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  CopyOutlined,
  CheckOutlined,
  CodeOutlined,
  EyeOutlined,
  ExperimentOutlined,
  UserOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  FilterOutlined,
  HomeOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { KPIWidget } from '@/components/loft/KPIWidget';
import { LoadingState, EmptyState, ErrorState } from '@/components/loft/FeedbackStates';
import { StatusTag } from '@/components/loft/StatusTag';
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';

export interface ComponentVisualPreviewProps {
  component: {
    id: string;
    name: string;
    category?: string;
    type?: string;
    description?: string;
    preview_code?: string;
    interface_spec?: string;
    props_contract?: any;
    version?: string;
    tags?: string[];
  };
  defaultTab?: 'preview' | 'code' | 'contract' | 'import';
}

export const ComponentVisualPreview: React.FC<ComponentVisualPreviewProps> = ({
  component,
  defaultTab = 'preview',
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [feedbackTab, setFeedbackTab] = useState<'loading' | 'empty' | 'error'>('loading');
  const [kpiValue, setKpiValue] = useState(482500);
  const [filterSearch, setFilterSearch] = useState('');
  const [simulatingCost, setSimulatingCost] = useState(false);
  const [simulatedCostResult, setSimulatedCostResult] = useState<any>(null);

  const isFrontend =
    component.type === 'frontend' ||
    component.id.startsWith('cmp_fe_') ||
    component.category === 'UI Components' ||
    component.category === 'Navigation' ||
    component.category === 'Feedback' ||
    component.category === 'Data Display' ||
    component.category === 'Forms' ||
    component.category === 'Layout';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    message.success('Código copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '640px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  // Render dedicated interactive mockups based on component name / slug / category
  const renderFrontendVisualCanvas = () => {
    const compName = (component.name || '').toLowerCase();
    const compId = (component.id || '').toLowerCase();

    // 1. KPI / Metric Widget
    if (compName.includes('kpi') || compName.includes('metric') || compName.includes('stat') || compId.includes('kpi')) {
      return (
        <div className="p-4 space-y-4">
          <div className="text-xs text-loft-muted mb-2 flex items-center justify-between">
            <span>Controle Interativo de Estado:</span>
            <Space size="small">
              <Button size="small" onClick={() => setKpiValue((v) => v + 50000)}>+ R$ 50k</Button>
              <Button size="small" onClick={() => setKpiValue(482500)}>Resetar</Button>
            </Space>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KPIWidget
              title="Volume de Vendas Fiança"
              value={`R$ ${(kpiValue / 1000).toFixed(1)}k`}
              prefix={<DollarOutlined />}
              badgeColor="#F56738"
              trend={{ value: 18.4, isPositive: true }}
              tooltip="Total acumulado no ciclo corrente"
            />
            <KPIWidget
              title="Taxa de Conversão"
              value="24.8%"
              prefix={<ThunderboltOutlined />}
              badgeColor="#20A483"
              trend={{ value: 3.2, isPositive: true }}
              tooltip="Propostas aprovadas vs iniciadas"
            />
          </div>
        </div>
      );
    }

    // 2. Feedback States (Loading, Empty, Error)
    if (
      compName.includes('loading') ||
      compName.includes('empty') ||
      compName.includes('error') ||
      compName.includes('feedback') ||
      compId.includes('feedback') ||
      compId.includes('loading') ||
      compId.includes('empty')
    ) {
      return (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-loft-border">
            <span className="text-xs font-semibold text-loft-muted">Alternar Estado Visual do Componente:</span>
            <Radio.Group
              size="small"
              value={feedbackTab}
              onChange={(e) => setFeedbackTab(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="loading">LoadingState</Radio.Button>
              <Radio.Button value="empty">EmptyState</Radio.Button>
              <Radio.Button value="error">ErrorState</Radio.Button>
            </Radio.Group>
          </div>

          <div className="bg-white rounded-xl border border-loft-border p-4 min-h-[220px] flex items-center justify-center">
            {feedbackTab === 'loading' && <LoadingState tip="Sincronizando dados com o Loft Engine..." />}
            {feedbackTab === 'empty' && (
              <EmptyState
                title="Nenhum imóvel disponível para locação"
                description="Tente ajustar os filtros de busca ou cadastre uma nova unidade."
                actionText="Cadastrar Imóvel"
                onAction={() => message.info('Ação do CTA acionada!')}
              />
            )}
            {feedbackTab === 'error' && (
              <ErrorState
                title="Falha de Comunicação com o Gateway"
                description="Não foi possível validar o token de sessão. Verifique sua conexão."
                onRetry={() => message.success('Tentando reconexão...')}
              />
            )}
          </div>
        </div>
      );
    }

    // 3. Status Tag / Status Badge
    if (compName.includes('status') || compName.includes('tag') || compName.includes('badge') || compId.includes('status')) {
      return (
        <div className="p-6 bg-white rounded-xl border border-loft-border space-y-4">
          <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide">
            Variações Canônicas de Status Copan
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <StatusTag status="Published" />
            <StatusTag status="Active" />
            <StatusTag status="Draft" />
            <StatusTag status="Archived" />
            <StatusTag status="Error" />
            <StatusTag status="Deprecated" />
            <Tag color="#F56738" className="font-semibold px-2.5 py-1">Loft Brand Tag</Tag>
            <Badge status="processing" text="Online / Sincronizado" className="text-xs font-medium" />
          </div>
        </div>
      );
    }

    // 4. Data Table / Table
    if (compName.includes('table') || compName.includes('grid') || compName.includes('list') || compId.includes('table')) {
      const sampleData = [
        { key: '1', name: 'Apartamento Jardins 140m²', client: 'Carlos Silva', status: 'Published', value: 'R$ 1.850.000' },
        { key: '2', name: 'Studio Pinheiros 45m²', client: 'Mariana Costa', status: 'Active', value: 'R$ 540.000' },
        { key: '3', name: 'Cobertura Vila Madalena', client: 'Roberto Lima', status: 'Draft', value: 'R$ 3.200.000' },
      ];
      return (
        <div className="p-4 bg-white rounded-xl border border-loft-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-loft-dark">DataTable Copan — Preview Interativo</span>
            <Tag color="orange">3 registros</Tag>
          </div>
          <Table
            size="small"
            pagination={false}
            dataSource={sampleData}
            columns={[
              { title: 'Imóvel / Ativo', dataIndex: 'name', key: 'name', render: (t) => <b className="text-xs text-loft-dark">{t}</b> },
              { title: 'Cliente', dataIndex: 'client', key: 'client', render: (t) => <span className="text-xs text-loft-muted">{t}</span> },
              { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <StatusTag status={s} /> },
              { title: 'Valor', dataIndex: 'value', key: 'value', render: (v) => <span className="text-xs font-mono font-semibold text-loft-dark">{v}</span> },
            ]}
          />
        </div>
      );
    }

    // 5. FilterBar / Search
    if (compName.includes('filter') || compName.includes('search') || compId.includes('filter') || compId.includes('search')) {
      return (
        <div className="p-4 bg-white rounded-xl border border-loft-border space-y-3">
          <div className="text-xs font-semibold text-loft-muted mb-1">Barra de Filtros & Busca com Debounce</div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
            <Input
              prefix={<SearchOutlined className="text-[#9FB3C8]" />}
              placeholder="Buscar por cliente, CPF, ID ou endereço..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full sm:w-64"
              allowClear
            />
            <Select
              defaultValue="all"
              className="w-36"
              options={[
                { value: 'all', label: 'Todos os Status' },
                { value: 'active', label: 'Ativos' },
                { value: 'pending', label: 'Pendentes' },
              ]}
            />
            <Button icon={<FilterOutlined />} className="text-xs font-semibold">
              Filtros Avançados
            </Button>
            <Button
              type="primary"
              className="bg-loft-orange border-none text-xs font-semibold"
              onClick={() => message.success(`Filtrando por: "${filterSearch || 'Todos'}"`)}
            >
              Aplicar
            </Button>
          </div>
        </div>
      );
    }

    // 6. Header / Page Structure / AppShell / Breadcrumb / UserMenu
    if (
      compName.includes('header') ||
      compName.includes('shell') ||
      compName.includes('nav') ||
      compName.includes('menu') ||
      compId.includes('header') ||
      compId.includes('shell')
    ) {
      return (
        <div className="p-4 bg-[#F8FAFC] rounded-xl border border-loft-border space-y-3">
          <div className="bg-white p-3 rounded-lg border border-loft-border shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF2ED] flex items-center justify-center text-loft-orange font-bold">
                <AppstoreOutlined />
              </div>
              <div>
                <div className="text-xs font-bold text-loft-dark">{component.name}</div>
                <div className="text-[10px] text-loft-muted">Loft Enterprise Copan Structure</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag color="orange">v{component.version || '1.0.0'}</Tag>
              <Avatar size="small" icon={<UserOutlined />} className="bg-loft-dark" />
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-dashed border-[#CBD2D9] text-center text-xs text-loft-muted">
            Área de Conteúdo Contida (PageContainer com padding responsivo e tokens do Copan)
          </div>
        </div>
      );
    }

    // 7. General Real Estate Card / Domain Specific Component
    return (
      <div className="p-4 bg-white rounded-xl border border-loft-border space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2ED] text-loft-orange flex items-center justify-center text-lg shadow-2xs">
              <HomeOutlined />
            </div>
            <div>
              <div className="text-sm font-bold text-loft-dark">{component.name}</div>
              <div className="text-xs text-loft-muted">{component.description || 'Componente React oficial do Design System Copan.'}</div>
            </div>
          </div>
          <StatusTag status="Published" />
        </div>

        <div className="p-3 bg-[#FAFBFD] rounded-lg border border-loft-border flex items-center justify-between">
          <div className="text-xs text-loft-muted">
            Estado Interativo do Componente:
          </div>
          <Space>
            <Button size="small" onClick={() => message.info('Ação secundária')}>Secundário</Button>
            <Button
              size="small"
              type="primary"
              className="bg-loft-orange border-none"
              onClick={() => message.success(`Interação com ${component.name} executada!`)}
            >
              Ação Primária
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  // Render dedicated interactive simulator for Backend Components
  const renderBackendVisualSimulator = () => {
    const isAICost =
      component.id.includes('cost') ||
      component.name.toLowerCase().includes('cost') ||
      component.id.includes('ai');

    const handleRunBackendSimulation = () => {
      setSimulatingCost(true);
      setTimeout(() => {
        if (isAICost) {
          setSimulatedCostResult({
            request_id: `req_${Math.random().toString(36).substring(2, 9)}`,
            provider: 'openai',
            model: 'gpt-4o',
            input_tokens: 1450,
            output_tokens: 380,
            total_tokens: 1830,
            unit_price_per_1k_input: 0.005,
            unit_price_per_1k_output: 0.015,
            estimated_cost_usd: 0.01295,
            estimated_cost_brl: 0.0712,
            currency: 'BRL',
            latency_ms: 182,
            status: 'RECORDED_IN_AUDIT_LOG',
          });
        } else {
          setSimulatedCostResult({
            service: component.name,
            operation: 'execute_pipeline',
            status: 'SUCCESS',
            execution_time_ms: 45,
            timestamp: new Date().toISOString(),
            payload_validated: true,
          });
        }
        setSimulatingCost(false);
        message.success('Simulação de pipeline executada com sucesso!');
      }, 600);
    };

    return (
      <div className="p-4 space-y-4">
        {/* Architecture Pipeline Flow Diagram */}
        <div className="p-4 bg-loft-dark rounded-xl border border-[#334E68] text-white space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#9FB3C8]">
            <span className="flex items-center gap-1.5">
              <ApiOutlined className="text-loft-orange" /> Fluxo Arquitetural da Requisição
            </span>
            <Tag color="cyan">FastAPI + SQLAlchemy</Tag>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-[#243B53] rounded-lg border border-[#486581]">
              <div className="text-[#9FB3C8] text-[10px] uppercase">1. Entrada</div>
              <div className="font-bold text-white mt-0.5">HTTP Request</div>
            </div>
            <div className="p-2.5 bg-[#243B53] rounded-lg border border-[#486581]">
              <div className="text-[#9FB3C8] text-[10px] uppercase">2. Camada de Serviço</div>
              <div className="font-bold text-loft-orange mt-0.5">{component.name}</div>
            </div>
            <div className="p-2.5 bg-[#243B53] rounded-lg border border-[#486581]">
              <div className="text-[#9FB3C8] text-[10px] uppercase">3. Motor / Regra</div>
              <div className="font-bold text-white mt-0.5">Audit & Metric DB</div>
            </div>
            <div className="p-2.5 bg-loft-success/20 rounded-lg border border-loft-success/40">
              <div className="text-loft-success text-[10px] uppercase">4. Resposta</div>
              <div className="font-bold text-loft-success mt-0.5">Envelope JSON</div>
            </div>
          </div>
        </div>

        {/* Interactive Backend Request Simulator */}
        <div className="p-4 bg-white rounded-xl border border-loft-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-loft-dark">Simulador Interativo de Execução Backend</div>
              <div className="text-[11px] text-loft-muted">Execute uma chamada simulada ao componente {component.name} e inspecione o output.</div>
            </div>
            <Button
              type="primary"
              icon={<ExperimentOutlined />}
              loading={simulatingCost}
              className="bg-loft-orange border-none text-xs font-semibold"
              onClick={handleRunBackendSimulation}
            >
              Executar Simulação
            </Button>
          </div>

          {simulatedCostResult && (
            <div className="mt-3">
              <div className="text-xs font-bold text-loft-success mb-1 flex items-center gap-1">
                <CheckOutlined /> Resposta do Serviço ({simulatedCostResult.status}):
              </div>
              <pre className="p-3 bg-loft-dark text-loft-success rounded-lg text-xs font-mono overflow-x-auto leading-relaxed max-h-56">
                {JSON.stringify(simulatedCostResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  const tsxCodeExample = component.preview_code || (
    isFrontend
      ? `import React from 'react';\nimport { ${component.name.replace(/[^a-zA-Z0-9]/g, '')} } from '@/components/loft';\n\nexport const MyFeatureView: React.FC = () => {\n  return (\n    <div className="p-6 bg-white rounded-xl shadow-2xs">\n      <${component.name.replace(/[^a-zA-Z0-9]/g, '')}\n        title="Exemplo de Uso Enterprise"\n        status="Published"\n      />\n    </div>\n  );\n};`
      : `from fastapi import Depends, APIRouter\nfrom app.core.${(component.name || 'service').toLowerCase()} import ${component.name.replace(/[^a-zA-Z0-9]/g, '')}\n\nrouter = APIRouter(prefix="/api/v1")\n\n@router.post("/process")\nasync def handle_process(service: ${component.name.replace(/[^a-zA-Z0-9]/g, '')} = Depends()):\n    result = await service.execute()\n    return {"data": result}`
  );

  const contractSpec = component.interface_spec || (
    isFrontend
      ? `export interface ${component.name.replace(/[^a-zA-Z0-9]/g, '')}Props {\n  title?: string;\n  status?: 'Published' | 'Draft' | 'Archived';\n  className?: string;\n  onAction?: () => void;\n}`
      : `class ${component.name.replace(/[^a-zA-Z0-9]/g, '')}:\n    def __init__(self, db_session = None):\n        self.db = db_session\n\n    async def execute(self, **kwargs) -> dict:\n        """Executa a lógica canônica do componente backend."""\n        pass`
  );

  return (
    <div className="space-y-4">
      <Tabs
        defaultActiveKey={defaultTab}
        tabBarExtraContent={
          <Button
            size="small"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={() => handleCopy(tsxCodeExample)}
            className="text-xs"
          >
            {copied ? 'Copiado!' : 'Copiar Código'}
          </Button>
        }
        items={[
          {
            key: 'preview',
            label: (
              <span className="flex items-center gap-1.5 font-semibold">
                <EyeOutlined className="text-loft-orange" />
                {isFrontend ? 'Preview Visual ("A Cara")' : 'Simulador & Diagrama'}
              </span>
            ),
            children: (
              <div className="space-y-3">
                {/* Viewport bar for Frontend */}
                {isFrontend && (
                  <div className="flex items-center justify-between px-3 py-2 bg-[#F0F4F8] rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-loft-muted font-medium">
                      <span>Visualizador Responsivo:</span>
                      <Radio.Group
                        size="small"
                        value={viewport}
                        onChange={(e) => setViewport(e.target.value)}
                        buttonStyle="solid"
                      >
                        <Radio.Button value="desktop"><DesktopOutlined /> Desktop</Radio.Button>
                        <Radio.Button value="tablet"><TabletOutlined /> Tablet</Radio.Button>
                        <Radio.Button value="mobile"><MobileOutlined /> Mobile</Radio.Button>
                      </Radio.Group>
                    </div>
                    <Tag color="orange" className="font-mono text-[10px]">
                      {viewport === 'desktop' ? '100% (Desktop Fluid)' : viewport === 'tablet' ? '640px (Tablet)' : '375px (Mobile)'}
                    </Tag>
                  </div>
                )}

                {/* Rendered Live Canvas Container */}
                <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#CBD2D9] flex justify-center items-center overflow-x-auto min-h-[260px]">
                  <div
                    style={{
                      width: getViewportWidth(),
                      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="w-full"
                  >
                    {isFrontend ? renderFrontendVisualCanvas() : renderBackendVisualSimulator()}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'code',
            label: (
              <span className="flex items-center gap-1.5 font-semibold">
                <CodeOutlined className="text-[#0066CC]" />
                Exemplo de Uso ({isFrontend ? 'TSX' : 'Python'})
              </span>
            ),
            children: (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-loft-muted">
                  Implementação Canônica Pronta para Produção:
                </div>
                <MarkdownViewer
                  content={`\`\`\`${isFrontend ? 'tsx' : 'python'}\n${tsxCodeExample}\n\`\`\``}
                />
              </div>
            ),
          },
          {
            key: 'contract',
            label: (
              <span className="flex items-center gap-1.5 font-semibold">
                <SafetyCertificateOutlined className="text-loft-success" />
                Contrato & Props
              </span>
            ),
            children: (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-loft-muted">
                  Especificação Formal da Interface ({isFrontend ? 'TypeScript' : 'Pydantic / Python'}):
                </div>
                <MarkdownViewer
                  content={`\`\`\`${isFrontend ? 'typescript' : 'python'}\n${contractSpec}\n\`\`\``}
                />
              </div>
            ),
          },
          {
            key: 'import',
            label: (
              <span className="flex items-center gap-1.5 font-semibold">
                <DatabaseOutlined className="text-[#805AD5]" />
                Import & Instalação
              </span>
            ),
            children: (
              <div className="space-y-3 p-2">
                <div>
                  <div className="text-xs font-semibold text-loft-muted mb-1">Importação Padrão no Loft Workspace:</div>
                  <MarkdownViewer
                    content={`\`\`\`typescript\nimport { ${component.name.replace(/[^a-zA-Z0-9]/g, '')} } from '@/components/loft';\n\`\`\``}
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-loft-muted mb-1">Instalação via NPM / Pip:</div>
                  <MarkdownViewer
                    content={`\`\`\`bash\n# Frontend\nnpm install @loft/copan-components\n\n# Backend\npip install loft-builder-core\n\`\`\``}
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
