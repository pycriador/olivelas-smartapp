import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Input,
  Select,
  Pagination,
  Radio,
  Table,
  Modal,
  message,
  Space,
  Form,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  EyeOutlined,
  BuildOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
  CompassOutlined,
  LayoutOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';
import { EntityVersionModal } from '@/components/ui/EntityVersionModal';
import { catalogService } from '@/services/catalog.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { useUIStore } from '@/stores/uiStore';
import { navigateTo } from '@/router/navigation';
import type { Template } from '@/types/domain.types';

export const TemplatesCatalogPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [architectureFilter, setArchitectureFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // URL-synced & Server-Side Pagination
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(6);

  // Create / Edit Modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState<Template | null>(null);
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Detail Modal
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetTpl, setVersionTargetTpl] = useState<Template | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await catalogService.getTemplatesPaginated({
        search: search || undefined,
        architecture_id: architectureFilter,
        category: categoryFilter,
        page: currentPage,
        page_size: pageSize,
      });
      setTemplates(res.data);
      setTotalTemplates(res.meta?.total ?? res.data.length);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, architectureFilter, categoryFilter]);

  const archOptions = useMemo(() => {
    const map = new Map<string, string>();
    templates.forEach((t) => {
      if (t.architecture_id) {
        map.set(t.architecture_id, t.architecture || t.architecture_id);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [templates]);

  const catOptions = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).map((cat) => ({ value: cat, label: cat }));
  }, [templates]);

  const filteredTemplates = useMemo(() => ({ length: totalTemplates }), [totalTemplates]);
  const paginatedTemplates = templates;

  const handleOpenCreate = () => {
    setEditingTpl(null);
    form.resetFields();
    form.setFieldsValue({
      category: 'Portal & Backoffice',
      architecture_id: 'arch_loft_standard_fullstack',
      version: '1.0.0',
      status: 'Published',
      modules: [],
      components: [],
      rules: [],
      tags: ['loft-template', 'fullstack'],
    });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (tpl: Template, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingTpl(tpl);
    form.resetFields();
    form.setFieldsValue({
      name: tpl.name,
      category: tpl.category,
      description: tpl.description,
      architecture_id: tpl.architecture_id,
      modules: tpl.modules || [],
      components: tpl.components || [],
      rules: tpl.rules || [],
      tags: tpl.tags || [],
      version: tpl.version || '1.0.0',
      status: tpl.status || 'Published',
    });
    setFormModalOpen(true);
  };

  const handleSaveForm = async (values: any) => {
    setFormSubmitting(true);
    try {
      if (editingTpl) {
        await catalogService.updateTemplate(editingTpl.id, values);
        message.success(`Template '${values.name}' atualizado com sucesso!`);
      } else {
        await catalogService.createTemplate(values);
        message.success(`Template '${values.name}' criado com sucesso!`);
      }
      setFormModalOpen(false);
      fetchTemplates();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar template');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (tpl: Template, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await catalogService.deleteTemplate(tpl.id);
      message.success(`Template '${tpl.name}' removido com sucesso!`);
      if (selectedTemplate?.id === tpl.id) setDetailModalOpen(false);
      fetchTemplates();
    } catch (err: any) {
      message.error(err.message || 'Falha ao remover template');
    }
  };

  const handleOpenVersionModal = (tpl: Template, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetTpl(tpl);
    setVersionModalOpen(true);
  };

  const handleOpenDetail = (tpl: Template, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedTemplate(tpl);
    setDetailModalOpen(true);
  };

  const handleOpen360 = (tpl: Template, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/catalog/templates', { id: tpl.id, type: 'template' });
    openInspector360('template', tpl.id);
  };

  const handleUseInWorkshop = (tpl: Template, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/workshop', { templateId: tpl.id });
    message.success(`Template '${tpl.name}' carregado no Blueprint Studio!`);
  };

  const tableColumns: ColumnsType<Template> = [
    {
      title: 'Template Canônico',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div
          className="cursor-pointer hover:text-loft-orange transition font-semibold"
          onClick={() => handleOpen360(record)}
        >
          <div className="text-sm text-loft-dark">{name}</div>
          <div className="text-xs text-loft-muted font-mono">{record.id}</div>
        </div>
      ),
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Arquitetura',
      dataIndex: 'architecture_id',
      key: 'architecture_id',
      render: (arch) => <Tag color="purple" className="font-mono text-xs">{arch}</Tag>,
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version',
      render: (v) => <Tag className="font-mono">v{v}</Tag>,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<BuildOutlined />}
            type="primary"
            className="bg-loft-orange border-none text-xs"
            onClick={(e) => handleUseInWorkshop(record, e)}
          >
            Studio
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => handleOpenDetail(record, e)}
          >
            Ver
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => handleOpenEdit(record, e)}
          >
            Editar
          </Button>
          <Button
            size="small"
            icon={<BranchesOutlined />}
            onClick={(e) => handleOpenVersionModal(record, e)}
          >
            v{record.version}
          </Button>
          <Button
            size="small"
            icon={<CompassOutlined />}
            onClick={(e) => handleOpen360(record, e)}
          >
            360°
          </Button>
          <Popconfirm
            title="Excluir template?"
            description="Tem certeza que deseja remover este template do catálogo?"
            onConfirm={(e) => handleDelete(record, e)}
            okText="Excluir"
            cancelText="Cancelar"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catálogo de Templates Certificados"
        subtitle="Blueprints pré-configurados para novos projetos na Olivelas: Portais, Backoffices, Microserviços e Dashboards. CRUD completo e versionamento SemVer."
        breadcrumbs={[
          { title: 'Catálogo', href: '/catalog' },
          { title: 'Templates' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchTemplates}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Novo Template
            </Button>
          </Space>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar templates por nome, descrição ou arquitetura..."
            prefix={<SearchOutlined className="text-loft-muted" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className="w-full sm:w-80"
            allowClear
          />

          <Select
            placeholder="Arquitetura"
            allowClear
            value={architectureFilter}
            onChange={(val) => {
              setArchitectureFilter(val);
              resetToFirstPage();
            }}
            className="w-56"
            options={archOptions}
          />

          <Select
            placeholder="Categoria"
            allowClear
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              resetToFirstPage();
            }}
            className="w-48"
            options={catOptions}
          />
        </div>

        <div className="flex items-center gap-3">
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="grid">
              <AppstoreOutlined /> Grid
            </Radio.Button>
            <Radio.Button value="table">
              <BarsOutlined /> Tabela
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingState tip="Carregando templates certificados..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTemplates} />
      ) : filteredTemplates.length === 0 ? (
        <EmptyState
          title="Nenhum template encontrado"
          description="Ajuste os filtros de busca ou crie um novo template certificado."
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-loft-border overflow-hidden shadow-2xs">
          <Table
            columns={tableColumns}
            dataSource={paginatedTemplates}
            rowKey="id"
            pagination={false}
          />
          <div className="p-4 border-t border-loft-border flex justify-between items-center">
            <span className="text-xs text-loft-muted">
              Total: {filteredTemplates.length} templates
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredTemplates.length}
              onChange={(p, s) => {
                setCurrentPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={['6', '12', '24']}
            />
          </div>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>
            {paginatedTemplates.map((tpl) => (
              <Col xs={24} md={12} lg={8} key={tpl.id}>
                <Card
                  hoverable
                  className="h-full flex flex-col justify-between shadow-2xs border-loft-border transition hover:border-loft-orange cursor-pointer group"
                  onClick={() => handleOpen360(tpl)}
                  actions={[
                    <Button
                      key="studio"
                      type="primary"
                      size="small"
                      icon={<BuildOutlined />}
                      className="bg-loft-orange hover:bg-[#D9532B] border-none text-xs"
                      onClick={(e) => handleUseInWorkshop(tpl, e)}
                    >
                      Studio
                    </Button>,
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => handleOpenEdit(tpl, e)}
                    >
                      Editar
                    </Button>,
                    <Button
                      key="version"
                      type="text"
                      size="small"
                      icon={<BranchesOutlined />}
                      onClick={(e) => handleOpenVersionModal(tpl, e)}
                    >
                      v{tpl.version}
                    </Button>,
                  ]}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-base text-loft-dark group-hover:text-loft-orange transition line-clamp-1">
                        {tpl.name}
                      </span>
                      <StatusBadge status={tpl.status || 'Published'} />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Tag color="blue">{tpl.category}</Tag>
                      <Tag color="purple" className="font-mono text-[10px]">
                        {tpl.architecture_id}
                      </Tag>
                    </div>

                    <p className="text-xs text-loft-muted line-clamp-3 mb-4 leading-relaxed">
                      {tpl.description}
                    </p>

                    <div className="p-2.5 bg-[#FAFBFD] border border-loft-border rounded-lg text-xs space-y-1">
                      <div className="text-[11px] text-[#486581]">
                        <b className="text-loft-dark">Módulos:</b> {tpl.modules?.length || 0} | <b className="text-loft-dark">Componentes:</b> {tpl.components?.length || 0}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-loft-border shadow-2xs">
            <span className="text-xs text-loft-muted font-medium">
              Exibindo {paginatedTemplates.length} de {filteredTemplates.length} templates
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredTemplates.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={['6', '12', '24']}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <LayoutOutlined className="text-loft-orange" />
            <span>{selectedTemplate?.name}</span>
            <Tag color="orange" className="font-mono">v{selectedTemplate?.version}</Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              if (selectedTemplate) {
                const t = selectedTemplate;
                setDetailModalOpen(false);
                handleOpenEdit(t);
              }
            }}
          >
            Editar
          </Button>,
          <Button
            key="version"
            icon={<BranchesOutlined />}
            onClick={() => selectedTemplate && handleOpenVersionModal(selectedTemplate)}
          >
            Versões
          </Button>,
          <Button
            key="studio"
            type="primary"
            icon={<BuildOutlined />}
            className="bg-loft-orange border-none"
            onClick={() => selectedTemplate && handleUseInWorkshop(selectedTemplate)}
          >
            Abrir no Blueprint Studio
          </Button>,
        ]}
        width={750}
      >
        {selectedTemplate && (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs flex justify-between items-center">
              <div>
                <b className="text-loft-dark">Categoria:</b> {selectedTemplate.category} | <b className="text-loft-dark">Arquitetura:</b> {selectedTemplate.architecture_id}
              </div>
              <Tag color="orange">v{selectedTemplate.version}</Tag>
            </div>

            <div className="p-4 bg-white border border-loft-border rounded-xl text-xs space-y-3">
              <div>
                <div className="font-bold text-loft-dark mb-1">Descrição:</div>
                <MarkdownViewer content={selectedTemplate.description || ''} />
              </div>

              <div>
                <div className="font-bold text-loft-dark mb-1">Módulos Inclusos ({selectedTemplate.modules?.length || 0}):</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.modules?.map((m) => (
                    <Tag key={m} color="blue" className="font-mono">
                      {m}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-loft-dark mb-1">Componentes Vinculados ({selectedTemplate.components?.length || 0}):</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.components?.map((c) => (
                    <Tag key={c} color="purple" className="font-mono">
                      {c}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Template Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <LayoutOutlined className="text-loft-orange" />
            <span>{editingTpl ? 'Editar Template Certificado' : 'Novo Template Certificado'}</span>
          </div>
        }
        open={formModalOpen}
        onCancel={() => setFormModalOpen(false)}
        footer={null}
        width={750}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveForm}
          className="pt-2"
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Nome do Template"
                rules={[{ required: true, message: 'Informe o nome' }]}
              >
                <Input placeholder="Ex: Olivelas Partner Portal Starter" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Categoria"
                rules={[{ required: true, message: 'Selecione a categoria' }]}
              >
                <Select
                  options={[
                    { value: 'Portal & Backoffice', label: 'Portal & Backoffice' },
                    { value: 'B2B Partner Web', label: 'B2B Partner Web' },
                    { value: 'Microservice API', label: 'Microservice API' },
                    { value: 'Dashboard & Analytics', label: 'Dashboard & Analytics' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="architecture_id"
            label="Arquitetura Base"
            rules={[{ required: true, message: 'Selecione a arquitetura' }]}
          >
            <Select
              options={[
                { value: 'arch_loft_standard_fullstack', label: 'arch_loft_standard_fullstack (Fullstack Layered)' },
                { value: 'arch_modular_monolith_be', label: 'arch_modular_monolith_be (Modular Monolith)' },
                { value: 'arch_event_driven_microservices', label: 'arch_event_driven_microservices (Event Driven)' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição Geral"
            rules={[{ required: true, message: 'Informe a descrição' }]}
          >
            <Input.TextArea rows={3} placeholder="Descreva o propósito deste template e quando deve ser utilizado..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="modules" label="Módulos Pré-instalados">
                <Select mode="tags" placeholder="Ex: mod_auth_identity_be, mod_layout_navigation" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="components" label="Componentes Incluídos">
                <Select mode="tags" placeholder="Ex: cmp_fe_app_shell, cmp_fe_data_table" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Ex: partner, portal, fast-track" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="version" label="Versão">
                <Input placeholder="1.0.0" className="font-mono" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="Status">
                <Select
                  options={[
                    { value: 'Published', label: 'Published' },
                    { value: 'Draft', label: 'Draft' },
                    { value: 'Deprecated', label: 'Deprecated' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex items-center justify-between pt-4 border-t border-loft-border">
            {editingTpl ? (
              <Popconfirm
                title="Excluir permanentemente do banco de dados?"
                description={
                  <div className="max-w-[280px] text-xs text-loft-muted">
                    Esta ação removerá o template <strong>{editingTpl.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
                  </div>
                }
                okText="Sim, excluir permanentemente"
                cancelText="Cancelar"
                okButtonProps={{ danger: true, loading: formSubmitting, className: 'bg-[#E12D39]' }}
                onConfirm={async () => {
                  try {
                    await catalogService.deleteTemplate(editingTpl.id);
                    message.success(`Template '${editingTpl.name}' excluído com sucesso do banco de dados!`);
                    setFormModalOpen(false);
                    fetchTemplates();
                  } catch (err: any) {
                    message.error(err.message || 'Falha ao excluir template');
                  }
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Excluir Template
                </Button>
              </Popconfirm>
            ) : <div />}
            <div className="flex items-center gap-2">
              <Button onClick={() => setFormModalOpen(false)}>Cancelar</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={formSubmitting}
                className="bg-loft-orange hover:bg-[#D9532B] border-none"
              >
                {editingTpl ? 'Salvar Alterações' : 'Criar Template'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Universal Versioning Modal */}
      {versionTargetTpl && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="template"
          entityId={versionTargetTpl.id}
          entityName={versionTargetTpl.name}
          currentVersion={versionTargetTpl.version || '1.0.0'}
          versions={versionTargetTpl.versions}
          onSuccess={fetchTemplates}
        />
      )}
    </div>
  );
};
