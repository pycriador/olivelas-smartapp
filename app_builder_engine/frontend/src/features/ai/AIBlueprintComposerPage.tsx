import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Tag,
  Alert,
  Tabs,
  Select,
  Slider,
  Switch,
  Space,
  Row,
  Col,
  Table,
  message,
} from 'antd';
import {
  ThunderboltOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  RobotOutlined,
  SettingOutlined,
  CodeOutlined,
  ApartmentOutlined,
  ReloadOutlined,
  BranchesOutlined,
  ApiOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { aiService } from '@/services/ai.service';
import { aiSettingsService } from '@/services/aiSettings.service';
import type { MultiProviderSettings, AiModelOption } from '@/types/ai.types';
import type { AIComposeBlueprintResponse } from '@/types/api.types';

// ==========================================
// CANONICAL SDD APPLICATION PRESETS (OLIVELAS)
// ==========================================
interface SddComposerPreset {
  id: string;
  title: string;
  icon: string;
  tag: string;
  appName: string;
  description: string;
  requirements: string[];
  systemInstruction: string;
  temperature: number;
}

const COMPOSER_PRESETS: SddComposerPreset[] = [
  {
    id: 'marketplace_split',
    title: 'Marketplace & Split Financeiro',
    icon: '🏢',
    tag: 'Fullstack / Finanças',
    appName: 'Olivelas Marketplace & Finance Split Hub',
    description:
      'Plataforma de intermediação imobiliária com split automático de comissões para corretores, emissão de boletos e conciliação bancária.',
    requirements: [
      'Autenticação JWT com RBAC granular (Locador, Inquilino, Corretor e Financeiro)',
      'Módulo de Pagamentos e Split Financeiro com suporte a cabeçalho Idempotency-Key',
      'Tabelas SQLAlchemy 2.0 PostgreSQL com índices compostos para busca rápida de imóveis',
      'Scripts de migração Alembic reversíveis com estratégia Zero-Downtime Expand & Contract',
      'Frontend em React 19 e Vite estruturado em Feature-Sliced Design (FSD)',
      'Componentes visuais do Olivelas Copan Design System com acessibilidade WCAG 2.1 AA',
      'Rastreamento distribuído e observabilidade com OpenTelemetry',
    ],
    systemInstruction:
      'Você é o Arquiteto de Software Lead da Olivelas. Gere um Blueprint técnico completo e determinístico alinhado às Golden Rules (RUL-01 a RUL-04), garantindo isolamento de dados e zero-downtime.',
    temperature: 0.2,
  },
  {
    id: 'contracts_portal',
    title: 'Portal de Contratos & Renegociação',
    icon: '📜',
    tag: 'Legal & Contratos',
    appName: 'Olivelas Lease Contract Negotiation Portal',
    description:
      'Portal de gestão e renegociação de contratos de locação imobiliária com cálculo de reajuste por IGP-M/IPCA e assinatura digital.',
    requirements: [
      'Workflow de renegociação de aluguel e IPTU com auditoria de controle de acesso BOLA/BFLA',
      'Tabela de contratos com filtros avançados, ordenação e paginação Copan DataTable',
      'Webhooks assíncronos para consumo de eventos Kafka de formalização de assinatura',
      'Suíte de testes automatizados com PyTest, TestClient e fixtures isoladas',
      'Sanitização estrita de PII (dados sensíveis de inquilinos e fiadores) em logs',
    ],
    systemInstruction:
      'Você é o Especialista em Segurança e Contratos da Olivelas. Formule o Blueprint com foco em governança de dados, conformidade jurídica e prevenção a vulnerabilidades OWASP Top 10.',
    temperature: 0.15,
  },
  {
    id: 'inspections_claims',
    title: 'Vistorias & Laudos Digitais',
    icon: '📋',
    tag: 'Operações / Mobile',
    appName: 'Olivelas Property Inspection & Digital Claims',
    description:
      'Sistema de agendamento e emissão de laudos de vistoria de entrada e saída com fotos geolocalizadas e checklist dinâmico.',
    requirements: [
      'Upload seguro de fotos de vistoria para bucket S3 com compressão assíncrona',
      'Arquitetura em camadas desacopladas: Router -> Service -> Repository em FastAPI',
      'Validação de dados com schemas Pydantic v2 estritos e tipagem forte',
      'Interface responsiva com suporte a modo offline / sincronização em segundo plano',
      'Contratos de API documentados em OpenAPI 3.1 com exemplos realistas',
    ],
    systemInstruction:
      'Você é o Arquiteto de Soluções Cloud da Olivelas. Desenvolva o Blueprint priorizando alta disponibilidade, otimização de assets multimídia e resiliência a falhas de rede.',
    temperature: 0.2,
  },
  {
    id: 'broker_crm',
    title: 'CRM de Corretores & AI Lead Dispatch',
    icon: '🤝',
    tag: 'Comercial / CRM',
    appName: 'Olivelas Broker CRM & Intelligent Lead Dispatch',
    description:
      'CRM especializado para corretores parceiros com fila de atendimento inteligente, pontuação de leads por IA e funil de vendas.',
    requirements: [
      'Algoritmo de distribuição de leads por proximidade geográfica e taxa de conversão',
      'Fila de mensageria assíncrona com RabbitMQ / Celery para notificações em tempo real',
      'Autenticação multifator (MFA) e controle de sessão por token revogável',
      'Painel Kanban com arrastar e soltar (Drag and Drop) integrado ao Copan Design System',
      'Métricas de desempenho com cálculo de SLA de primeiro contato',
    ],
    systemInstruction:
      'Você é o Engenheiro Lead de Sistemas Distribuídos da Olivelas. Estruture o Blueprint para alta vazão de mensagens e processamento assíncrono com idempotência.',
    temperature: 0.25,
  },
  {
    id: 'condo_billing',
    title: 'Integração de Condomínios & Boletos',
    icon: '🏦',
    tag: 'Integrações / Core',
    appName: 'Olivelas Condominium Bill & Fee Integration Service',
    description:
      'Microsserviço de conciliação de taxas condominiais, emissão de boletos registrados e baixa automática via APIs bancárias.',
    requirements: [
      'Integração com APIs bancárias via Webhooks com validação de assinatura HMAC',
      'Garantia de transações ACID e isolamento de banco de dados por tenant (Golden Rule RUL-01)',
      'Contratos OpenAPI 3.1 estritos para comunicação entre microsserviços',
      'Jobs agendados para verificação periódica de inadimplência e envio de lembretes',
      'Relatórios financeiros consolidados exportáveis em CSV e PDF',
    ],
    systemInstruction:
      'Você é o Principal Engineer do Core Bancário da Olivelas. Garanta que o Blueprint reflita transações financeiras atômicas, tolerância a falhas e total rastreabilidade contábil.',
    temperature: 0.1,
  },
  {
    id: 'iam_audit_analytics',
    title: 'Painel Executivo de IAM & Auditoria',
    icon: '🛡️',
    tag: 'Segurança / IAM',
    appName: 'Olivelas Enterprise IAM & Security Audit Dashboard',
    description:
      'Console de segurança para auditoria em tempo real de acessos, matriz RBAC, sessões ativas e histórico imutável de eventos.',
    requirements: [
      'Dashboard analítico em React 19 com Copan StatCards e gráficos de tendências',
      'Matriz RBAC dinâmica com permissões refinadas por recurso e ação',
      'Trilha de auditoria imutável gravada em banco append-only com filtros de busca',
      'Encerramento instantâneo de sessões suspeitas com invalidação de cache Redis',
      'Geração automatizada de relatórios de conformidade SOC2 e LGPD',
    ],
    systemInstruction:
      'Você é o Diretor de Segurança da Informação (CISO) e Arquiteto de IAM da Olivelas. Construa o Blueprint com foco em Zero-Trust, menor privilégio e observabilidade profunda de acessos.',
    temperature: 0.15,
  },
];

export const AIBlueprintComposerPage: React.FC = () => {
  // Provider & Model settings imported from /ai/providers
  const [providerSettings, setProviderSettings] = useState<MultiProviderSettings | null>(null);
  const [availableModels, setAvailableModels] = useState<AiModelOption[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Form State
  const [selectedProvider, setSelectedProvider] = useState<string>('gemini');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [appName, setAppName] = useState<string>(COMPOSER_PRESETS[0].appName);
  const [appDescription, setAppDescription] = useState<string>(COMPOSER_PRESETS[0].description);
  const [requirementsText, setRequirementsText] = useState<string>(
    COMPOSER_PRESETS[0].requirements.join('\n')
  );
  const [systemInstruction, setSystemInstruction] = useState<string>(
    COMPOSER_PRESETS[0].systemInstruction
  );
  const [temperature, setTemperature] = useState<number>(COMPOSER_PRESETS[0].temperature);
  const [generateAiRationale, setGenerateAiRationale] = useState<boolean>(true);

  // Execution State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIComposeBlueprintResponse | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>(COMPOSER_PRESETS[0].id);

  // Load AI Settings and Models on mount
  useEffect(() => {
    loadProviderSettings();
  }, []);

  const loadProviderSettings = async () => {
    setLoadingProviders(true);
    try {
      const [settingsRes, modelsRes] = await Promise.all([
        aiSettingsService.getAiSettings(),
        aiSettingsService.getAiModels(),
      ]);
      setProviderSettings(settingsRes);
      setAvailableModels(modelsRes);

      if (settingsRes.default_provider) {
        setSelectedProvider(settingsRes.default_provider);
      }
      if (settingsRes.default_model) {
        setSelectedModel(settingsRes.default_model);
      }
    } catch (err: any) {
      console.warn('Usando configurações padrão para o AI Composer:', err);
      setSelectedProvider('gemini');
      setSelectedModel('gemini-2.5-flash');
    } finally {
      setLoadingProviders(false);
    }
  };

  // Get models available for current selected provider
  const getModelsForProvider = (): Array<{ id: string; name: string }> => {
    if (!providerSettings) {
      return [
        { id: 'gemini-2.5-flash', name: 'Google Gemini 2.5 Flash' },
        { id: 'gemini-2.5-pro', name: 'Google Gemini 2.5 Pro' },
        { id: 'gemini-2.5-flash-lite', name: 'Google Gemini 2.5 Flash-Lite' },
        { id: 'gemini-2.0-flash', name: 'Google Gemini 2.0 Flash' },
        { id: 'gpt-4o', name: 'OpenAI GPT-4o' },
        { id: 'claude-3-7-sonnet', name: 'Anthropic Claude 3.7 Sonnet' },
        { id: 'claude-3-5-sonnet', name: 'Anthropic Claude 3.5 Sonnet' },
        { id: 'grok-2', name: 'xAI Grok-2' },
      ];
    }

    const currentProv = providerSettings.providers.find((p) => p.id === selectedProvider);
    if (currentProv && currentProv.available_models && currentProv.available_models.length > 0) {
      return currentProv.available_models.map((m: any) => ({
        id: typeof m === 'string' ? m : m.id,
        name: typeof m === 'string' ? m : m.name || m.id,
      }));
    }

    const filtered = availableModels.filter((m) => m.provider === selectedProvider);
    if (filtered.length > 0) {
      return filtered.map((m) => ({ id: m.id, name: m.name || m.id }));
    }

    if (selectedProvider === 'gemini') {
      return [
        { id: 'gemini-3.0-flash', name: 'Google Gemini 3.0 Flash (Next-Gen Recomendado)' },
        { id: 'gemini-3.0-pro', name: 'Google Gemini 3.0 Pro (Next-Gen Flagship)' },
        { id: 'gemini-3.0-flash-preview', name: 'Google Gemini 3.0 Flash Preview' },
        { id: 'gemini-3.0-pro-preview', name: 'Google Gemini 3.0 Pro Preview' },
        { id: 'gemini-3-flash', name: 'Google Gemini 3 Flash' },
        { id: 'gemini-3-pro', name: 'Google Gemini 3 Pro' },
        { id: 'gemini-2.5-flash', name: 'Google Gemini 2.5 Flash' },
        { id: 'gemini-2.5-pro', name: 'Google Gemini 2.5 Pro' },
        { id: 'gemini-2.5-flash-lite', name: 'Google Gemini 2.5 Flash-Lite' },
        { id: 'gemini-2.0-flash', name: 'Google Gemini 2.0 Flash' },
        { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash' },
      ];
    } else if (selectedProvider === 'openai') {
      return [
        { id: 'gpt-4o', name: 'GPT-4o (Omni)' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'o3-mini', name: 'OpenAI o3-mini' },
      ];
    } else if (selectedProvider === 'anthropic') {
      return [
        { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
        { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
        { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku' },
      ];
    } else if (selectedProvider === 'grok') {
      return [{ id: 'grok-2', name: 'xAI Grok-2' }];
    } else if (selectedProvider === 'ollama') {
      return [
        { id: 'llama3:8b', name: 'Llama 3 8B (Local)' },
        { id: 'mistral', name: 'Mistral 7B (Local)' },
      ];
    }

    return [{ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' }];
  };

  const handleApplyPreset = (preset: SddComposerPreset) => {
    setActivePresetId(preset.id);
    setAppName(preset.appName);
    setAppDescription(preset.description);
    setRequirementsText(preset.requirements.join('\n'));
    setSystemInstruction(preset.systemInstruction);
    setTemperature(preset.temperature);
    message.info(`Preset carregado: ${preset.title}`);
  };

  const handleProviderChange = (newProvider: string) => {
    setSelectedProvider(newProvider);
    if (newProvider === 'gemini') setSelectedModel('gemini-2.5-flash');
    else if (newProvider === 'openai') setSelectedModel('gpt-4o');
    else if (newProvider === 'anthropic') setSelectedModel('claude-3-7-sonnet');
    else if (newProvider === 'grok') setSelectedModel('grok-2');
    else if (newProvider === 'ollama') setSelectedModel('llama3:8b');
  };

  const handleCompose = async () => {
    const rawReqs = requirementsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (!appName.trim()) {
      message.error('Por favor, informe o nome da aplicação.');
      return;
    }
    if (rawReqs.length === 0) {
      message.error('Por favor, insira ao menos um requisito funcional.');
      return;
    }

    setLoading(true);
    try {
      const res = await aiService.composeBlueprint({
        application: {
          name: appName.trim(),
          description: appDescription.trim(),
        },
        requirements: rawReqs,
        provider: selectedProvider,
        model: selectedModel,
        temperature: temperature,
        system_instruction: systemInstruction,
        generate_ai_rationale: generateAiRationale,
      });

      setResult(res);
      message.success('Blueprint composto com sucesso com parecer técnico da IA!');
    } catch (err: any) {
      message.error(`Erro ao compor blueprint: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const providerModels = getModelsForProvider();

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Blueprint Composer"
        subtitle="Compositor inteligente orientado por IA para geração de Blueprints, mapeamento determinístico de módulos e parecer de arquitetura Olivelas"
      />

      {/* Banner de Sincronização com /ai/providers */}
      <div className="p-3.5 bg-white rounded-xl border border-[#D9E2EC] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center text-[#0066CC] font-bold text-lg">
            <RobotOutlined />
          </div>
          <div>
            <div className="text-xs font-bold text-loft-dark flex items-center gap-2">
              <span>Configurações Importadas de /ai/providers</span>
              <Tag color="cyan" className="font-mono text-[10px]">
                Sincronizado
              </Tag>
            </div>
            <div className="text-[11px] text-loft-muted">
              Provedor Ativo: <strong className="text-loft-dark">{selectedProvider.toUpperCase()}</strong> | Modelo Selecionado:{' '}
              <strong className="text-[#0066CC] font-mono">{selectedModel}</strong>
            </div>
          </div>
        </div>

        <Space>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            loading={loadingProviders}
            onClick={loadProviderSettings}
          >
            Sincronizar Modelos
          </Button>
          <a
            href="#ai-providers"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'ai-providers';
              window.dispatchEvent(new HashChangeEvent('hashchange'));
            }}
          >
            <Button size="small" icon={<SettingOutlined />}>
              Gerenciar Provedores
            </Button>
          </a>
        </Space>
      </div>

      {/* 6 Presets Canônicos SDD Olivelas */}
      <Card
        title={
          <div className="flex items-center gap-2 text-xs font-bold text-loft-dark">
            <BulbOutlined className="text-loft-orange" />
            <span>Exemplos Canônicos SDD Olivelas (Frontend & Backend)</span>
          </div>
        }
        className="shadow-2xs border-loft-border"
        size="small"
      >
        <div className="text-xs text-loft-muted mb-3">
          Selecione um exemplo pré-configurado baseado nas especificações reais de arquitetura e design system da Olivelas:
        </div>
        <Row gutter={[10, 10]}>
          {COMPOSER_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <Col xs={24} sm={12} md={8} key={p.id}>
                <div
                  onClick={() => handleApplyPreset(p)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all h-full flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#F0F7FF] border-[#0066CC] shadow-2xs'
                      : 'bg-white border-loft-border hover:border-[#BCCCDC] hover:bg-[#FAFBFD]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base">{p.icon}</span>
                      <Tag color={isSelected ? 'blue' : 'default'} className="text-[10px] m-0">
                        {p.tag}
                      </Tag>
                    </div>
                    <div className="text-xs font-bold text-loft-dark mb-1">{p.title}</div>
                    <div className="text-[11px] text-loft-muted line-clamp-2 leading-relaxed">
                      {p.description}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#EDF2F7] flex items-center justify-between text-[10px] text-[#829AB1]">
                    <span>{p.requirements.length} requisitos</span>
                    {isSelected && (
                      <span className="text-[#0066CC] font-bold flex items-center gap-1">
                        <CheckCircleOutlined /> Ativo
                      </span>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Formulário Principal: Configurações de IA + Metadados da Aplicação */}
      <Row gutter={16}>
        {/* Coluna 1: Dados da Aplicação e Requisitos */}
        <Col xs={24} lg={15}>
          <Card
            title={
              <div className="flex items-center gap-2 text-xs font-bold text-loft-dark">
                <ApartmentOutlined className="text-[#0066CC]" />
                <span>Especificação da Aplicação & Requisitos Funcionais</span>
              </div>
            }
            className="shadow-2xs border-loft-border"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-loft-dark mb-1">
                  Nome da Aplicação
                </label>
                <Input
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Ex: Olivelas Marketplace & Finance Split Hub"
                  className="font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-loft-dark mb-1">
                  Descrição do Propósito de Negócio
                </label>
                <Input.TextArea
                  rows={2}
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="Ex: Plataforma para intermediação de compra e venda de imóveis com cálculo de comissão..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-loft-dark mb-1">
                  Requisitos Funcionais & Termos de Negócio (1 por linha)
                </label>
                <Input.TextArea
                  rows={8}
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  className="font-mono text-xs leading-relaxed"
                  placeholder="Insira um requisito por linha..."
                />
                <div className="text-[11px] text-loft-muted mt-1 flex items-center justify-between">
                  <span>
                    O motor mapeará termos contra o catálogo de módulos, componentes Copan e Golden Rules.
                  </span>
                  <span>{requirementsText.split('\n').filter((r) => r.trim()).length} requisitos</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Coluna 2: Configuração de IA Importada */}
        <Col xs={24} lg={9}>
          <Card
            title={
              <div className="flex items-center gap-2 text-xs font-bold text-loft-dark">
                <SettingOutlined className="text-[#0066CC]" />
                <span>Parâmetros de Inferência da IA</span>
              </div>
            }
            className="shadow-2xs border-loft-border"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-loft-dark mb-1">
                  Provedor de IA (Importado de /ai/providers)
                </label>
                <Select
                  value={selectedProvider}
                  onChange={handleProviderChange}
                  className="w-full"
                  options={[
                    { label: '🟢 Google Gemini (Recomendado)', value: 'gemini' },
                    { label: '🟣 OpenAI', value: 'openai' },
                    { label: '🟠 Anthropic Claude', value: 'anthropic' },
                    { label: '⚪ xAI Grok', value: 'grok' },
                    { label: '🔵 Ollama (Local)', value: 'ollama' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-loft-dark mb-1">
                  Modelo de IA Disponível
                </label>
                <Select
                  value={selectedModel}
                  onChange={setSelectedModel}
                  className="w-full"
                  options={providerModels.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-loft-dark mb-1">
                  <span className="font-bold">Temperatura de Inferência</span>
                  <span className="font-mono font-bold text-[#0066CC]">{temperature}</span>
                </div>
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={temperature}
                  onChange={setTemperature}
                />
                <div className="flex justify-between text-[10px] text-[#829AB1]">
                  <span>Determinístico (0.0)</span>
                  <span>Criativo (1.0)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-loft-dark mb-1">
                  Instrução de Sistema (System Prompt)
                </label>
                <Input.TextArea
                  rows={4}
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  className="text-xs"
                  placeholder="Instruções para o raciocínio da IA..."
                />
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-loft-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-loft-dark">Parecer de IA em Tempo Real</div>
                  <div className="text-[11px] text-loft-muted">Executar inferência real via AI Gateway</div>
                </div>
                <Switch
                  checked={generateAiRationale}
                  onChange={setGenerateAiRationale}
                  style={{ background: generateAiRationale ? '#0066CC' : undefined }}
                />
              </div>

              <Button
                type="primary"
                size="large"
                icon={<ThunderboltOutlined />}
                loading={loading}
                onClick={handleCompose}
                className="w-full"
                style={{ background: '#FF774A', borderColor: '#FF774A' }}
              >
                Compor Blueprint com {selectedModel}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Resultados da Composição */}
      {result && (
        <Card
          title={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-sm font-bold text-loft-dark">
                <CheckCircleOutlined className="text-loft-success" />
                <span>Resultado do Blueprint: {result.application_name}</span>
              </div>
              <Space>
                <Tag color="blue" className="font-mono text-xs">
                  ID: {result.blueprint_id}
                </Tag>
                {result.ai_latency_ms && (
                  <Tag color="cyan" className="font-mono text-xs">
                    {result.ai_latency_ms} ms
                  </Tag>
                )}
                {result.ai_tokens_used && (
                  <Tag color="purple" className="font-mono text-xs">
                    {result.ai_tokens_used} tokens
                  </Tag>
                )}
              </Space>
            </div>
          }
          className="shadow-xs border-[#8CE0CC]"
        >
          <div className="space-y-5">
            {/* Parecer Técnico e Racional da IA */}
            {result.ai_reasoning && (
              <Alert
                message={
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      💡 Parecer de Arquitetura & Raciocínio Técnico ({result.ai_provider?.toUpperCase()} / {result.ai_model})
                    </span>
                    <Button
                      size="small"
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(result.ai_reasoning || '');
                        message.success('Parecer copiado!');
                      }}
                    >
                      Copiar Parecer
                    </Button>
                  </div>
                }
                description={
                  <div className="mt-2 text-xs leading-relaxed whitespace-pre-wrap font-sans text-loft-dark">
                    {result.ai_reasoning}
                  </div>
                }
                type="info"
                showIcon
                className="bg-[#F0F7FF] border-[#BAE3FF]"
              />
            )}

            {/* Resumo dos Blocos Identificados */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FAFBFD] rounded-lg border border-loft-border">
                <div className="text-[11px] text-loft-muted font-semibold uppercase mb-1">
                  Módulos Mapeados
                </div>
                <div className="text-lg font-bold text-loft-dark mb-1.5">
                  {result.identified_modules?.length || 0}
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.identified_modules?.map((m) => (
                    <Tag key={m} color="blue" className="text-[10px] m-0">
                      {m}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAFBFD] rounded-lg border border-loft-border">
                <div className="text-[11px] text-loft-muted font-semibold uppercase mb-1">
                  Componentes Copan
                </div>
                <div className="text-lg font-bold text-loft-dark mb-1.5">
                  {result.identified_components?.length || 0}
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.identified_components?.slice(0, 4).map((c) => (
                    <Tag key={c} color="purple" className="text-[10px] m-0">
                      {c}
                    </Tag>
                  ))}
                  {(result.identified_components?.length || 0) > 4 && (
                    <Tag className="text-[10px] m-0">+{result.identified_components.length - 4}</Tag>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#FAFBFD] rounded-lg border border-loft-border">
                <div className="text-[11px] text-loft-muted font-semibold uppercase mb-1">
                  Golden Rules Aplicadas
                </div>
                <div className="text-lg font-bold text-loft-dark mb-1.5">
                  {result.identified_rules?.length || 0}
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.identified_rules?.map((r) => (
                    <Tag key={r} color="orange" className="text-[10px] m-0">
                      {r}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAFBFD] rounded-lg border border-loft-border">
                <div className="text-[11px] text-loft-muted font-semibold uppercase mb-1">
                  Contratos de API REST
                </div>
                <div className="text-lg font-bold text-loft-dark mb-1.5">
                  {result.api_contracts?.length || 0}
                </div>
                <div className="text-[11px] text-loft-muted">
                  Endpoints padronizados OpenAPI 3.1
                </div>
              </div>
            </div>

            {/* Tabs com Detalhes Técnicos */}
            <Tabs
              items={[
                {
                  key: 'contracts',
                  label: (
                    <span>
                      <ApiOutlined /> Contratos de API REST ({result.api_contracts?.length || 0})
                    </span>
                  ),
                  children: (
                    <Table
                      dataSource={result.api_contracts || []}
                      rowKey={(r) => `${r.method}-${r.path}`}
                      pagination={{ pageSize: 5 }}
                      size="small"
                      columns={[
                        {
                          title: 'Método',
                          dataIndex: 'method',
                          width: 100,
                          render: (method: string) => (
                            <Tag color={method === 'POST' ? 'green' : 'blue'} className="font-mono font-bold">
                              {method}
                            </Tag>
                          ),
                        },
                        {
                          title: 'Endpoint Path',
                          dataIndex: 'path',
                          render: (path: string) => (
                            <span className="font-mono text-xs font-bold text-loft-dark">{path}</span>
                          ),
                        },
                        {
                          title: 'Descrição / Módulo',
                          dataIndex: 'summary',
                          render: (summary: string) => <span className="text-xs text-loft-muted">{summary}</span>,
                        },
                        {
                          title: 'Status Code',
                          dataIndex: 'status_code',
                          width: 110,
                          render: (code: number) => (
                            <Tag color="cyan" className="font-mono">
                              {code} OK
                            </Tag>
                          ),
                        },
                      ]}
                    />
                  ),
                },
                {
                  key: 'structure',
                  label: (
                    <span>
                      <BranchesOutlined /> Estrutura de Diretórios
                    </span>
                  ),
                  children: (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => {
                            navigator.clipboard.writeText(result.folder_structure || '');
                            message.success('Estrutura copiada!');
                          }}
                        >
                          Copiar Árvore
                        </Button>
                      </div>
                      <pre className="p-3 bg-loft-dark text-loft-border rounded-lg text-xs font-mono overflow-x-auto max-h-72">
                        {result.folder_structure}
                      </pre>
                    </div>
                  ),
                },
                {
                  key: 'blueprint',
                  label: (
                    <span>
                      <CodeOutlined /> Blueprint JSON Canônico
                    </span>
                  ),
                  children: (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(result.raw_blueprint, null, 2));
                            message.success('JSON copiado!');
                          }}
                        >
                          Copiar JSON
                        </Button>
                      </div>
                      <pre className="p-3 bg-loft-dark text-loft-success rounded-lg text-xs font-mono overflow-x-auto max-h-80">
                        {JSON.stringify(result.raw_blueprint, null, 2)}
                      </pre>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
