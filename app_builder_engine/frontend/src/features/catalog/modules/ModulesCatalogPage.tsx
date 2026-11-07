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
  EyeOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined,
  BlockOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
  CompassOutlined,
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
import type { Module, Component } from '@/types/domain.types';

export const ModulesCatalogPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [modules, setModules] = useState<Module[]>([]);
  const [totalModules, setTotalModules] = useState(0);
  const [components, setComponents] = useState<Component[]>([]);
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
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetModule, setVersionTargetModule] = useState<Module | null>(null);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const [modRes, compData] = await Promise.all([
        catalogService.getModulesPaginated({
          search: search || undefined,
          category: categoryFilter,
          status: statusFilter,
          page: currentPage,
          page_size: pageSize,
        }),
        catalogService.getComponents(),
      ]);
      setModules(modRes.data);
      setTotalModules(modRes.meta?.total ?? modRes.data.length);
      setComponents(compData);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar módulos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, categoryFilter, statusFilter]);

  const filteredModules = useMemo(() => ({ length: totalModules }), [totalModules]);
  const paginatedModules = modules;

  useEffect(() => {
    if (formModalOpen) {
      if (editingModule) {
        form.setFieldsValue({
          name: editingModule.name,
          category: editingModule.category,
          description: editingModule.description,
          components: editingModule.components || [],
          dependencies: editingModule.dependencies || [],
          tags: editingModule.tags || [],
          version: editingModule.version || '1.0.0',
          status: editingModule.status || 'Draft',
        });
      } else {
        form.setFieldsValue({
          name: '',
          category: 'Domain Feature',
          description: '',
          components: [],
          dependencies: [],
          tags: ['loft-module', 'feature'],
          version: '1.0.0',
          status: 'Draft',
        });
      }
    }
  }, [formModalOpen, editingModule, form]);

  const handleOpenCreate = () => {
    setEditingModule(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (mod: Module, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingModule(mod);
    setFormModalOpen(true);
  };

  const handleSaveForm = async (values: any) => {
    setFormSubmitting(true);
    try {
      if (editingModule) {
        await catalogService.updateModule(editingModule.id, values);
        message.success(`Módulo '${values.name}' atualizado com sucesso!`);
      } else {
        await catalogService.createModule(values);
        message.success(`Módulo '${values.name}' cadastrado com sucesso!`);
      }
      setFormModalOpen(false);
      fetchModules();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar módulo');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (mod: Module, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await catalogService.deleteModule(mod.id);
      message.success(`Módulo '${mod.name}' removido com sucesso!`);
      if (selectedModule?.id === mod.id) setDetailModalOpen(false);
      fetchModules();
    } catch (err: any) {
      message.error(err.message || 'Falha ao remover módulo');
    }
  };

  const handleOpenVersionModal = (mod: Module, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetModule(mod);
    setVersionModalOpen(true);
  };

  const handleOpenDetail = (mod: Module, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedModule(mod);
    setDetailModalOpen(true);
  };

  const handleOpen360 = (mod: Module, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/catalog/modules', { id: mod.id, type: 'module' });
    openInspector360('module', mod.id);
  };

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(modules.map((m) => m.category).filter(Boolean)));
  }, [modules]);

  const tableColumns: ColumnsType<Module> = [
    {
      title: 'Módulo de Domínio',
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
      title: 'Componentes Agrupados',
      dataIndex: 'components',
      key: 'components',
      render: (comps: string[]) => (
        <span className="text-xs text-loft-muted">
          {comps?.length || 0} componente(s)
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {(tags || []).slice(0, 2).map((t) => (
            <Tag key={t} color="orange" className="font-mono text-[10px]">
              #{t}
            </Tag>
          ))}
          {(tags || []).length > 2 && (
            <Tag className="text-[10px]">+{tags.length - 2}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
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
            title="Excluir módulo?"
            description="Tem certeza que deseja remover este módulo do catálogo?"
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
        title="Catálogo de Módulos Funcionais"
        subtitle="Agrupamentos de componentes e serviços que compõem blocos de negócio reutilizáveis. CRUD completo e versionamento SemVer."
        breadcrumbs={[
          { title: 'Catálogo', href: '/catalog' },
          { title: 'Módulos' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchModules}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Novo Módulo
            </Button>
          </Space>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar módulos por nome, descrição ou componentes..."
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
        <LoadingState tip="Carregando módulos funcionais..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchModules} />
      ) : filteredModules.length === 0 ? (
        <EmptyState
          title="Nenhum módulo encontrado"
          description="Ajuste os filtros de busca ou crie um novo módulo funcional."
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-loft-border overflow-hidden shadow-2xs">
          <Table
            columns={tableColumns}
            dataSource={paginatedModules}
            rowKey="id"
            pagination={false}
          />
          <div className="p-4 border-t border-loft-border flex justify-between items-center">
            <span className="text-xs text-loft-muted">
              Total: {filteredModules.length} módulos
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredModules.length}
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
            {paginatedModules.map((mod) => (
              <Col xs={24} sm={12} lg={8} key={mod.id}>
                <Card
                  hoverable
                  className="h-full flex flex-col justify-between shadow-2xs border-loft-border transition hover:border-loft-orange cursor-pointer group"
                  onClick={() => handleOpen360(mod)}
                  actions={[
                    <Button
                      key="view"
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => handleOpenDetail(mod, e)}
                    >
                      Detalhes
                    </Button>,
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => handleOpenEdit(mod, e)}
                    >
                      Editar
                    </Button>,
                    <Button
                      key="version"
                      type="text"
                      size="small"
                      icon={<BranchesOutlined />}
                      onClick={(e) => handleOpenVersionModal(mod, e)}
                    >
                      v{mod.version}
                    </Button>,
                  ]}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-base text-loft-dark group-hover:text-loft-orange transition line-clamp-1">
                        {mod.name}
                      </span>
                      <StatusBadge status={mod.status} />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Tag color="orange">{mod.category}</Tag>
                      <span className="font-mono text-xs text-loft-muted">v{mod.version}</span>
                    </div>

                    <p className="text-xs text-loft-muted line-clamp-2 mb-3 leading-relaxed">
                      {mod.description}
                    </p>

                    {mod.tags && mod.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mod.tags.slice(0, 3).map((t) => (
                          <Tag key={t} color="orange" className="text-[10px] font-mono m-0">
                            #{t}
                          </Tag>
                        ))}
                        {mod.tags.length > 3 && (
                          <Tag className="text-[10px] m-0">+{mod.tags.length - 3}</Tag>
                        )}
                      </div>
                    )}

                    <div className="p-2.5 bg-[#FAFBFD] border border-loft-border rounded-lg text-xs mb-3">
                      <span className="font-bold text-loft-dark block mb-1">
                        Componentes ({mod.components?.length || 0}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {mod.components?.slice(0, 3).map((c) => (
                          <Tag key={c} className="text-[10px] font-mono">
                            {c}
                          </Tag>
                        ))}
                        {(mod.components?.length || 0) > 3 && (
                          <Tag className="text-[10px]">+{mod.components!.length - 3}</Tag>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-loft-border shadow-2xs">
            <span className="text-xs text-loft-muted font-medium">
              Exibindo {paginatedModules.length} de {filteredModules.length} módulos
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredModules.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={['9', '18', '36']}
            />
          </div>
        </div>
      )}

      {/* Module Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <BlockOutlined className="text-loft-orange" />
            <span>{selectedModule?.name}</span>
            <Tag color="orange" className="font-mono">v{selectedModule?.version}</Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        centered
        styles={{ body: { maxHeight: 'calc(85vh - 140px)', overflowY: 'auto', paddingRight: 8 } }}
        footer={[
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              if (selectedModule) {
                const m = selectedModule;
                setDetailModalOpen(false);
                handleOpenEdit(m);
              }
            }}
          >
            Editar
          </Button>,
          <Button
            key="version"
            icon={<BranchesOutlined />}
            onClick={() => selectedModule && handleOpenVersionModal(selectedModule)}
          >
            Versões
          </Button>,
          <Button
            key="360"
            type="primary"
            icon={<CompassOutlined />}
            className="bg-loft-orange border-none"
            onClick={() => {
              if (selectedModule) {
                handleOpen360(selectedModule);
                setDetailModalOpen(false);
              }
            }}
          >
            360° Inspector
          </Button>,
        ]}
        width={750}
      >
        {selectedModule && (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs flex justify-between items-center">
              <div>
                <b className="text-loft-dark">Categoria:</b> {selectedModule.category} | <b className="text-loft-dark">Status:</b> {selectedModule.status}
              </div>
              <StatusBadge status={selectedModule.status} />
            </div>

            <div className="p-4 bg-white border border-loft-border rounded-xl text-xs space-y-3">
              <div>
                <div className="font-bold text-loft-dark mb-1">Descrição:</div>
                <MarkdownViewer content={selectedModule.description || ''} />
              </div>

              {selectedModule.tags && selectedModule.tags.length > 0 && (
                <div>
                  <div className="font-bold text-loft-dark mb-1">Tags do Módulo:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedModule.tags.map((t) => (
                      <Tag key={t} color="orange" className="font-mono">
                        #{t}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="font-bold text-loft-dark mb-1">Componentes Integrados:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.components?.map((c) => (
                    <Tag key={c} color="blue" className="font-mono">
                      {c}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-loft-dark mb-1">Dependências de Pacotes:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.dependencies?.map((d) => (
                    <Tag key={d} className="font-mono">
                      {d}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Module Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <BlockOutlined className="text-loft-orange" />
            <span>{editingModule ? 'Editar Módulo Funcional' : 'Novo Módulo Funcional'}</span>
          </div>
        }
        open={formModalOpen}
        onCancel={() => setFormModalOpen(false)}
        centered
        styles={{ body: { maxHeight: 'calc(85vh - 140px)', overflowY: 'auto', paddingRight: 8 } }}
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
                label="Nome do Módulo"
                rules={[{ required: true, message: 'Informe o nome' }]}
              >
                <Input placeholder="Ex: Authentication & Session Module" />
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
                    { value: 'Core & Shell', label: 'Core & Shell' },
                    { value: 'Authentication & IAM', label: 'Authentication & IAM' },
                    { value: 'Domain Feature', label: 'Domain Feature' },
                    { value: 'Reporting & Analytics', label: 'Reporting & Analytics' },
                    { value: 'Integration & API', label: 'Integration & API' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Descrição Funcional"
            rules={[{ required: true, message: 'Informe a descrição' }]}
          >
            <Input.TextArea rows={3} placeholder="Descreva a responsabilidade do módulo, fluxos suportados e regras de negócio..." />
          </Form.Item>

          <Form.Item name="components" label="Componentes Associados">
            <Select
              mode="tags"
              placeholder="Selecione ou digite IDs de componentes"
              options={components.map((c) => ({ label: `${c.name} (${c.id})`, value: c.id }))}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dependencies" label="Dependências de Pacotes / Módulos">
                <Select mode="tags" placeholder="Ex: antd, fastapi, @loft/copan" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tags" label="Tags">
                <Select mode="tags" placeholder="Ex: auth, jwt, security" />
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
            {editingModule ? (
              <Popconfirm
                title="Excluir permanentemente do banco de dados?"
                description={
                  <div className="max-w-[280px] text-xs text-loft-muted">
                    Esta ação removerá o módulo <strong>{editingModule.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
                  </div>
                }
                okText="Sim, excluir permanentemente"
                cancelText="Cancelar"
                okButtonProps={{ danger: true, loading: formSubmitting, className: 'bg-[#E12D39]' }}
                onConfirm={async () => {
                  try {
                    await catalogService.deleteModule(editingModule.id);
                    message.success(`Módulo '${editingModule.name}' excluído com sucesso do banco de dados!`);
                    setFormModalOpen(false);
                    fetchModules();
                  } catch (err: any) {
                    message.error(err.message || 'Falha ao excluir módulo');
                  }
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Excluir Módulo
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
                {editingModule ? 'Salvar Alterações' : 'Cadastrar Módulo'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Universal Versioning Modal */}
      {versionTargetModule && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="module"
          entityId={versionTargetModule.id}
          entityName={versionTargetModule.name}
          currentVersion={versionTargetModule.version || '1.0.0'}
          versions={versionTargetModule.versions}
          onSuccess={fetchModules}
        />
      )}
    </div>
  );
};
