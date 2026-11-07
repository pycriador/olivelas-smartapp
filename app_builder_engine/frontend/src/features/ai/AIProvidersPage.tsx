import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Input,
  Button,
  Tag,
  Space,
  Slider,
  Switch,
  Alert,
  message,
  Spin,
  Typography,
  Tooltip,
  Modal,
  Form,
  Popconfirm,
  Badge,
} from 'antd';
import {
  ThunderboltOutlined,
  KeyOutlined,
  SaveOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  SlidersOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloudServerOutlined,
  ApiOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { aiSettingsService } from '@/services/aiSettings.service';
import type {
  MultiProviderSettings,
  AiProviderConfigItem,
  AiTestConnectionResponse,
  AiCustomProviderCreateRequest,
  AiModelOption,
} from '@/types/ai.types';

const { Text } = Typography;

export const AIProvidersPage: React.FC = () => {
  const [settings, setSettings] = useState<MultiProviderSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [fetchingModelsMap, setFetchingModelsMap] = useState<Record<string, boolean>>({});
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, AiTestConnectionResponse | null>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  // Custom Provider Modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [editingCustomProvider, setEditingCustomProvider] = useState<AiProviderConfigItem | null>(null);
  const [customForm] = Form.useForm();
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  // Provider Settings Modal (Fine-tuning)
  const [isFineTuneModalOpen, setIsFineTuneModalOpen] = useState<boolean>(false);
  const [fineTuneProvider, setFineTuneProvider] = useState<AiProviderConfigItem | null>(null);
  const [fineTuneForm] = Form.useForm();

  // Load initial settings from SQLite
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiSettingsService.getAiSettings();
      setSettings(data);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar configurações de IA do banco SQLite');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Handle live model fetching directly from any provider API
  const handleFetchLiveModels = async (providerId: string, explicitKey?: string, explicitUrl?: string) => {
    const prov = settings?.providers.find((p) => p.id === providerId);
    const keyToUse = explicitKey !== undefined ? explicitKey : (prov?.api_key || '');
    const urlToUse = explicitUrl !== undefined ? explicitUrl : (prov?.base_url || '');

    if (providerId === 'gemini' && !keyToUse) {
      message.warning('Insira uma API Key do Google Gemini para carregar os modelos disponíveis.');
      return;
    }

    setFetchingModelsMap((prev) => ({ ...prev, [providerId]: true }));
    setLoadError(null);

    try {
      let models: AiModelOption[] = [];
      if (providerId === 'gemini') {
        models = await aiSettingsService.fetchGeminiLiveModels(keyToUse);
      } else {
        models = await aiSettingsService.fetchLiveModelsForProvider(providerId, keyToUse, urlToUse);
      }

      if (models && models.length > 0) {
        setSettings((prev) => {
          if (!prev) return prev;
          const currentModelValid = models.some((m) => m.id === prev.default_model);
          const newDefaultModel = (providerId === prev.default_provider && !currentModelValid) ? models[0].id : prev.default_model;

          return {
            ...prev,
            default_model: newDefaultModel,
            providers: prev.providers.map((p) => {
              if (p.id === providerId) {
                const isCurrentModelInNew = models.some((m) => m.id === p.default_model);
                return {
                  ...p,
                  available_models: models,
                  default_model: isCurrentModelInNew ? p.default_model : models[0].id,
                  status: 'configured',
                };
              }
              return p;
            }),
          };
        });
        message.success(`${models.length} modelos carregados com sucesso do provedor '${prov?.name || providerId}'!`);
      } else {
        message.info(`Nenhum modelo retornado. Utilizando catálogo canônico para ${prov?.name || providerId}.`);
      }
    } catch (err: any) {
      const errMsg = err.message || `Erro ao carregar modelos ao vivo do provedor ${providerId}`;
      setLoadError(errMsg);
      message.error(errMsg);
    } finally {
      setFetchingModelsMap((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  // Test provider connection
  const handleTestConnection = async (providerId: string) => {
    setTestingProvider(providerId);
    const prov = settings?.providers.find((p) => p.id === providerId);
    try {
      const res = await aiSettingsService.testConnection({
        provider_id: providerId,
        api_key: prov?.api_key || '',
        model: prov?.default_model || '',
        base_url: prov?.base_url || '',
      });
      setTestResult((prev) => ({ ...prev, [providerId]: res }));
      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (err: any) {
      const failRes: AiTestConnectionResponse = {
        success: false,
        provider_id: providerId,
        model: prov?.default_model || 'default',
        latency_ms: 0,
        message: err.message || `Falha no teste de conexão com o provedor ${providerId}`,
      };
      setTestResult((prev) => ({ ...prev, [providerId]: failRes }));
      message.error(failRes.message);
    } finally {
      setTestingProvider(null);
    }
  };

  // Save all settings to SQLite
  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await aiSettingsService.updateAiSettings({
        default_provider: settings.default_provider,
        default_model: settings.default_model,
        providers: settings.providers,
        fallback_provider: settings.fallback_provider,
        enable_stream: settings.enable_stream,
        log_prompts: settings.log_prompts,
      });
      setSettings(updated);
      message.success('Configurações de IA salvas com sucesso no banco de dados SQLite!');
    } catch (err: any) {
      message.error(err.message || 'Erro ao persistir configurações de IA');
    } finally {
      setSaving(false);
    }
  };

  // Update specific field in state
  const handleUpdateProviderField = (providerId: string, field: keyof AiProviderConfigItem, value: any) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        providers: prev.providers.map((p) => {
          if (p.id === providerId) {
            return { ...p, [field]: value };
          }
          return p;
        }),
      };
    });
  };

  // Open Custom Provider Modal
  const handleOpenCustomModal = (providerToEdit?: AiProviderConfigItem) => {
    if (providerToEdit) {
      setEditingCustomProvider(providerToEdit);
      setCustomTags(providerToEdit.available_models.map((m) => m.id));
      customForm.setFieldsValue({
        name: providerToEdit.name,
        provider_type: providerToEdit.provider_type || 'custom',
        base_url: providerToEdit.base_url,
        api_key: providerToEdit.api_key,
        default_model: providerToEdit.default_model,
        temperature: providerToEdit.temperature,
        max_output_tokens: providerToEdit.max_output_tokens,
        enabled: providerToEdit.enabled,
      });
    } else {
      setEditingCustomProvider(null);
      setCustomTags(['custom-model-v1']);
      customForm.resetFields();
      customForm.setFieldsValue({
        name: '',
        provider_type: 'custom',
        base_url: 'https://api.openai-compatible.com/v1',
        api_key: '',
        default_model: 'custom-model-v1',
        temperature: 0.2,
        max_output_tokens: 4096,
        enabled: true,
      });
    }
    setIsCustomModalOpen(true);
  };

  // Save Custom Provider
  const handleSaveCustomProvider = async () => {
    try {
      const values = await customForm.validateFields();
      const modelsList: AiModelOption[] = customTags.map((tag, idx) => ({
        id: tag,
        name: tag,
        provider: editingCustomProvider?.id || 'custom',
        description: `Modelo ${tag}`,
        context_window: 128000,
        recommended: idx === 0,
        is_multimodal: false,
      }));

      if (editingCustomProvider) {
        await aiSettingsService.updateProviderById(editingCustomProvider.id, {
          ...values,
          available_models: modelsList,
        });
        message.success(`Provedor '${values.name}' atualizado com sucesso!`);
      } else {
        const payload: AiCustomProviderCreateRequest = {
          name: values.name,
          base_url: values.base_url,
          api_key: values.api_key,
          provider_type: values.provider_type || 'custom',
          default_model: values.default_model || customTags[0] || 'custom-model-v1',
          available_models: modelsList,
          temperature: values.temperature || 0.2,
          max_output_tokens: values.max_output_tokens || 4096,
          enabled: values.enabled !== false,
        };
        await aiSettingsService.createCustomProvider(payload);
        message.success(`Provedor customizado '${values.name}' cadastrado com sucesso!`);
      }
      setIsCustomModalOpen(false);
      loadSettings();
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar provedor customizado');
    }
  };

  // Delete / Reset Provider
  const handleDeleteProvider = async (providerId: string, providerName: string, isCustom?: boolean) => {
    try {
      await aiSettingsService.deleteProviderById(providerId);
      message.success(isCustom ? `Provedor '${providerName}' excluído com sucesso!` : `Configurações de '${providerName}' redefinidas com sucesso!`);
      loadSettings();
    } catch (err: any) {
      message.error(err.message || 'Erro ao remover provedor');
    }
  };

  // Fine-tune modal
  const handleOpenFineTune = (prov: AiProviderConfigItem) => {
    setFineTuneProvider(prov);
    fineTuneForm.setFieldsValue({
      base_url: prov.base_url || '',
      temperature: prov.temperature ?? 0.2,
      max_output_tokens: prov.max_output_tokens ?? 4096,
      top_p: prov.top_p ?? 0.95,
      top_k: prov.top_k ?? 40,
      system_instruction: prov.system_instruction || '',
      organization_id: prov.organization_id || '',
      project_id: prov.project_id || '',
      anthropic_version: prov.anthropic_version || '2023-06-01',
      azure_deployment: prov.azure_deployment || '',
      api_version: prov.api_version || '',
    });
    setIsFineTuneModalOpen(true);
  };

  const handleSaveFineTune = async () => {
    if (!fineTuneProvider) return;
    try {
      const values = await fineTuneForm.validateFields();
      Object.keys(values).forEach((k) => {
        handleUpdateProviderField(fineTuneProvider.id, k as keyof AiProviderConfigItem, values[k]);
      });
      setIsFineTuneModalOpen(false);
      message.success(`Parâmetros avançados de '${fineTuneProvider.name}' atualizados! Clique em 'Salvar Configurações' para persistir.`);
    } catch (err: any) {
      message.error('Verifique os campos preenchidos');
    }
  };

  // Tag helper for custom models
  const handleAddCustomTag = () => {
    if (customTagInput && !customTags.includes(customTagInput.trim())) {
      setCustomTags([...customTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleRemoveCustomTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter((t) => t !== tagToRemove));
  };

  if (loading && !settings) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Spin size="large" />
          <Text className="mt-4 text-loft-muted">Carregando configurações de IA do banco SQLite...</Text>
        </div>
      </PageContainer>
    );
  }

  const geminiProvider = settings?.providers.find((p) => p.id === 'gemini');
  const openAiProvider = settings?.providers.find((p) => p.id === 'openai');
  const grokProvider = settings?.providers.find((p) => p.id === 'grok');
  const copilotProvider = settings?.providers.find((p) => p.id === 'copilot');
  const anthropicProvider = settings?.providers.find((p) => p.id === 'anthropic');
  const ollamaProvider = settings?.providers.find((p) => p.id === 'ollama');
  const customProviders = settings?.providers.filter((p) => p.is_custom) || [];

  const otherBuiltInProviders = [
    { key: 'openai', prov: openAiProvider, tagColor: 'green', tagText: 'OpenAI Flagship', icon: '🤖', defaultBase: 'https://api.openai.com/v1' },
    { key: 'grok', prov: grokProvider, tagColor: 'purple', tagText: 'xAI Grok', icon: '⚡', defaultBase: 'https://api.x.ai/v1' },
    { key: 'copilot', prov: copilotProvider, tagColor: 'blue', tagText: 'Azure AI & Copilot', icon: '🔷', defaultBase: 'https://api.openai.azure.com/v1' },
    { key: 'anthropic', prov: anthropicProvider, tagColor: 'gold', tagText: 'Claude Reasoning', icon: '🧠', defaultBase: 'https://api.anthropic.com/v1' },
    { key: 'ollama', prov: ollamaProvider, tagColor: 'cyan', tagText: 'Self-Hosted Local', icon: '💻', defaultBase: 'http://localhost:11434' },
  ].filter((item) => item.prov !== undefined);

  return (
    <PageContainer>
      <PageHeader
        title="Provedores de IA & Modelos"
        subtitle="Configure chaves de API com validação ao vivo, carregue catálogos de modelos reais diretamente dos provedores e conecte gateways customizados."
        breadcrumbs={[
          { title: 'Visão Geral', href: '/' },
          { title: 'Inteligência Artificial', href: '/ai/gateway' },
          { title: 'Provedores', href: '/ai/providers' },
        ]}
        actions={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadSettings}
              loading={loading}
            >
              Recarregar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenCustomModal()}
              style={{ background: '#121619', borderColor: '#121619' }}
            >
              + Adicionar Provedor Próprio
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSaveSettings}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
            >
              Salvar Configurações
            </Button>
          </Space>
        }
      />

      <div className="space-y-6">
        {/* Security Alert Banner */}
        <Alert
          message={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#0B6B4F]">
                🔒 Chaves de API Protegidas e Criptografadas no SQLite
              </span>
              <Tag color="green">Audit Logging Ativo</Tag>
            </div>
          }
          description="Todas as chaves secretas são persistidas de forma segura no banco de dados SQLite e mascaradas no frontend. A inferência e a busca de modelos são executadas via backend com validação real das APIs."
          type="success"
          showIcon
          icon={<SafetyCertificateOutlined className="text-[#0B6B4F]" />}
          className="border-[#0B6B4F]/20 bg-[#0B6B4F]/5"
        />

        {loadError && (
          <Alert
            message="Aviso da API do Provedor"
            description={loadError}
            type="warning"
            closable
            onClose={() => setLoadError(null)}
            showIcon
          />
        )}

        {/* Primary Recommended Provider: Google Gemini */}
        {geminiProvider && (
          <Card
            className="border-[#FF774A] shadow-xs relative overflow-hidden"
            style={{ borderWidth: 2 }}
            title={
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF774A]/10 flex items-center justify-center text-[#FF774A] font-bold">
                    G
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-loft-dark">{geminiProvider.name}</span>
                      <Tag color="#FF774A" className="font-semibold text-[10px]">
                        ★ PROVEDOR PRIMÁRIO PADRÃO
                      </Tag>
                      {geminiProvider.status === 'configured' && (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Chave Configurada ({geminiProvider.available_models.length} modelos)
                        </Tag>
                      )}
                    </div>
                    <Text className="text-xs text-loft-muted">
                      Recomendado para arquitetura de software, scaffolding, refatoração de código e FSD
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="small"
                    icon={<SlidersOutlined />}
                    onClick={() => handleOpenFineTune(geminiProvider)}
                  >
                    Ajustes Avançados
                  </Button>
                  <Switch
                    checked={geminiProvider.enabled}
                    onChange={(checked) => handleUpdateProviderField('gemini', 'enabled', checked)}
                  />
                </div>
              </div>
            }
          >
            <Row gutter={[24, 24]}>
              {/* Left Column: API Key and Model Fetching */}
              <Col xs={24} lg={12}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-loft-dark block mb-1">
                      Google Gemini API Key (Segredo)
                    </label>
                    <Input.Password
                      prefix={<KeyOutlined className="text-loft-muted" />}
                      placeholder="Insira sua chave (ex: AIzaSy...)"
                      value={geminiProvider.api_key}
                      onChange={(e) => handleUpdateProviderField('gemini', 'api_key', e.target.value)}
                      className="font-mono text-sm"
                      size="large"
                    />
                    <div className="flex items-center justify-between mt-1 text-[11px] text-loft-muted">
                      <span>Obtenha sua chave no Google AI Studio</span>
                      <Button
                        type="link"
                        size="small"
                        icon={<ReloadOutlined spin={fetchingModelsMap['gemini']} />}
                        onClick={() => handleFetchLiveModels('gemini', geminiProvider.api_key)}
                        loading={fetchingModelsMap['gemini']}
                        className="p-0 text-xs text-[#0066CC]"
                      >
                        Validar API & Carregar Modelos
                      </Button>
                    </div>
                  </div>

                  {/* Model Selection Dropdown */}
                  <div>
                    <label className="text-xs font-semibold text-loft-dark block mb-1">
                      Modelo do Google Gemini Selecionado
                    </label>
                    <Select
                      size="large"
                      showSearch
                      value={geminiProvider.default_model}
                      onChange={(val) => {
                        handleUpdateProviderField('gemini', 'default_model', val);
                        if (settings?.default_provider === 'gemini') {
                          setSettings((prev) => prev ? { ...prev, default_model: val } : prev);
                        }
                      }}
                      style={{ width: '100%' }}
                      loading={fetchingModelsMap['gemini']}
                      optionLabelProp="label"
                    >
                      {geminiProvider.available_models.map((m) => (
                        <Select.Option
                          key={m.id}
                          value={m.id}
                          label={
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{m.name}</span>
                              {m.recommended && <Tag color="#FF774A" className="text-[10px]">Recomendado</Tag>}
                            </div>
                          }
                        >
                          <div className="py-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-loft-dark">{m.name}</span>
                              <div className="flex gap-1">
                                {m.recommended && <Tag color="#FF774A">Padrão Olivelas</Tag>}
                                <Tag color="blue">{m.context_window >= 1000000 ? `${m.context_window / 1000000}M tokens` : `${m.context_window / 1000}k tokens`}</Tag>
                              </div>
                            </div>
                            {m.description && (
                              <div className="text-xs text-loft-muted mt-0.5 whitespace-normal">
                                {m.description}
                              </div>
                            )}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Col>

              {/* Right Column: Hyperparameters & Diagnostic Test */}
              <Col xs={24} lg={12}>
                <div className="bg-[#F0F4F8] p-4 rounded-lg space-y-4 border border-loft-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-loft-dark">Hiperparâmetros de Inferência</span>
                    <Button
                      size="small"
                      type="link"
                      onClick={() => handleOpenFineTune(geminiProvider)}
                      className="text-xs text-[#0066CC] p-0"
                    >
                      Editar Instrução de Sistema
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-loft-dark mb-1">
                        <span className="font-medium">Temperatura (Criatividade)</span>
                        <span className="font-mono font-bold text-[#FF774A]">{geminiProvider.temperature}</span>
                      </div>
                      <Slider
                        min={0.0}
                        max={1.0}
                        step={0.05}
                        value={geminiProvider.temperature}
                        onChange={(v) => handleUpdateProviderField('gemini', 'temperature', v)}
                      />
                      <div className="flex justify-between text-[10px] text-loft-muted">
                        <span>0.0 (Rigoroso / Determinístico)</span>
                        <span>1.0 (Criativo)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-loft-dark mb-1">
                        <span className="font-medium">Max Output Tokens (Limite por Resposta)</span>
                        <span className="font-mono font-bold text-[#FF774A]">{geminiProvider.max_output_tokens} tokens</span>
                      </div>
                      <Slider
                        min={512}
                        max={8192}
                        step={256}
                        value={geminiProvider.max_output_tokens}
                        onChange={(v) => handleUpdateProviderField('gemini', 'max_output_tokens', v)}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-loft-border">
                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      loading={testingProvider === 'gemini'}
                      onClick={() => handleTestConnection('gemini')}
                      className="w-full"
                      style={{ background: '#121619', borderColor: '#121619' }}
                      size="large"
                    >
                      Testar Conexão com Google Gemini
                    </Button>

                    {testResult['gemini'] && (
                      <div className="mt-3">
                        <Alert
                          type={testResult['gemini'].success ? 'success' : 'error'}
                          showIcon
                          message={testResult['gemini'].message}
                          description={
                            testResult['gemini'].raw_response ? (
                              <div className="mt-1 text-xs font-mono bg-white p-2 rounded-sm border border-loft-border">
                                Resposta recebida: "{testResult['gemini'].raw_response}"
                              </div>
                            ) : null
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Section: Other Supported AI Providers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GlobalOutlined className="text-[#0066CC] text-lg" />
              <span className="text-base font-bold text-loft-dark">
                Outros Provedores de IA Suportados
              </span>
              <Badge count={otherBuiltInProviders.length + customProviders.length} style={{ backgroundColor: '#121619' }} />
            </div>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => handleOpenCustomModal()}
              className="font-medium text-xs text-[#0066CC] border-[#0066CC]"
            >
              + Adicionar Provedor Próprio / Custom
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            {/* Built-in Providers Cards */}
            {otherBuiltInProviders.map(({ key, prov, tagColor, tagText, icon, defaultBase }) => {
              if (!prov) return null;
              return (
                <Col xs={24} sm={12} lg={8} key={key}>
                  <Card
                    size="small"
                    className="border-loft-border h-full flex flex-col justify-between hover:shadow-md transition-shadow"
                    title={
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{icon}</span>
                          <span className="font-bold text-sm text-loft-dark">{prov.name}</span>
                        </div>
                        <Switch
                          size="small"
                          checked={prov.enabled}
                          onChange={(v) => handleUpdateProviderField(key, 'enabled', v)}
                        />
                      </div>
                    }
                    extra={
                      <Tooltip title="Configurações avançadas do provedor">
                        <Button
                          type="text"
                          size="small"
                          icon={<SettingOutlined />}
                          onClick={() => handleOpenFineTune(prov)}
                        />
                      </Tooltip>
                    }
                  >
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Tag color={tagColor} className="text-[10px] m-0">{tagText}</Tag>
                          <span className="text-[11px] font-mono text-loft-muted">
                            {prov.status === 'configured' ? `✓ Configurada (${prov.available_models.length} modelos)` : 'Não configurada'}
                          </span>
                        </div>

                        {/* Base URL (editable endpoint) */}
                        <div>
                          <label className="text-[11px] text-loft-muted font-medium block mb-0.5">Endpoint Base da API</label>
                          <Input
                            size="small"
                            placeholder={defaultBase}
                            value={prov.base_url || defaultBase}
                            onChange={(e) => handleUpdateProviderField(key, 'base_url', e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>

                        {/* Model Selection with live fetch trigger */}
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[11px] text-loft-muted font-medium">Modelo Selecionado</label>
                            <Button
                              type="link"
                              size="small"
                              className="p-0 text-[10px] text-[#0066CC]"
                              onClick={() => handleFetchLiveModels(key, prov.api_key, prov.base_url)}
                              loading={fetchingModelsMap[key]}
                              icon={<ReloadOutlined spin={fetchingModelsMap[key]} className="text-[10px]" />}
                            >
                              Buscar Modelos da API
                            </Button>
                          </div>
                          <Select
                            size="small"
                            showSearch
                            value={prov.default_model}
                            onChange={(val) => {
                              handleUpdateProviderField(key, 'default_model', val);
                              if (settings?.default_provider === key) {
                                setSettings((prev) => prev ? { ...prev, default_model: val } : prev);
                              }
                            }}
                            style={{ width: '100%' }}
                            loading={fetchingModelsMap[key]}
                          >
                            {prov.available_models.map((m) => (
                              <Select.Option key={m.id} value={m.id}>
                                <div className="flex items-center justify-between">
                                  <span>{m.name}</span>
                                  {m.recommended && <Tag color="#FF774A" className="text-[9px] scale-90 m-0">Top</Tag>}
                                </div>
                              </Select.Option>
                            ))}
                          </Select>
                        </div>

                        {/* API Key */}
                        {key !== 'ollama' && (
                          <div>
                            <label className="text-[11px] text-loft-muted font-medium block mb-0.5">API Key / Token de Acesso</label>
                            <Input.Password
                              size="small"
                              placeholder={key === 'openai' ? 'sk-...' : key === 'grok' ? 'xai-...' : key === 'anthropic' ? 'sk-ant-...' : 'token...'}
                              value={prov.api_key}
                              onChange={(e) => handleUpdateProviderField(key, 'api_key', e.target.value)}
                              className="font-mono text-xs"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-loft-border">
                        <Button
                          size="small"
                          onClick={() => handleTestConnection(key)}
                          loading={testingProvider === key}
                          className="w-full text-xs font-semibold"
                          icon={<ThunderboltOutlined />}
                        >
                          Testar Conexão em Tempo Real
                        </Button>

                        {testResult[key] && (
                          <div className="mt-2">
                            <Alert
                              type={testResult[key]?.success ? 'success' : 'error'}
                              showIcon
                              message={<span className="text-[11px]">{testResult[key]?.message}</span>}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}

            {/* Custom Gateways / User-Created Providers */}
            {customProviders.map((cst) => (
              <Col xs={24} sm={12} lg={8} key={cst.id}>
                <Card
                  size="small"
                  className="border-[#0066CC] border-dashed h-full flex flex-col justify-between hover:shadow-md transition-shadow bg-[#F0F4F8]/40"
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CloudServerOutlined className="text-[#0066CC]" />
                        <span className="font-bold text-sm text-loft-dark">{cst.name}</span>
                      </div>
                      <Switch
                        size="small"
                        checked={cst.enabled}
                        onChange={(v) => handleUpdateProviderField(cst.id, 'enabled', v)}
                      />
                    </div>
                  }
                  extra={
                    <Space size={2}>
                      <Tooltip title="Editar Provedor">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleOpenCustomModal(cst)}
                        />
                      </Tooltip>
                      <Popconfirm
                        title={`Excluir o provedor '${cst.name}'?`}
                        okText="Excluir"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDeleteProvider(cst.id, cst.name, true)}
                      >
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Tag color="geekblue" className="text-[10px] m-0">Compatível com OpenAI</Tag>
                        <Tag color="cyan" className="text-[10px] m-0">Próprio / Custom ({cst.available_models.length} modelos)</Tag>
                      </div>

                      <div>
                        <label className="text-[11px] text-loft-muted font-medium block mb-0.5">Endpoint Base</label>
                        <Input
                          size="small"
                          value={cst.base_url}
                          onChange={(e) => handleUpdateProviderField(cst.id, 'base_url', e.target.value)}
                          className="font-mono text-xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="text-[11px] text-loft-muted font-medium">Modelo Ativo</label>
                          <Button
                            type="link"
                            size="small"
                            className="p-0 text-[10px] text-[#0066CC]"
                            onClick={() => handleFetchLiveModels(cst.id, cst.api_key, cst.base_url)}
                            loading={fetchingModelsMap[cst.id]}
                            icon={<ReloadOutlined spin={fetchingModelsMap[cst.id]} className="text-[10px]" />}
                          >
                            Buscar Modelos
                          </Button>
                        </div>
                        <Select
                          size="small"
                          showSearch
                          value={cst.default_model}
                          onChange={(val) => {
                            handleUpdateProviderField(cst.id, 'default_model', val);
                            if (settings?.default_provider === cst.id) {
                              setSettings((prev) => prev ? { ...prev, default_model: val } : prev);
                            }
                          }}
                          style={{ width: '100%' }}
                        >
                          {cst.available_models.map((m) => (
                            <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="text-[11px] text-loft-muted font-medium block mb-0.5">API Key / Header Secret</label>
                        <Input.Password
                          size="small"
                          placeholder="Chave customizada..."
                          value={cst.api_key}
                          onChange={(e) => handleUpdateProviderField(cst.id, 'api_key', e.target.value)}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-loft-border">
                      <Button
                        size="small"
                        onClick={() => handleTestConnection(cst.id)}
                        loading={testingProvider === cst.id}
                        className="w-full text-xs font-semibold"
                        icon={<ThunderboltOutlined />}
                      >
                        Testar Gateway Próprio
                      </Button>

                      {testResult[cst.id] && (
                        <div className="mt-2">
                          <Alert
                            type={testResult[cst.id]?.success ? 'success' : 'error'}
                            showIcon
                            message={<span className="text-[11px]">{testResult[cst.id]?.message}</span>}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Global Save Action Footer */}
        <div className="flex justify-end pt-4 border-t border-loft-border">
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSaveSettings}
            style={{ background: '#FF774A', borderColor: '#FF774A', minWidth: 260 }}
          >
            Salvar Todas as Configurações de IA
          </Button>
        </div>
      </div>

      {/* Modal: Create or Edit Custom Provider */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ApiOutlined className="text-[#FF774A]" />
            <span>{editingCustomProvider ? `Editar Provedor: ${editingCustomProvider.name}` : 'Novo Provedor de IA Compatível com GPT'}</span>
          </div>
        }
        open={isCustomModalOpen}
        onCancel={() => setIsCustomModalOpen(false)}
        onOk={handleSaveCustomProvider}
        okText={editingCustomProvider ? 'Salvar Alterações' : 'Cadastrar Provedor'}
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#FF774A', borderColor: '#FF774A' } }}
        width={600}
      >
        <Form form={customForm} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Nome do Provedor"
            rules={[{ required: true, message: 'Informe um nome descritivo (ex: DeepSeek API, LiteLLM Olivelas)' }]}
          >
            <Input placeholder="Ex: Olivelas Internal Gateway / DeepSeek R1" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="base_url"
                label="URL Base da API (Endpoint OpenAI Compatible)"
                rules={[{ required: true, message: 'Informe a URL base do endpoint' }]}
              >
                <Input placeholder="https://api.deepseek.com/v1 ou http://vllm:8000/v1" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="default_model"
                label="Modelo Padrão"
                rules={[{ required: true, message: 'Informe o ID do modelo' }]}
              >
                <Input placeholder="ex: deepseek-chat" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="api_key"
            label="API Key / Token de Autenticação (Opcional para instâncias locais)"
          >
            <Input.Password placeholder="sk-..." />
          </Form.Item>

          <div>
            <label className="text-xs font-semibold text-loft-dark block mb-1">
              Catálogo de Modelos Adicionais (Pressione Enter para adicionar)
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                size="small"
                placeholder="Nome do modelo (ex: mistral-large)"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleAddCustomTag();
                }}
              />
              <Button size="small" onClick={handleAddCustomTag}>+ Adicionar</Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {customTags.map((tag) => (
                <Tag key={tag} closable onClose={() => handleRemoveCustomTag(tag)} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Form.Item name="temperature" label="Temperatura Inicial" initialValue={0.2}>
                <Slider min={0.0} max={1.0} step={0.05} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="max_output_tokens" label="Max Output Tokens" initialValue={4096}>
                <Slider min={512} max={8192} step={256} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal: Fine-tune Hyperparameters & Provider Parameters */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SlidersOutlined className="text-[#0066CC]" />
            <span>Configurações e Ajustes Finos: {fineTuneProvider?.name}</span>
          </div>
        }
        open={isFineTuneModalOpen}
        onCancel={() => setIsFineTuneModalOpen(false)}
        onOk={handleSaveFineTune}
        okText="Aplicar Ajustes"
        cancelText="Cancelar"
        width={620}
      >
        <Form form={fineTuneForm} layout="vertical" className="mt-4">
          <Form.Item name="base_url" label="Endpoint Base da API (URL)">
            <Input placeholder="https://api.openai.com/v1" className="font-mono text-xs" />
          </Form.Item>

          {/* Provider-specific fields */}
          {fineTuneProvider?.id === 'openai' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="organization_id" label="OpenAI Organization ID (Opcional)">
                  <Input placeholder="org-..." className="font-mono text-xs" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="project_id" label="OpenAI Project ID (Opcional)">
                  <Input placeholder="proj_..." className="font-mono text-xs" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {fineTuneProvider?.id === 'anthropic' && (
            <Form.Item name="anthropic_version" label="Anthropic API Version Header">
              <Input placeholder="2023-06-01" className="font-mono text-xs" />
            </Form.Item>
          )}

          {fineTuneProvider?.id === 'copilot' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="azure_deployment" label="Azure Deployment Name">
                  <Input placeholder="gpt-4o-deployment" className="font-mono text-xs" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="api_version" label="Azure API Version">
                  <Input placeholder="2024-02-15-preview" className="font-mono text-xs" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="temperature" label="Temperatura (Criatividade vs Precisão)">
                <Slider min={0.0} max={1.5} step={0.05} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="max_output_tokens" label="Limite Máximo de Tokens por Resposta">
                <Slider min={512} max={32768} step={512} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="top_p" label="Top-P (Nucleus Sampling)">
                <Slider min={0.1} max={1.0} step={0.05} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="top_k" label="Top-K">
                <Slider min={1} max={100} step={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="system_instruction" label="Instrução do Sistema (System Prompt Canônico)">
            <Input.TextArea rows={3} placeholder="Instruções comportamentais enviadas em todas as chamadas para este provedor..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AIProvidersPage;
