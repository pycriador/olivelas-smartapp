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
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  CodeOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
  CompassOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { EntityVersionModal } from '@/components/ui/EntityVersionModal';
import { ComponentVisualPreview } from './ComponentVisualPreview';
import { catalogService } from '@/services/catalog.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { useUIStore } from '@/stores/uiStore';
import { navigateTo } from '@/router/navigation';
import type { Component } from '@/types/domain.types';

export const ComponentsCatalogPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [components, setComponents] = useState<Component[]>([]);
  const [totalComponents, setTotalComponents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // URL-synced & Server-Side Pagination
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(9);

  // Create / Edit Modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Component | null>(null);
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Preview / Code Modal
  const [previewCodeModal, setPreviewCodeModal] = useState<{ open: boolean; comp: Component | null }>({
    open: false,
    comp: null,
  });

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetComp, setVersionTargetComp] = useState<Component | null>(null);

  const fetchComponents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await catalogService.getComponentsPaginated({
        search: search || undefined,
        category: categoryFilter,
        status: statusFilter,
        page: currentPage,
        page_size: pageSize,
      });
      setComponents(res.data);
      setTotalComponents(res.meta?.total ?? res.data.length);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar componentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, categoryFilter, statusFilter]);

  const filteredComponents = useMemo(() => ({ length: totalComponents }), [totalComponents]);
  const paginatedComponents = components;

  useEffect(() => {
    if (formModalOpen) {
      if (editingComp) {
        form.setFieldsValue({
          name: editingComp.name,
          category: editingComp.category,
          type: editingComp.type || 'UI Component',
          framework: (editingComp as any).framework || 'React / Ant Design (Copan)',
          description: editingComp.description,
          preview_code: editingComp.preview_code || '',
          interface_spec: editingComp.interface_spec || '',
          dependencies: editingComp.dependencies || [],
          tags: editingComp.tags || [],
          version: editingComp.version || '1.0.0',
          status: editingComp.status || 'Draft',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          category: 'Data Display',
          type: 'UI Component',
          framework: 'React / Ant Design (Copan)',
          version: '1.0.0',
          status: 'Draft',
          tags: ['loft-copan', 'frontend'],
          preview_code: '<div className="p-4 bg-white rounded-xl shadow-2xs">\n  <h3>Componente Copan</h3>\n</div>',
        });
      }
    }
  }, [formModalOpen, editingComp, form]);

  const handleOpenCreate = () => {
    setEditingComp(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (comp: Component, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingComp(comp);
    setFormModalOpen(true);
  };

  const handleSaveForm = async (values: any) => {
    setFormSubmitting(true);
    try {
      if (editingComp) {
        await catalogService.updateComponent(editingComp.id, values);
        message.success(`Componente '${values.name}' atualizado com sucesso!`);
      } else {
        await catalogService.createComponent(values);
        message.success(`Componente '${values.name}' cadastrado com sucesso!`);
      }
      setFormModalOpen(false);
      fetchComponents();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar componente');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (comp: Component, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await catalogService.deleteComponent(comp.id);
      message.success(`Componente '${comp.name}' removido com sucesso!`);
      if (previewCodeModal.comp?.id === comp.id) {
        setPreviewCodeModal({ open: false, comp: null });
      }
      fetchComponents();
    } catch (err: any) {
      message.error(err.message || 'Falha ao remover componente');
    }
  };

  const handleOpenVersionModal = (comp: Component, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetComp(comp);
    setVersionModalOpen(true);
  };

  const handleOpen360 = (comp: Component, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/catalog/components', { id: comp.id, type: 'component' });
    openInspector360('component', comp.id);
  };

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(components.map((c) => c.category).filter(Boolean)));
  }, [components]);

  const tableColumns: ColumnsType<Component> = [
    {
      title: 'Componente',
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
      render: (cat) => <Tag color="orange">{cat}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
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
            icon={<CodeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setPreviewCodeModal({ open: true, comp: record });
            }}
          >
            Código
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
            title="Excluir componente?"
            description="Tem certeza que deseja remover este componente do catálogo?"
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
        title="Catálogo de Componentes Copan"
        subtitle="Biblioteca oficial de componentes do Loft Design System Copan & React. Visualização de código, versionamento SemVer e CRUD completo."
        breadcrumbs={[
          { title: 'Catálogo', href: '/catalog' },
          { title: 'Componentes' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchComponents}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Novo Componente
            </Button>
          </Space>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar componentes por nome, descrição ou tag..."
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
            placeholder="Categoria"
            allowClear
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              resetToFirstPage();
            }}
            className="w-48"
            options={uniqueCategories.map((c) => ({ label: c, value: c }))}
          />

          <Select
            placeholder="Status"
            allowClear
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              resetToFirstPage();
            }}
            className="w-40"
            options={[
              { value: 'Published', label: 'Published' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Deprecated', label: 'Deprecated' },
            ]}
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
        <LoadingState tip="Carregando componentes do catálogo..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchComponents} />
      ) : filteredComponents.length === 0 ? (
        <EmptyState
          title="Nenhum componente encontrado"
          description="Ajuste os filtros de busca ou cadastre um novo componente Copan."
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-loft-border overflow-hidden shadow-2xs">
          <Table
            columns={tableColumns}
            dataSource={paginatedComponents}
            rowKey="id"
            pagination={false}
          />
          <div className="p-4 border-t border-loft-border flex justify-between items-center">
            <span className="text-xs text-loft-muted">
              Total: {filteredComponents.length} componentes
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredComponents.length}
              onChange={(p, s) => {
                setCurrentPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={['9', '18', '36']}
            />
          </div>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>
            {paginatedComponents.map((comp) => (
              <Col xs={24} sm={12} lg={8} key={comp.id}>
                <Card
                  hoverable
                  className="h-full flex flex-col justify-between shadow-2xs border-loft-border transition hover:border-loft-orange cursor-pointer group"
                  onClick={() => handleOpen360(comp)}
                  actions={[
                    <Button
                      key="code"
                      type="text"
                      size="small"
                      icon={<CodeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewCodeModal({ open: true, comp });
                      }}
                    >
                      Código
                    </Button>,
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => handleOpenEdit(comp, e)}
                    >
                      Editar
                    </Button>,
                    <Button
                      key="version"
                      type="text"
                      size="small"
                      icon={<BranchesOutlined />}
                      onClick={(e) => handleOpenVersionModal(comp, e)}
                    >
                      v{comp.version}
                    </Button>,
                  ]}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-base text-loft-dark group-hover:text-loft-orange transition line-clamp-1">
                        {comp.name}
                      </span>
                      <StatusBadge status={comp.status} />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Tag color="orange">{comp.category}</Tag>
                      <span className="font-mono text-xs text-loft-muted">v{comp.version}</span>
                    </div>

                    <p className="text-xs text-loft-muted line-clamp-2 mb-4 leading-relaxed">
                      {comp.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {comp.tags?.slice(0, 4).map((tag) => (
                        <Tag key={tag} className="text-[10px]">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-loft-border shadow-2xs">
            <span className="text-xs text-loft-muted font-medium">
              Exibindo {paginatedComponents.length} de {filteredComponents.length} componentes
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredComponents.length}
              onChange={(p, s) => {
                setCurrentPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={['9', '18', '36']}
            />
          </div>
        </div>
      )}

      {/* Code & Documentation Modal with Live Visual Preview */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CodeOutlined className="text-loft-orange" />
            <span>Showcase & Código: {previewCodeModal.comp?.name}</span>
            <Tag color="orange" className="font-mono">v{previewCodeModal.comp?.version}</Tag>
          </div>
        }
        open={previewCodeModal.open}
        onCancel={() => setPreviewCodeModal({ open: false, comp: null })}
        centered
        styles={{
          body: {
            maxHeight: 'calc(85vh - 140px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
        footer={[
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              if (previewCodeModal.comp) {
                const c = previewCodeModal.comp;
                setPreviewCodeModal({ open: false, comp: null });
                handleOpenEdit(c);
              }
            }}
          >
            Editar
          </Button>,
          <Button
            key="version"
            icon={<BranchesOutlined />}
            onClick={() => {
              if (previewCodeModal.comp) {
                handleOpenVersionModal(previewCodeModal.comp);
              }
            }}
          >
            Versões
          </Button>,
          <Button
            key="360"
            type="primary"
            icon={<CompassOutlined />}
            className="bg-loft-orange border-none"
            onClick={() => {
              if (previewCodeModal.comp) {
                handleOpen360(previewCodeModal.comp);
                setPreviewCodeModal({ open: false, comp: null });
              }
            }}
          >
            360° Inspector
          </Button>,
        ]}
        width={840}
      >
        {previewCodeModal.comp && (
          <div className="pt-2">
            <ComponentVisualPreview component={previewCodeModal.comp} defaultTab="preview" />
          </div>
        )}
      </Modal>

      {/* Create / Edit Component Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <AppstoreAddOutlined className="text-loft-orange" />
            <span>{editingComp ? 'Editar Componente Copan' : 'Novo Componente Copan'}</span>
          </div>
        }
        open={formModalOpen}
        onCancel={() => setFormModalOpen(false)}
        footer={null}
        width={750}
        centered
        styles={{
          body: {
            maxHeight: 'calc(85vh - 140px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
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
                label="Nome do Componente"
                rules={[{ required: true, message: 'Informe o nome' }]}
              >
                <Input placeholder="Ex: LoftPropertyCard" />
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
                    { value: 'Navigation', label: 'Navigation' },
                    { value: 'Data Display', label: 'Data Display' },
                    { value: 'Feedback', label: 'Feedback' },
                    { value: 'Forms & Inputs', label: 'Forms & Inputs' },
                    { value: 'Layout', label: 'Layout' },
                    { value: 'Domain Specific', label: 'Domain Specific' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Descrição & Propósito"
            rules={[{ required: true, message: 'Informe a descrição' }]}
          >
            <Input.TextArea rows={2} placeholder="Descreva o propósito funcional e uso recomendado..." />
          </Form.Item>

          <Form.Item name="preview_code" label="Exemplo Canônico de Código (TSX)">
            <Input.TextArea rows={5} className="font-mono text-xs" placeholder="<LoftPropertyCard id='123' />" />
          </Form.Item>

          <Form.Item name="interface_spec" label="Interface TypeScript (Props Spec)">
            <Input.TextArea rows={4} className="font-mono text-xs" placeholder="interface LoftPropertyCardProps { title: string; price: number; }" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dependencies" label="Dependências (Pacotes NPM)">
                <Select mode="tags" placeholder="Ex: antd, @ant-design/icons" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Ex: loft-copan, card, b2b" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="version" label="Versão">
                <Input placeholder="1.0.0" className="font-mono" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            {editingComp ? (
              <Popconfirm
                title="Excluir permanentemente do banco de dados?"
                description={
                  <div className="max-w-[280px] text-xs text-loft-muted">
                    Esta ação removerá o componente <strong>{editingComp.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
                  </div>
                }
                okText="Sim, excluir permanentemente"
                cancelText="Cancelar"
                okButtonProps={{ danger: true, loading: formSubmitting, className: 'bg-[#E12D39]' }}
                onConfirm={async () => {
                  try {
                    await catalogService.deleteComponent(editingComp.id);
                    message.success(`Componente '${editingComp.name}' excluído com sucesso do banco de dados!`);
                    setFormModalOpen(false);
                    fetchComponents();
                  } catch (err: any) {
                    message.error(err.message || 'Falha ao excluir componente');
                  }
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Excluir Componente
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
                {editingComp ? 'Salvar Alterações' : 'Cadastrar Componente'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Universal Versioning Modal */}
      {versionTargetComp && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="component"
          entityId={versionTargetComp.id}
          entityName={versionTargetComp.name}
          currentVersion={versionTargetComp.version || '1.0.0'}
          versions={versionTargetComp.versions}
          onSuccess={fetchComponents}
        />
      )}
    </div>
  );
};
