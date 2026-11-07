import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Input,
  Select,
  Switch,
  Slider,
  Table,
  Space,
  Spin,
  Alert,
  message,
  Typography,
  Divider,
  Modal,
  Tooltip,
} from 'antd';
import {
  ApiOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  ReloadOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  SendOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@/components/loft/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { aiGatewayService } from '@/services/aiGateway.service';
import { aiSettingsService } from '@/services/aiSettings.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type {
  AiGatewayPolicy,
  AiGatewayMetrics,
  AiGatewayExecutionLog,
  AiGatewayExecuteResponse,
  AiProviderConfigItem,
} from '@/types/ai.types';

const { Text } = Typography;

export const AIGatewayPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<AiGatewayMetrics | null>(null);
  const [policy, setPolicy] = useState<AiGatewayPolicy | null>(null);
  const [providers, setProviders] = useState<AiProviderConfigItem[]>([]);
  const [logs, setLogs] = useState<AiGatewayExecutionLog[]>([]);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [savingPolicy, setSavingPolicy] = useState<boolean>(false);
  const { currentPage, pageSize, onPaginationChange } = useUrlPagination(5);

  // Playground state
  const [playgroundPrompt, setPlaygroundPrompt] = useState<string>(
    'Explique brevemente as diretrizes de governança de arquitetura de microsserviços na Olivelas.'
  );
  const [playgroundSysPrompt, setPlaygroundSysPrompt] = useState<string>(
    'Você é o assistente sênior de arquitetura de software da Olivelas.'
  );
  const [playgroundTemp, setPlaygroundTemp] = useState<number>(0.2);
  const [executing, setExecuting] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<AiGatewayExecuteResponse | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // Execution Log Inspection Modal
  const [selectedLogForModal, setSelectedLogForModal] = useState<AiGatewayExecutionLog | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`${label} copiado para a área de transferência!`);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, p, lRes, provSettings] = await Promise.all([
        aiGatewayService.getMetrics(),
        aiGatewayService.getPolicy(),
        aiGatewayService.getLogsPaginated({ page: currentPage, page_size: pageSize }),
        aiSettingsService.getAiSettings(),
      ]);
      setMetrics(m);
      setPolicy(p);
      setLogs(lRes.items);
      setTotalLogs(lRes.total);
      setProviders(provSettings.providers || []);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar telemetria e políticas do AI Gateway.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSavePolicy = async () => {
    if (!policy) return;
    setSavingPolicy(true);
    try {
      const updated = await aiGatewayService.updatePolicy(policy);
      setPolicy(updated);
      message.success('Políticas do AI Gateway salvas com sucesso no banco de dados!');
      // Refresh metrics to reflect new active provider & model
      const m = await aiGatewayService.getMetrics();
      setMetrics(m);
    } catch (err: any) {
      message.error(err.message || 'Falha ao atualizar políticas do AI Gateway.');
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleExecutePrompt = async () => {
    if (!playgroundPrompt.trim()) {
      message.warning('Por favor insira um prompt para execução.');
      return;
    }
    setExecuting(true);
    setExecutionError(null);
    setLastResponse(null);
    try {
      const res = await aiGatewayService.executePrompt({
        prompt: playgroundPrompt,
        system_prompt: playgroundSysPrompt || undefined,
        temperature: playgroundTemp,
      });
      setLastResponse(res);
      message.success(`Prompt executado com sucesso em ${res.latency_ms}ms!`);
      // Reload logs and metrics
      const [m, lRes] = await Promise.all([
        aiGatewayService.getMetrics(),
        aiGatewayService.getLogsPaginated({ page: currentPage, page_size: pageSize }),
      ]);
      setMetrics(m);
      setLogs(lRes.items);
      setTotalLogs(lRes.total);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Erro durante a inferência no Gateway';
      setExecutionError(msg);
      message.error(msg);
    } finally {
      setExecuting(false);
    }
  };

  const logColumns = [
    {
      title: 'Data / Hora',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (t: string) => <span className="text-xs font-mono text-loft-muted">{t}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (st: string) => {
        if (st === 'SUCCESS') return <Tag color="green" icon={<CheckCircleOutlined />}>Sucesso</Tag>;
        if (st === 'CACHED') return <Tag color="blue" icon={<DatabaseOutlined />}>Em Cache</Tag>;
        return <Tag color="red" icon={<CloseCircleOutlined />}>Falha</Tag>;
      },
    },
    {
      title: 'Modelo / Provedor',
      key: 'model_prov',
      render: (_: any, r: AiGatewayExecutionLog) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold text-loft-dark">{r.model}</span>
          <span className="text-[11px] text-loft-muted uppercase">{r.provider}</span>
        </div>
      ),
    },
    {
      title: 'Latência',
      dataIndex: 'latency_ms',
      key: 'latency_ms',
      width: 100,
      render: (ms: number) => (
        <Tag color={ms < 100 ? 'green' : ms < 500 ? 'blue' : 'orange'}>
          {ms} ms
        </Tag>
      ),
    },
    {
      title: 'Tokens',
      dataIndex: 'tokens_used',
      key: 'tokens_used',
      width: 90,
      render: (tok: number) => <span className="text-xs font-mono">{tok}</span>,
    },
    {
      title: 'Prompt / Resposta',
      key: 'preview',
      render: (_: any, r: AiGatewayExecutionLog) => (
        <div className="flex items-center justify-between gap-2 max-w-lg">
          <div className="text-xs truncate flex-1 min-w-0">
            <div className="truncate">
              <span className="font-semibold text-loft-dark">P: </span>
              <span className="text-loft-muted">{r.prompt_preview || r.full_prompt || '-'}</span>
            </div>
            <div className="truncate">
              <span className="font-semibold text-[#0066CC]">R: </span>
              <span className="text-loft-dark">{r.response_preview || r.full_response || '-'}</span>
            </div>
          </div>
          <Tooltip title="Visualizar mensagem completa em modal">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedLogForModal(r);
                setIsLogModalOpen(true);
              }}
              className="text-xs shrink-0 flex items-center gap-1 border-[#CBD2D9] hover:border-[#FF774A] hover:text-[#FF774A]"
            >
              Ver Completo
            </Button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Ator',
      dataIndex: 'actor',
      key: 'actor',
      width: 140,
      render: (a: string) => <span className="text-xs text-loft-muted truncate block">{a}</span>,
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 110,
      render: (_: any, r: AiGatewayExecutionLog) => (
        <Button
          size="small"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedLogForModal(r);
            setIsLogModalOpen(true);
          }}
          className="text-xs text-[#0066CC] font-medium p-0"
        >
          Visualizar
        </Button>
      ),
    },
  ];

  if (loading && !policy) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Spin size="large" />
          <Text className="text-loft-muted text-sm">Carregando telemetria do AI Gateway...</Text>
        </div>
      </PageContainer>
    );
  }

  const successRate = metrics && metrics.total_requests > 0
    ? ((metrics.successful_requests / metrics.total_requests) * 100).toFixed(1)
    : '100.0';

  const currentPrimaryProvider = providers.find((pr) => pr.id === policy?.primary_provider);
  const currentFallbackProvider = providers.find((pr) => pr.id === policy?.fallback_provider);

  return (
    <PageContainer>
      <PageHeader
        title="AI Gateway & Roteamento Corporativo"
        subtitle="Gateway centralizado de inferência para LLMs com telemetria em tempo real, proteção PII, cache semântico e failover automático."
        breadcrumbs={[
          { title: 'AI & Integrações' },
          { title: 'AI Gateway' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData}>
              Atualizar Telemetria
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={savingPolicy}
              onClick={handleSavePolicy}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
            >
              Salvar Políticas
            </Button>
          </Space>
        }
      />

      {/* KPI Telemetry Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="border-loft-border shadow-2xs h-full flex flex-col justify-between">
            <div className="text-xs text-loft-muted font-medium mb-1">Total de Requisições</div>
            <div className="text-2xl font-bold text-loft-dark">
              {metrics?.total_requests || 0}
            </div>
            <div className="text-[11px] text-loft-muted mt-2 flex items-center gap-1">
              <span className="text-loft-success font-semibold">{metrics?.cached_requests || 0}</span> requisições servidas via cache
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="border-loft-border shadow-2xs h-full flex flex-col justify-between">
            <div className="text-xs text-loft-muted font-medium mb-1">Taxa de Sucesso (SLA)</div>
            <div className="text-2xl font-bold text-loft-success flex items-center gap-2">
              <span>{successRate}%</span>
              <Tag color="green" className="text-[10px]">99.9% Target</Tag>
            </div>
            <div className="text-[11px] text-loft-muted mt-2">
              {metrics?.failed_requests || 0} erros registrados
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="border-loft-border shadow-2xs h-full flex flex-col justify-between">
            <div className="text-xs text-loft-muted font-medium mb-1">Latência Média de Inferência</div>
            <div className="text-2xl font-bold text-[#0066CC] flex items-center gap-1.5">
              <ClockCircleOutlined className="text-base" />
              <span>{metrics?.avg_latency_ms || 120} ms</span>
            </div>
            <div className="text-[11px] text-loft-success mt-2 font-medium flex items-center gap-1">
              <ThunderboltOutlined />
              <span>{metrics?.active_model || 'Modelo Padrão'}</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card size="small" className="border-loft-border shadow-2xs h-full flex flex-col justify-between">
            <div className="text-xs text-loft-muted font-medium mb-1">Tokens Processados</div>
            <div className="text-2xl font-bold text-[#FF774A]">
              {((metrics?.total_prompt_tokens || 0) + (metrics?.total_completion_tokens || 0)).toLocaleString()}
            </div>
            <div className="text-[11px] text-loft-muted mt-2">
              Entrada: {metrics?.total_prompt_tokens || 0} | Saída: {metrics?.total_completion_tokens || 0}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Grid: Policy Configuration & Interactive Playground */}
      <Row gutter={[24, 24]} className="mb-6">
        {/* Left: Security & Policy Governance */}
        <Col xs={24} lg={11}>
          <Card
            className="border-loft-border shadow-2xs h-full flex flex-col justify-between"
            title={
              <div className="flex items-center gap-2">
                <SafetyCertificateOutlined className="text-[#FF774A]" />
                <span className="font-bold text-sm">Políticas de Roteamento & Segurança</span>
              </div>
            }
          >
            {policy && (
              <div className="space-y-4 flex-1">
                {/* Security Toggles */}
                <div className="p-3 bg-[#FAFBFD] rounded-lg border border-loft-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-loft-dark">Sanitização Automática de PII</div>
                      <div className="text-[11px] text-loft-muted">Mascara CPFs, cartões e e-mails sensíveis antes do envio ao LLM</div>
                    </div>
                    <Switch
                      checked={policy.enable_pii_sanitization}
                      onChange={(v) => setPolicy({ ...policy, enable_pii_sanitization: v })}
                    />
                  </div>

                  <Divider className="my-2" />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-loft-dark">Cache Semântico de Respostas</div>
                      <div className="text-[11px] text-loft-muted">Reutiliza respostas idênticas com latência zero (0ms)</div>
                    </div>
                    <Switch
                      checked={policy.enable_semantic_cache}
                      onChange={(v) => setPolicy({ ...policy, enable_semantic_cache: v })}
                    />
                  </div>

                  <Divider className="my-2" />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-loft-dark">Failover Automático (Fallback)</div>
                      <div className="text-[11px] text-loft-muted">Redireciona para provedor secundário em caso de timeout</div>
                    </div>
                    <Switch
                      checked={policy.enable_fallback}
                      onChange={(v) => setPolicy({ ...policy, enable_fallback: v })}
                    />
                  </div>
                </div>

                {/* Routing Details & Selects */}
                <div className="space-y-3">
                  {/* Primary Provider Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-loft-dark">Provedor Primário de Roteamento</label>
                      <a href="/ai/providers" className="text-[11px] text-[#FF774A] hover:underline flex items-center gap-1 font-medium">
                        <SettingOutlined /> Configurar Chaves
                      </a>
                    </div>
                    <Select
                      size="large"
                      value={policy.primary_provider}
                      onChange={(newProvId) => {
                        const selectedProv = providers.find((p) => p.id === newProvId);
                        const nextModel = selectedProv?.default_model || selectedProv?.available_models?.[0]?.id || '';
                        setPolicy({
                          ...policy,
                          primary_provider: newProvId,
                          primary_model: nextModel,
                        });
                      }}
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                    >
                      {providers.map((p) => (
                        <Select.Option
                          key={p.id}
                          value={p.id}
                          label={
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-loft-dark">{p.name}</span>
                              {p.is_custom && <Tag color="blue" className="text-[10px] m-0">Custom</Tag>}
                              {p.status === 'configured' ? (
                                <Tag color="green" className="text-[10px] m-0">Configurado</Tag>
                              ) : (
                                <Tag color="default" className="text-[10px] m-0">Sem Chave</Tag>
                              )}
                            </div>
                          }
                        >
                          <div className="py-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-loft-dark">{p.name}</span>
                              <div className="flex gap-1">
                                {p.is_custom && <Tag color="blue">Custom</Tag>}
                                {p.status === 'configured' ? (
                                  <Tag color="green">Configurado</Tag>
                                ) : (
                                  <Tag color="default">Sem Chave</Tag>
                                )}
                              </div>
                            </div>
                            <div className="text-[11px] text-loft-muted font-mono mt-0.5">
                              ID: {p.id} • Modelo Padrão: {p.default_model || 'Não definido'}
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  {/* Primary Model Selector */}
                  <div>
                    <label className="text-xs font-semibold text-loft-dark block mb-1">
                      Modelo Cognitivo Primário
                    </label>
                    <Select
                      size="large"
                      showSearch
                      value={policy.primary_model}
                      onChange={(newModel) => setPolicy({ ...policy, primary_model: newModel })}
                      style={{ width: '100%' }}
                      placeholder="Selecione ou digite o modelo primário..."
                      optionFilterProp="children"
                    >
                      {currentPrimaryProvider?.available_models && currentPrimaryProvider.available_models.length > 0 ? (
                        currentPrimaryProvider.available_models.map((m) => (
                          <Select.Option key={m.id} value={m.id}>
                            <div className="flex items-center justify-between py-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-loft-dark">{m.name || m.id}</span>
                                {m.recommended && <Tag color="orange" className="text-[10px]">Recomendado</Tag>}
                                {m.context_window && (
                                  <span className="text-[10px] text-loft-muted">({(m.context_window / 1000).toFixed(0)}k ctx)</span>
                                )}
                              </div>
                              <span className="text-[11px] text-loft-muted font-mono">{m.id}</span>
                            </div>
                          </Select.Option>
                        ))
                      ) : (
                        <Select.Option value={policy.primary_model}>
                          {policy.primary_model}
                        </Select.Option>
                      )}
                    </Select>
                  </div>

                  {/* Fallback Secondary Provider & Model */}
                  {policy.enable_fallback && (
                    <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#D9E2EC] space-y-3">
                      <div className="text-xs font-bold text-loft-dark flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ApiOutlined className="text-[#0066CC]" />
                          <span>Configuração do Failover (Provedor Secundário)</span>
                        </div>
                        {policy.fallback_provider === 'none' || !policy.fallback_provider ? (
                          <Tag color="orange">Failover Desativado (Erro Padrão)</Tag>
                        ) : policy.fallback_provider === policy.primary_provider ? (
                          <Tag color="blue">Mesmo Provedor (Failover de Modelo)</Tag>
                        ) : (
                          <Tag color="green">Provedor Alternativo</Tag>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] text-loft-muted font-medium block mb-1">Provedor Secundário de Failover</label>
                        <Select
                          size="middle"
                          value={policy.fallback_provider || 'none'}
                          onChange={(newFallbackProvId) => {
                            if (newFallbackProvId === 'none') {
                              setPolicy({
                                ...policy,
                                fallback_provider: 'none',
                                fallback_model: '',
                              });
                              return;
                            }
                            const selectedProv = providers.find((p) => p.id === newFallbackProvId);
                            let nextModel = selectedProv?.default_model || selectedProv?.available_models?.[0]?.id || '';
                            if (newFallbackProvId === policy.primary_provider && selectedProv?.available_models) {
                              const otherModel = selectedProv.available_models.find((m) => m.id !== policy.primary_model);
                              if (otherModel) {
                                nextModel = otherModel.id;
                              }
                            }
                            setPolicy({
                              ...policy,
                              fallback_provider: newFallbackProvId,
                              fallback_model: nextModel,
                            });
                          }}
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="none">
                            <div className="flex items-center gap-2 py-0.5">
                              <CloseCircleOutlined className="text-red-500" />
                              <span className="text-loft-muted font-medium">🚫 Sem Fallback (Mostrar erro padrão da API primária)</span>
                            </div>
                          </Select.Option>
                          {providers.map((p) => (
                            <Select.Option key={p.id} value={p.id}>
                              <div className="flex items-center justify-between py-0.5">
                                <span>{p.name} {p.id === policy.primary_provider ? '(Mesmo Provedor)' : `(${p.id})`}</span>
                                {p.id === policy.primary_provider && <Tag color="blue" className="text-[10px] mr-0">Failover Interno</Tag>}
                              </div>
                            </Select.Option>
                          ))}
                        </Select>
                      </div>

                      {policy.fallback_provider === 'none' || !policy.fallback_provider ? (
                        <div className="p-2.5 bg-[#FFFBE6] border border-[#FFE58F] rounded-sm text-xs text-[#D48806] flex items-center gap-2">
                          <span>⚠️ <strong>Sem Failover:</strong> Caso o modelo primário retorne erro ou indisponibilidade da API, o AI Gateway retornará a mensagem de erro padrão sem tentar outro modelo.</span>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[11px] text-loft-muted font-medium block mb-1">
                            Modelo de Fallback ({currentFallbackProvider?.name || policy.fallback_provider})
                          </label>
                          <Select
                            size="middle"
                            showSearch
                            value={policy.fallback_model}
                            onChange={(val) => setPolicy({ ...policy, fallback_model: val })}
                            style={{ width: '100%' }}
                            placeholder="Selecione o modelo de failover..."
                            optionFilterProp="children"
                          >
                            {currentFallbackProvider?.available_models && currentFallbackProvider.available_models.length > 0 ? (
                              currentFallbackProvider.available_models.map((m) => (
                                <Select.Option key={m.id} value={m.id}>
                                  <div className="flex items-center justify-between py-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-loft-dark">{m.name || m.id}</span>
                                      {m.id === policy.primary_model && (
                                        <Tag color="default" className="text-[10px]">Modelo Primário Atual</Tag>
                                      )}
                                      {m.recommended && <Tag color="orange" className="text-[10px]">Recomendado</Tag>}
                                    </div>
                                    <span className="text-[11px] text-loft-muted font-mono">{m.id}</span>
                                  </div>
                                </Select.Option>
                              ))
                            ) : (
                              <Select.Option value={policy.fallback_model}>
                                {policy.fallback_model || 'Não especificado'}
                              </Select.Option>
                            )}
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-loft-muted font-medium block mb-1">Rate Limit (req/min)</label>
                      <Input
                        type="number"
                        value={policy.rate_limit_per_minute}
                        onChange={(e) => setPolicy({ ...policy, rate_limit_per_minute: parseInt(e.target.value) || 120 })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-loft-muted font-medium block mb-1">Timeout (segundos)</label>
                      <Input
                        type="number"
                        value={policy.timeout_seconds}
                        onChange={(e) => setPolicy({ ...policy, timeout_seconds: parseInt(e.target.value) || 30 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={savingPolicy}
                    onClick={handleSavePolicy}
                    className="w-full"
                    style={{ background: '#121619', borderColor: '#121619' }}
                  >
                    Salvar Alterações de Política
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* Right: Live Gateway Prompt Playground */}
        <Col xs={24} lg={13}>
          <Card
            className="border-loft-border shadow-2xs h-full flex flex-col justify-between"
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DashboardOutlined className="text-[#0066CC]" />
                  <span className="font-bold text-sm">Playground & Teste de Inferência via Gateway</span>
                </div>
                <Tag color="orange" className="font-mono text-xs">
                  {policy?.primary_model || 'gemini-2.5-flash'}
                </Tag>
              </div>
            }
          >
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* System Prompt */}
                <div>
                  <label className="text-xs font-bold text-loft-dark block mb-1">
                    System Instruction
                  </label>
                  <Input
                    value={playgroundSysPrompt}
                    onChange={(e) => setPlaygroundSysPrompt(e.target.value)}
                    placeholder="Instrução do sistema..."
                    className="text-xs"
                  />
                </div>

                {/* User Prompt */}
                <div>
                  <label className="text-xs font-bold text-loft-dark block mb-1">
                    Prompt de Entrada
                  </label>
                  <Input.TextArea
                    rows={3}
                    value={playgroundPrompt}
                    onChange={(e) => setPlaygroundPrompt(e.target.value)}
                    placeholder="Escreva sua pergunta ou requisição técnica..."
                    className="text-xs"
                  />
                </div>

                {/* Temperature slider */}
                <div>
                  <div className="flex items-center justify-between text-xs text-loft-dark mb-1">
                    <span className="font-medium">Temperatura</span>
                    <span className="font-mono font-bold text-[#0066CC]">{playgroundTemp}</span>
                  </div>
                  <Slider
                    min={0.0}
                    max={1.0}
                    step={0.05}
                    value={playgroundTemp}
                    onChange={setPlaygroundTemp}
                  />
                </div>

                {/* Execute Button */}
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={executing}
                  onClick={handleExecutePrompt}
                  className="w-full"
                  style={{ background: '#FF774A', borderColor: '#FF774A' }}
                  size="large"
                >
                  Executar Prompt via AI Gateway
                </Button>
              </div>

              {/* Response Output Box */}
              {executionError && (
                <Alert
                  type="error"
                  showIcon
                  message="Erro na Execução do AI Gateway"
                  description={executionError}
                  className="mt-3"
                />
              )}

              {lastResponse && (
                <div className="mt-3 p-4 bg-[#F8FAFC] rounded-xl border border-loft-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag color="green" icon={<CheckCircleOutlined />}>Resposta Recebida</Tag>
                      {lastResponse.cached && (
                        <Tag color="blue" icon={<DatabaseOutlined />}>Cache Hit (0ms)</Tag>
                      )}
                      <span className="text-xs font-mono text-[#0066CC] font-bold">
                        {lastResponse.latency_ms} ms
                      </span>
                    </div>
                    <span className="text-[11px] text-loft-muted font-mono">
                      Modelo: {lastResponse.model} ({lastResponse.prompt_tokens + lastResponse.completion_tokens} tokens)
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-loft-border text-xs text-loft-dark font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {lastResponse.response}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Execution Audit Log Table */}
      <Card
        className="border-loft-border shadow-2xs"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ApiOutlined className="text-loft-success" />
              <span className="font-bold text-sm">Histórico de Execuções & Auditoria de Tráfego</span>
            </div>
            <Button size="small" icon={<ReloadOutlined />} onClick={loadData}>
              Atualizar Logs
            </Button>
          </div>
        }
      >
        <Table
          dataSource={logs}
          columns={logColumns}
          rowKey="id"
          size="small"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalLogs,
            onChange: onPaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal de Visualização Completa de Prompt e Resposta */}
      <Modal
        title={
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <EyeOutlined className="text-[#FF774A]" />
              <span className="font-bold text-base text-loft-dark">
                Inspeção Completa de Prompt & Resposta
              </span>
            </div>
            {selectedLogForModal && (
              <Tag color={selectedLogForModal.status === 'SUCCESS' ? 'green' : selectedLogForModal.status === 'CACHED' ? 'blue' : 'red'}>
                {selectedLogForModal.status}
              </Tag>
            )}
          </div>
        }
        open={isLogModalOpen}
        onCancel={() => {
          setIsLogModalOpen(false);
          setSelectedLogForModal(null);
        }}
        width={850}
        footer={[
          <Button
            key="copy-json"
            icon={<CopyOutlined />}
            onClick={() => {
              if (selectedLogForModal) {
                handleCopyText(JSON.stringify(selectedLogForModal, null, 2), 'Log em formato JSON');
              }
            }}
          >
            Copiar Log (JSON)
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setIsLogModalOpen(false);
              setSelectedLogForModal(null);
            }}
            style={{ background: '#FF774A', borderColor: '#FF774A' }}
          >
            Fechar
          </Button>,
        ]}
      >
        {selectedLogForModal && (
          <div className="space-y-4 py-2">
            {/* Metadata Badges */}
            <div className="p-3 bg-[#FAFBFD] rounded-lg border border-loft-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-loft-muted block text-[11px]">Provedor / Modelo:</span>
                <span className="font-semibold text-loft-dark font-mono">{selectedLogForModal.provider.toUpperCase()} / {selectedLogForModal.model}</span>
              </div>
              <div>
                <span className="text-loft-muted block text-[11px]">Latência / Tokens:</span>
                <span className="font-semibold text-[#0066CC] font-mono">{selectedLogForModal.latency_ms} ms • {selectedLogForModal.tokens_used} tokens</span>
              </div>
              <div>
                <span className="text-loft-muted block text-[11px]">Data e Hora (UTC):</span>
                <span className="font-mono text-loft-dark">{selectedLogForModal.timestamp}</span>
              </div>
              <div>
                <span className="text-loft-muted block text-[11px]">Ator / Solicitante:</span>
                <span className="font-medium text-loft-dark truncate block" title={selectedLogForModal.actor}>{selectedLogForModal.actor}</span>
              </div>
            </div>

            {/* System Prompt (if present) */}
            {selectedLogForModal.system_prompt && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-loft-muted uppercase tracking-wider flex items-center gap-1.5">
                    <SettingOutlined /> System Prompt (Instrução de Sistema)
                  </span>
                  <Button
                    size="small"
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyText(selectedLogForModal.system_prompt || '', 'System Prompt')}
                    className="text-xs text-[#0066CC]"
                  >
                    Copiar
                  </Button>
                </div>
                <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#D9E2EC] text-xs font-mono text-[#102A43] whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedLogForModal.system_prompt}
                </div>
              </div>
            )}

            {/* Prompt Enviado */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-loft-dark uppercase tracking-wider flex items-center gap-1.5">
                  <SendOutlined className="text-[#FF774A]" /> Prompt Enviado (Entrada Completa)
                </span>
                <Button
                  size="small"
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyText(selectedLogForModal.full_prompt || selectedLogForModal.prompt_preview, 'Prompt de Entrada')}
                  className="text-xs text-[#0066CC]"
                >
                  Copiar Prompt
                </Button>
              </div>
              <div className="p-3.5 bg-[#FAFBFD] rounded-lg border border-loft-border text-xs font-mono text-loft-dark whitespace-pre-wrap max-h-60 overflow-y-auto selection:bg-[#FF774A] selection:text-white">
                {selectedLogForModal.full_prompt || selectedLogForModal.prompt_preview}
              </div>
            </div>

            {/* Resposta Recebida */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-loft-dark uppercase tracking-wider flex items-center gap-1.5">
                  <ThunderboltOutlined className="text-loft-success" /> Resposta do Modelo (Saída Completa)
                </span>
                <Button
                  size="small"
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyText(selectedLogForModal.full_response || selectedLogForModal.response_preview, 'Resposta da IA')}
                  className="text-xs text-[#0066CC]"
                >
                  Copiar Resposta
                </Button>
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-[#CBD2D9] text-xs font-mono text-loft-dark whitespace-pre-wrap max-h-80 overflow-y-auto selection:bg-loft-success selection:text-white shadow-inner">
                {selectedLogForModal.full_response || selectedLogForModal.response_preview}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};
