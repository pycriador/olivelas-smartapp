import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Tabs,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Typography,
  Card,
  message,
  Modal,
  Form,
} from 'antd';
import {
  SendOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  ApiOutlined,
  CopyOutlined,
  FileAddOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import type {
  ApiClientSource,
  ApiSavedRequest,
  ApiExecutionResponse,
  KnowledgeCategory,
} from '@/types/knowledge.types';
import { knowledgeService } from '@/services/knowledge.service';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ApiClientDrawerProps {
  visible: boolean;
  onClose: () => void;
  onImportToDocs?: (title: string, category: KnowledgeCategory, content: string, sourceUrl?: string) => void;
}

interface ParamRow {
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

const METHOD_COLORS: Record<string, string> = {
  GET: '#0066CC',
  POST: '#059669',
  PUT: '#D97706',
  DELETE: '#DC2626',
  PATCH: '#7C3AED',
};

export const ApiClientDrawer: React.FC<ApiClientDrawerProps> = ({
  visible,
  onClose,
  onImportToDocs,
}) => {
  const [sources, setSources] = useState<ApiClientSource[]>([]);
  const [savedRequests, setSavedRequests] = useState<ApiSavedRequest[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('src_confluence_cloud');

  // Request State
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('https://olivelas.atlassian.net/wiki/rest/api/content');
  const [activeReqTab, setActiveReqTab] = useState<string>('params');
  const [params, setParams] = useState<ParamRow[]>([
    { key: 'spaceKey', value: 'TECH', enabled: true, description: 'Chave do Espaço' },
    { key: 'limit', value: '10', enabled: true, description: 'Número de itens' },
  ]);
  const [headers, setHeaders] = useState<ParamRow[]>([
    { key: 'Accept', value: 'application/json', enabled: true, description: 'JSON response' },
  ]);
  const [authType, setAuthType] = useState<string>('bearer');
  const [authToken, setAuthToken] = useState<string>('');
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [bodyType, setBodyType] = useState<string>('none');
  const [bodyContent, setBodyContent] = useState<string>('');

  // Execution & Response State
  const [executing, setExecuting] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiExecutionResponse | null>(null);

  // Modals
  const [saveModalVisible, setSaveModalVisible] = useState<boolean>(false);
  const [requestNameInput, setRequestNameInput] = useState<string>('');
  const [requestFolderInput, setRequestFolderInput] = useState<string>('Confluence Cloud');
  const [newSourceModalVisible, setNewSourceModalVisible] = useState<boolean>(false);
  const [sourceForm] = Form.useForm();

  useEffect(() => {
    if (visible) {
      loadSourcesAndRequests();
    }
  }, [visible]);

  const loadSourcesAndRequests = async () => {
    try {
      const [srcs, reqs] = await Promise.all([
        knowledgeService.listSources(),
        knowledgeService.listSavedRequests(),
      ]);
      setSources(srcs);
      setSavedRequests(reqs);
    } catch (err: any) {
      message.error('Falha ao carregar fontes de API e coleções salvas.');
    }
  };

  const handleSelectSavedRequest = (req: ApiSavedRequest) => {
    setMethod(req.method);
    setUrl(req.url);
    setParams(req.params.length > 0 ? req.params : [{ key: '', value: '', enabled: true }]);
    setHeaders(req.headers.length > 0 ? req.headers : [{ key: '', value: '', enabled: true }]);
    setAuthType(req.auth_type);
    if (req.auth_config?.token) setAuthToken(req.auth_config.token);
    setBodyType(req.body_type);
    setBodyContent(req.body_content || '');
    if (req.source_id) setSelectedSourceId(req.source_id);
    message.info(`Requisição '${req.name}' carregada no editor.`);
  };

  const handleExecute = async () => {
    try {
      setExecuting(true);
      const activeParams: Record<string, string> = {};
      params.forEach((p) => {
        if (p.enabled && p.key.trim()) {
          activeParams[p.key.trim()] = p.value;
        }
      });

      const activeHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.enabled && h.key.trim()) {
          activeHeaders[h.key.trim()] = h.value;
        }
      });

      const res = await knowledgeService.executeRequest({
        method,
        url,
        params: activeParams,
        headers: activeHeaders,
        auth_type: authType,
        auth_token: authToken,
        auth_username: authUsername,
        auth_password: authPassword,
        body_type: bodyType,
        body: bodyContent,
      });

      setResponse(res);
      if (res.status_code >= 200 && res.status_code < 300) {
        message.success(`Status ${res.status_code} em ${res.latency_ms}ms`);
      } else {
        message.warning(`Status ${res.status_code}: ${res.status_text}`);
      }
    } catch (err: any) {
      message.error(err.message || 'Erro ao executar chamada de API.');
    } finally {
      setExecuting(false);
    }
  };

  const handleSaveRequest = async () => {
    if (!requestNameInput.trim()) {
      message.warning('Informe o nome da requisição.');
      return;
    }
    try {
      const newReq: ApiSavedRequest = {
        id: `req_${Date.now()}`,
        source_id: selectedSourceId,
        name: requestNameInput.trim(),
        method: method as any,
        url,
        params,
        headers,
        auth_type: authType as any,
        auth_config: authToken ? { token: authToken } : {},
        body_type: bodyType as any,
        body_content: bodyContent,
        folder: requestFolderInput.trim() || 'Geral',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await knowledgeService.saveRequest(newReq);
      message.success(`Requisição '${newReq.name}' salva na coleção!`);
      setSaveModalVisible(false);
      setRequestNameInput('');
      loadSourcesAndRequests();
    } catch (err: any) {
      message.error('Falha ao salvar requisição.');
    }
  };

  const handleCreateSource = async (values: any) => {
    try {
      const newSrc: ApiClientSource = {
        id: `src_${Date.now()}`,
        name: values.name,
        base_url: values.base_url,
        auth_type: values.auth_type || 'none',
        auth_config: values.token ? { token: values.token } : {},
        default_headers: { 'Content-Type': 'application/json' },
        description: values.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await knowledgeService.saveSource(newSrc);
      message.success(`Fonte '${newSrc.name}' cadastrada com sucesso!`);
      setNewSourceModalVisible(false);
      sourceForm.resetFields();
      loadSourcesAndRequests();
      setSelectedSourceId(newSrc.id);
    } catch (err: any) {
      message.error('Falha ao cadastrar fonte de API.');
    }
  };

  const handleImportResponseToDocs = () => {
    if (!response || !response.body) {
      message.warning('Execute a requisição primeiro para obter uma resposta.');
      return;
    }

    const title = `API Spec & Response — ${method} ${url.split('?')[0]}`;
    let formattedContent = '';

    if (response.is_json) {
      try {
        const pretty = JSON.stringify(JSON.parse(response.body), null, 2);
        formattedContent = `\`\`\`json\n${pretty}\n\`\`\``;
      } catch {
        formattedContent = `\`\`\`json\n${response.body}\n\`\`\``;
      }
    } else {
      formattedContent = response.body;
    }

    const fullDocContent = `# ${title}

> **Endpoint**: \`${method} ${url}\`
> **Status**: \`${response.status_code} ${response.status_text}\`
> **Latência**: \`${response.latency_ms}ms\`
> **Tamanho**: \`${(response.response_size_bytes / 1024).toFixed(2)} KB\`
> **Data de Captura**: \`${new Date().toLocaleString('pt-BR')}\`

---

## 1. Parâmetros & Cabeçalhos da Requisição
- **Método**: \`${method}\`
- **Autenticação**: \`${authType}\`

---

## 2. Resposta da API

${formattedContent}
`;

    if (onImportToDocs) {
      onImportToDocs(title, 'api_integrations', fullDocContent, url);
    }
    message.success('Documento importado com sucesso para a base de conhecimento!');
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <ApiOutlined style={{ color: '#0066CC', fontSize: 18 }} />
            <span style={{ fontWeight: 600 }}>HTTP Client & Fontes de Integração</span>
          </Space>
          <Space>
            <Button
              size="small"
              icon={<SaveOutlined />}
              onClick={() => setSaveModalVisible(true)}
            >
              Salvar Requisição
            </Button>
            <Button
              size="small"
              type="primary"
              icon={<FileAddOutlined />}
              onClick={handleImportResponseToDocs}
              disabled={!response}
              style={{ backgroundColor: '#FF774A' }}
            >
              Importar como Documento
            </Button>
          </Space>
        </div>
      }
      open={visible}
      onClose={onClose}
      width={920}
      styles={{ body: { padding: '16px 20px', background: '#F8FAFC' } }}
    >
      {/* Sources & Saved Request Bar */}
      <div
        style={{
          background: '#fff',
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>
            Fonte de Integração Configurada
          </Text>
          <Select
            value={selectedSourceId}
            onChange={(val) => {
              setSelectedSourceId(val);
              const src = sources.find((s) => s.id === val);
              if (src) {
                setUrl(src.base_url);
                setAuthType(src.auth_type);
              }
            }}
            style={{ width: '100%' }}
          >
            {sources.map((src) => (
              <Option key={src.id} value={src.id}>
                {src.name} — <span style={{ color: '#64748B' }}>{src.base_url}</span>
              </Option>
            ))}
          </Select>
        </div>

        <Button
          icon={<PlusOutlined />}
          onClick={() => setNewSourceModalVisible(true)}
          style={{ marginTop: 14 }}
        >
          Nova Fonte
        </Button>
      </div>

      {/* Quick Collections Bar (Wrapped layout without horizontal scroll) */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6 }}>
          <FolderOpenOutlined style={{ marginRight: 6 }} /> Coleções Salvas & Exemplos Canônicos:
        </Text>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {savedRequests.map((req) => (
            <Button
              key={req.id}
              size="small"
              onClick={() => handleSelectSavedRequest(req)}
              style={{
                borderRadius: 6,
                borderColor: '#CBD5E1',
                background: '#fff',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4,
              }}
            >
              <Tag
                color={METHOD_COLORS[req.method] || 'blue'}
                style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 4px', fontWeight: 600 }}
              >
                {req.method}
              </Tag>
              <span>{req.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Request Bar */}
      <Card
        size="small"
        style={{
          borderRadius: 8,
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
          <Select
            value={method}
            onChange={setMethod}
            style={{ width: 110, fontWeight: 600, color: METHOD_COLORS[method] }}
          >
            <Option value="GET"><span style={{ color: METHOD_COLORS.GET }}>GET</span></Option>
            <Option value="POST"><span style={{ color: METHOD_COLORS.POST }}>POST</span></Option>
            <Option value="PUT"><span style={{ color: METHOD_COLORS.PUT }}>PUT</span></Option>
            <Option value="DELETE"><span style={{ color: METHOD_COLORS.DELETE }}>DELETE</span></Option>
            <Option value="PATCH"><span style={{ color: METHOD_COLORS.PATCH }}>PATCH</span></Option>
          </Select>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.olivelas.com.br/v1/resource"
            style={{ fontSize: 13, fontFamily: 'monospace' }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={executing}
            onClick={handleExecute}
            style={{ backgroundColor: '#0066CC', padding: '0 24px', fontWeight: 600 }}
          >
            Enviar
          </Button>
        </Space.Compact>

        {/* Request Tabs */}
        <Tabs
          activeKey={activeReqTab}
          onChange={setActiveReqTab}
          size="small"
          items={[
            {
              key: 'params',
              label: `Params (${params.filter((p) => p.enabled && p.key).length})`,
              children: (
                <div>
                  <Table
                    size="small"
                    pagination={false}
                    dataSource={params.map((p, idx) => ({ ...p, keyIndex: idx }))}
                    rowKey="keyIndex"
                    columns={[
                      {
                        title: '',
                        dataIndex: 'enabled',
                        width: 40,
                        render: (checked, _, idx) => (
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = [...params];
                              next[idx].enabled = e.target.checked;
                              setParams(next);
                            }}
                          />
                        ),
                      },
                      {
                        title: 'Key',
                        dataIndex: 'key',
                        render: (val, _, idx) => (
                          <Input
                            size="small"
                            value={val}
                            placeholder="Chave do parâmetro"
                            onChange={(e) => {
                              const next = [...params];
                              next[idx].key = e.target.value;
                              setParams(next);
                            }}
                          />
                        ),
                      },
                      {
                        title: 'Value',
                        dataIndex: 'value',
                        render: (val, _, idx) => (
                          <Input
                            size="small"
                            value={val}
                            placeholder="Valor"
                            onChange={(e) => {
                              const next = [...params];
                              next[idx].value = e.target.value;
                              setParams(next);
                            }}
                          />
                        ),
                      },
                      {
                        title: 'Descrição',
                        dataIndex: 'description',
                        render: (val, _, idx) => (
                          <Input
                            size="small"
                            value={val}
                            placeholder="Descrição"
                            onChange={(e) => {
                              const next = [...params];
                              next[idx].description = e.target.value;
                              setParams(next);
                            }}
                          />
                        ),
                      },
                      {
                        title: '',
                        width: 40,
                        render: (_, __, idx) => (
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setParams(params.filter((_, i) => i !== idx));
                            }}
                          />
                        ),
                      },
                    ]}
                  />
                  <Button
                    size="small"
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setParams([...params, { key: '', value: '', enabled: true }])}
                    style={{ marginTop: 8 }}
                  >
                    Adicionar Parâmetro
                  </Button>
                </div>
              ),
            },
            {
              key: 'headers',
              label: `Headers (${headers.filter((h) => h.enabled && h.key).length})`,
              children: (
                <div>
                  <Table
                    size="small"
                    pagination={false}
                    dataSource={headers.map((h, idx) => ({ ...h, keyIndex: idx }))}
                    rowKey="keyIndex"
                    columns={[
                      {
                        title: '',
                        dataIndex: 'enabled',
                        width: 40,
                        render: (checked, _, idx) => (
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = [...headers];
                              next[idx].enabled = e.target.checked;
                              setHeaders(next);
                            }}
                          />
                        ),
                      },
                      {
                        title: 'Header Key',
                        dataIndex: 'key',
                        render: (val, _, idx) => (
                          <Input
                            size="small"
                            value={val}
                            placeholder="e.g. Authorization"
                            onChange={(e) => {
                              const next = [...headers];
                              next[idx].key = e.target.value;
                              setHeaders(next);
                            }}
                          />
                        ),
                      },
                      {
                        title: 'Header Value',
                        dataIndex: 'value',
                        render: (val, _, idx) => (
                          <Input
                            size="small"
                            value={val}
                            placeholder="e.g. Bearer token"
                            onChange={(e) => {
                              const next = [...headers];
                              next[idx].value = e.target.value;
                              setHeaders(next);
                            }}
                          />
                        ),
                      },
                      {
                        title: '',
                        width: 40,
                        render: (_, __, idx) => (
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setHeaders(headers.filter((_, i) => i !== idx));
                            }}
                          />
                        ),
                      },
                    ]}
                  />
                  <Button
                    size="small"
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setHeaders([...headers, { key: '', value: '', enabled: true }])}
                    style={{ marginTop: 8 }}
                  >
                    Adicionar Header
                  </Button>
                </div>
              ),
            },
            {
              key: 'auth',
              label: 'Autenticação',
              children: (
                <div style={{ padding: '8px 4px' }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 180 }}>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        Tipo de Autenticação
                      </Text>
                      <Select value={authType} onChange={setAuthType} style={{ width: '100%' }}>
                        <Option value="none">Nenhuma (Pública)</Option>
                        <Option value="bearer">Bearer Token</Option>
                        <Option value="api_key">API Key (X-API-Key)</Option>
                        <Option value="basic">Basic Auth</Option>
                      </Select>
                    </div>

                    <div style={{ flex: 1 }}>
                      {authType === 'bearer' && (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                            Bearer Token
                          </Text>
                          <Input.Password
                            value={authToken}
                            onChange={(e) => setAuthToken(e.target.value)}
                            placeholder="Insira o JWT ou API Token"
                          />
                        </div>
                      )}

                      {authType === 'api_key' && (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                            API Key Value
                          </Text>
                          <Input.Password
                            value={authToken}
                            onChange={(e) => setAuthToken(e.target.value)}
                            placeholder="API Key secret"
                          />
                        </div>
                      )}

                      {authType === 'basic' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                              Username
                            </Text>
                            <Input
                              value={authUsername}
                              onChange={(e) => setAuthUsername(e.target.value)}
                              placeholder="usuário ou e-mail"
                            />
                          </div>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                              Password / Token
                            </Text>
                            <Input.Password
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              placeholder="senha"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: 'body',
              label: 'Body (Payload)',
              children: (
                <div style={{ padding: '8px 4px' }}>
                  <div style={{ marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Formato:</Text>
                    <Select value={bodyType} onChange={setBodyType} size="small" style={{ width: 120 }}>
                      <Option value="none">none</Option>
                      <Option value="json">JSON (application/json)</Option>
                      <Option value="raw">Raw / Text</Option>
                    </Select>
                  </div>

                  {bodyType !== 'none' && (
                    <TextArea
                      rows={6}
                      value={bodyContent}
                      onChange={(e) => setBodyContent(e.target.value)}
                      placeholder='{\n  "key": "value"\n}'
                      style={{ fontFamily: 'monospace', fontSize: 12 }}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Response Panel */}
      <Card
        size="small"
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Resposta da API</span>
            {response && (
              <Space>
                <Tag color={response.status_code >= 200 && response.status_code < 300 ? 'green' : 'red'}>
                  {response.status_text}
                </Tag>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {response.latency_ms} ms
                </Tag>
                <Tag color="default">
                  {(response.response_size_bytes / 1024).toFixed(2)} KB
                </Tag>
              </Space>
            )}
          </div>
        }
        style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        {response ? (
          <Tabs
            size="small"
            items={[
              {
                key: 'body',
                label: 'Corpo (Body)',
                children: (
                  <div style={{ position: 'relative' }}>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(response.body);
                        message.success('Resposta copiada!');
                      }}
                      style={{ position: 'absolute', right: 8, top: 8, zIndex: 10 }}
                    >
                      Copiar
                    </Button>
                    <pre
                      style={{
                        background: '#0F172A',
                        color: '#38BDF8',
                        padding: '16px',
                        borderRadius: 6,
                        maxHeight: 320,
                        overflow: 'auto',
                        fontSize: 12,
                        fontFamily: 'monospace',
                        lineHeight: 1.5,
                      }}
                    >
                      {response.is_json
                        ? (() => {
                            try {
                              return JSON.stringify(JSON.parse(response.body), null, 2);
                            } catch {
                              return response.body;
                            }
                          })()
                        : response.body}
                    </pre>
                  </div>
                ),
              },
              {
                key: 'headers',
                label: `Headers (${Object.keys(response.headers || {}).length})`,
                children: (
                  <div style={{ maxHeight: 250, overflow: 'auto' }}>
                    <Table
                      size="small"
                      pagination={false}
                      dataSource={Object.entries(response.headers || {}).map(([k, v]) => ({
                        key: k,
                        headerKey: k,
                        headerValue: v,
                      }))}
                      columns={[
                        { title: 'Header', dataIndex: 'headerKey', width: 220, render: (t) => <Text strong>{t}</Text> },
                        { title: 'Value', dataIndex: 'headerValue', render: (t) => <Text code>{t}</Text> },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#94A3B8' }}>
            <ThunderboltOutlined style={{ fontSize: 32, marginBottom: 8, color: '#CBD5E1' }} />
            <div>Clique em <strong>Enviar</strong> para disparar a requisição e visualizar o status, latência e payload.</div>
          </div>
        )}
      </Card>

      {/* Save Request Modal */}
      <Modal
        title="Salvar Requisição na Coleção"
        open={saveModalVisible}
        onCancel={() => setSaveModalVisible(false)}
        onOk={handleSaveRequest}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Nome da Requisição</Text>
          <Input
            value={requestNameInput}
            onChange={(e) => setRequestNameInput(e.target.value)}
            placeholder="e.g. Confluence: Obter Página de Arquitetura"
          />
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Pasta / Grupo</Text>
          <Input
            value={requestFolderInput}
            onChange={(e) => setRequestFolderInput(e.target.value)}
            placeholder="e.g. Confluence Cloud"
          />
        </div>
      </Modal>

      {/* New Source Modal */}
      <Modal
        title="Cadastrar Nova Fonte de API Externa"
        open={newSourceModalVisible}
        onCancel={() => setNewSourceModalVisible(false)}
        footer={null}
      >
        <Form form={sourceForm} layout="vertical" onFinish={handleCreateSource}>
          <Form.Item label="Nome da Fonte" name="name" rules={[{ required: true, message: 'Informe o nome' }]}>
            <Input placeholder="e.g. Olivelas Broker API Staging" />
          </Form.Item>
          <Form.Item label="URL Base" name="base_url" rules={[{ required: true, message: 'Informe a URL base' }]}>
            <Input placeholder="https://api-staging.olivelas.com.br" />
          </Form.Item>
          <Form.Item label="Tipo de Autenticação Padrão" name="auth_type">
            <Select defaultValue="none">
              <Option value="none">Nenhuma</Option>
              <Option value="bearer">Bearer Token</Option>
              <Option value="api_key">API Key</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Token / Credencial Inicial (Opcional)" name="token">
            <Input.Password placeholder="Token" />
          </Form.Item>
          <Form.Item label="Descrição" name="description">
            <Input placeholder="Ambiente de staging para testes de integração" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setNewSourceModalVisible(false)}>Cancelar</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#0066CC' }}>
              Salvar Fonte
            </Button>
          </div>
        </Form>
      </Modal>
    </Drawer>
  );
};
