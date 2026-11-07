import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  Space,
  Alert,
  message,
} from 'antd';
import {
  CloudDownloadOutlined,
  GithubOutlined,
  FileTextOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { KnowledgeDocumentDetail } from '@/types/knowledge.types';
import { knowledgeService } from '@/services/knowledge.service';

const { Option } = Select;
const { TextArea } = Input;

interface ImportDocModalProps {
  visible: boolean;
  onClose: () => void;
  onImportSuccess: (doc: KnowledgeDocumentDetail) => void;
}

export const ImportDocModal: React.FC<ImportDocModalProps> = ({
  visible,
  onClose,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<string>('confluence');
  const [loading, setLoading] = useState<boolean>(false);

  // Confluence form state
  const [confluenceForm] = Form.useForm();
  // GitHub form state
  const [gitHubForm] = Form.useForm();
  // Raw form state
  const [rawForm] = Form.useForm();

  const handleImportConfluence = async (values: any) => {
    try {
      setLoading(true);
      const doc = await knowledgeService.importConfluence({
        space_key: values.space_key,
        page_id_or_title: values.page_id_or_title,
        base_url: values.base_url || 'https://olivelas.atlassian.net/wiki',
        username: values.username,
        api_token: values.api_token,
        target_category: values.target_category || 'external_confluence',
      });
      message.success(`Documento '${doc.title}' importado com sucesso do Confluence!`);
      confluenceForm.resetFields();
      onImportSuccess(doc);
      onClose();
    } catch (err: any) {
      message.error(err.message || 'Falha ao importar do Confluence.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportGitHub = async (values: any) => {
    try {
      setLoading(true);
      const doc = await knowledgeService.importGitHub({
        repo_url: values.repo_url,
        branch: values.branch || 'main',
        path_filter: values.path_filter || 'docs',
        github_token: values.github_token,
        target_category: values.target_category || 'external_github',
      });
      message.success(`Documento '${doc.title}' importado com sucesso do GitHub!`);
      gitHubForm.resetFields();
      onImportSuccess(doc);
      onClose();
    } catch (err: any) {
      message.error(err.message || 'Falha ao importar do GitHub.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportRaw = async (values: any) => {
    try {
      setLoading(true);
      const doc = await knowledgeService.importRaw({
        title: values.title,
        category: values.category || 'architecture_adr',
        source_url: values.source_url,
        content: values.content,
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
      });
      message.success(`Documento '${doc.title}' criado com sucesso!`);
      rawForm.resetFields();
      onImportSuccess(doc);
      onClose();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar documento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <CloudDownloadOutlined style={{ color: '#0066CC' }} />
          <span>Importar Documentação de Plataformas Externas</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={680}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'confluence',
            label: (
              <span>
                <CloudDownloadOutlined /> Atlassian Confluence
              </span>
            ),
            children: (
              <div>
                <Alert
                  type="info"
                  showIcon
                  message="Conector Confluence REST API"
                  description="Importa espaços, especificações de arquitetura ou páginas wiki corporativas com conversão de formato para Markdown limpo."
                  style={{ marginBottom: 16 }}
                />

                <Form
                  form={confluenceForm}
                  layout="vertical"
                  onFinish={handleImportConfluence}
                  initialValues={{
                    base_url: 'https://olivelas.atlassian.net/wiki',
                    space_key: 'TECH',
                    page_id_or_title: 'Olivelas Engineering Guidelines',
                    target_category: 'external_confluence',
                  }}
                >
                  <Form.Item
                    label="URL Base do Confluence Cloud"
                    name="base_url"
                    rules={[{ required: true, message: 'Informe a base URL do Confluence' }]}
                  >
                    <Input placeholder="https://olivelas.atlassian.net/wiki" />
                  </Form.Item>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Form.Item
                      label="Chave do Espaço (Space Key)"
                      name="space_key"
                      rules={[{ required: true, message: 'Informe o Space Key (ex: TECH, ARCH)' }]}
                    >
                      <Input placeholder="TECH" />
                    </Form.Item>

                    <Form.Item label="Título ou ID da Página (Opcional)" name="page_id_or_title">
                      <Input placeholder="Página específica ou em branco para Espaço" />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Form.Item label="Usuário Atlassian (E-mail)" name="username">
                      <Input placeholder="willian.jesus@olivelas.com.br" />
                    </Form.Item>

                    <Form.Item label="API Token (Opcional se pré-configurado)" name="api_token">
                      <Input.Password placeholder="ATATT3xFfGF0..." />
                    </Form.Item>
                  </div>

                  <Form.Item label="Categoria de Destino" name="target_category">
                    <Select>
                      <Option value="external_confluence">Confluence Cloud (Wiki)</Option>
                      <Option value="architecture_adr">Arquitetura & ADRs</Option>
                      <Option value="backend_spec">Especificação Backend</Option>
                      <Option value="security_iam">Segurança & IAM</Option>
                    </Select>
                  </Form.Item>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{ backgroundColor: '#0066CC' }}
                    >
                      Sincronizar e Importar
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
          {
            key: 'github',
            label: (
              <span>
                <GithubOutlined /> GitHub Repository
              </span>
            ),
            children: (
              <div>
                <Alert
                  type="info"
                  showIcon
                  message="Conector GitHub Docs"
                  description="Importa repositórios de documentação como pycriador/olivelas-smartapp ou especificações técnicas diretamente do branch desejado."
                  style={{ marginBottom: 16 }}
                />

                <Form
                  form={gitHubForm}
                  layout="vertical"
                  onFinish={handleImportGitHub}
                  initialValues={{
                    repo_url: 'https://github.com/pycriador/olivelas-smartapp',
                    branch: 'main',
                    path_filter: 'docs/architecture',
                    target_category: 'external_github',
                  }}
                >
                  <Form.Item
                    label="URL do Repositório GitHub"
                    name="repo_url"
                    rules={[{ required: true, message: 'Informe a URL do repositório' }]}
                  >
                    <Input placeholder="https://github.com/pycriador/olivelas-smartapp" />
                  </Form.Item>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Form.Item label="Branch" name="branch">
                      <Input placeholder="main" />
                    </Form.Item>

                    <Form.Item label="Caminho / Pasta" name="path_filter">
                      <Input placeholder="docs / README.md" />
                    </Form.Item>
                  </div>

                  <Form.Item label="GitHub Personal Access Token (Opcional para repos privados)" name="github_token">
                    <Input.Password placeholder="ghp_..." />
                  </Form.Item>

                  <Form.Item label="Categoria de Destino" name="target_category">
                    <Select>
                      <Option value="external_github">GitHub Documentation</Option>
                      <Option value="ai_skills_prompts">IA & Skills (Cursor/Claude)</Option>
                      <Option value="devops_sre">DevOps & Observabilidade</Option>
                    </Select>
                  </Form.Item>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{ backgroundColor: '#121619' }}
                    >
                      Importar do GitHub
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
          {
            key: 'raw',
            label: (
              <span>
                <FileTextOutlined /> Markdown / URL Direta
              </span>
            ),
            children: (
              <div>
                <Form
                  form={rawForm}
                  layout="vertical"
                  onFinish={handleImportRaw}
                  initialValues={{
                    category: 'architecture_adr',
                  }}
                >
                  <Form.Item
                    label="Título do Documento"
                    name="title"
                    rules={[{ required: true, message: 'Informe o título do documento' }]}
                  >
                    <Input placeholder="e.g. RFC-0042: Nova Camada de Cache Distribuído com Redis" />
                  </Form.Item>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Form.Item label="Categoria" name="category">
                      <Select>
                        <Option value="master_guide">Master Guide (CLAUDE.md)</Option>
                        <Option value="architecture_adr">Arquitetura & ADRs</Option>
                        <Option value="frontend_spec">Frontend Copan SDD</Option>
                        <Option value="backend_spec">Backend FastAPI SDD</Option>
                        <Option value="ai_skills_prompts">IA & Prompts (Cursor/Claude)</Option>
                        <Option value="security_iam">Segurança & IAM</Option>
                        <Option value="devops_sre">DevOps & SRE</Option>
                        <Option value="api_integrations">Integrações de API</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Tags (separadas por vírgula)" name="tags">
                      <Input placeholder="redis, cache, performance, backend" />
                    </Form.Item>
                  </div>

                  <Form.Item label="URL de Origem (Opcional)" name="source_url">
                    <Input placeholder="https://..." prefix={<LinkOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="Conteúdo em Markdown"
                    name="content"
                    rules={[{ required: true, message: 'Insira o conteúdo do documento em Markdown' }]}
                  >
                    <TextArea
                      rows={8}
                      placeholder="# Título&#10;&#10;## Contexto&#10;Descreva a especificação técnica..."
                      style={{ fontFamily: 'monospace', fontSize: 12 }}
                    />
                  </Form.Item>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{ backgroundColor: '#FF774A' }}
                    >
                      Criar Documento
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};
