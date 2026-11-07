import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Modal,
  Input,
  Select,
  Pagination,
  Radio,
  Table,
  message,
  Space,
  Form,
  Popconfirm,
  Tabs,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FileTextOutlined,
  EyeOutlined,
  SearchOutlined,
  CopyOutlined,
  DownloadOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';
import { EntityVersionModal } from '@/components/ui/EntityVersionModal';
import { catalogService } from '@/services/catalog.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { useUIStore } from '@/stores/uiStore';
import { navigateTo } from '@/router/navigation';
import type { Specification } from '@/types/domain.types';

export const SpecificationsPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [specs, setSpecs] = useState<Specification[]>([]);
  const [totalSpecs, setTotalSpecs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // URL-synced & Server-Side Pagination
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(6);

  // Viewer Modal
  const [selectedSpec, setSelectedSpec] = useState<Specification | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [viewerTab, setViewerTab] = useState<'preview' | 'raw' | 'meta'>('preview');

  // Create/Edit Modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Specification | null>(null);
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetSpec, setVersionTargetSpec] = useState<Specification | null>(null);

  const fetchSpecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await catalogService.getSpecificationsPaginated({
        search: search || undefined,
        category: categoryFilter,
        tag: selectedTag,
        page: currentPage,
        page_size: pageSize,
      });
      setSpecs(res.data);
      setTotalSpecs(res.meta?.total ?? res.data.length);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar especificações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, categoryFilter, selectedTag]);

  const filteredSpecs = useMemo(() => ({ length: totalSpecs }), [totalSpecs]);
  const paginatedSpecs = specs;

  // Actions
  const openSpecViewer = (spec: Specification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedSpec(spec);
    setViewerTab('preview');
    setViewerModalOpen(true);
  };

  useEffect(() => {
    if (formModalOpen) {
      if (editingSpec) {
        form.setFieldsValue({
          title: editingSpec.title || editingSpec.name,
          category: editingSpec.category || 'Frontend Specification',
          summary: editingSpec.summary || editingSpec.description,
          content: editingSpec.content || '',
          tags: editingSpec.tags || [],
          version: editingSpec.version || '1.0.0',
          status: editingSpec.status || 'Published',
        });
      } else {
        form.setFieldsValue({
          title: '',
          category: 'Frontend Specification',
          summary: '',
          version: '1.0.0',
          status: 'Published',
          tags: ['loft-standard', 'sdd'],
          content: '# Nova Especificação Técnica\n\n> **Resumo Executivo**: Descreva o propósito principal.\n\n## 1. Visão Geral\n\nDetalhes da especificação.',
        });
      }
    }
  }, [formModalOpen, editingSpec, form]);

  const handleOpenCreate = () => {
    setEditingSpec(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (spec: Specification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSpec(spec);
    setFormModalOpen(true);
  };

  const handleSaveForm = async (values: any) => {
    setFormSubmitting(true);
    try {
      if (editingSpec) {
        await catalogService.updateSpecification(editingSpec.id, values);
        message.success(`Especificação '${values.title}' atualizada com sucesso!`);
      } else {
        await catalogService.createSpecification({
          name: values.title,
          title: values.title,
          summary: values.summary,
          description: values.summary,
          category: values.category,
          content: values.content,
          tags: values.tags,
          version: values.version || '1.0.0',
          status: values.status || 'Published',
        });
        message.success(`Especificação '${values.title}' criada com sucesso!`);
      }
      setFormModalOpen(false);
      fetchSpecs();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar especificação');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (spec: Specification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await catalogService.deleteSpecification(spec.id);
      message.success(`Especificação '${spec.title || spec.name}' removida com sucesso!`);
      if (selectedSpec?.id === spec.id) {
        setViewerModalOpen(false);
      }
      fetchSpecs();
    } catch (err: any) {
      message.error(err.message || 'Falha ao remover especificação');
    }
  };

  const handleOpenVersionModal = (spec: Specification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetSpec(spec);
    setVersionModalOpen(true);
  };

  const handleOpen360 = (spec: Specification, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/knowledge/specifications', { id: spec.id, type: 'specification' });
    openInspector360('specification', spec.id);
  };

  const handleCopyContent = (spec: Specification) => {
    navigator.clipboard.writeText(spec.content || spec.summary || '');
    message.success('Conteúdo da especificação copiado!');
  };

  const handleDownloadMarkdown = (spec: Specification) => {
    const blob = new Blob([spec.content || `# ${spec.title || spec.name}\n\n${spec.summary}`], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.slug || spec.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`Arquivo ${spec.slug || spec.id}.md baixado com sucesso!`);
  };

  const tableColumns: ColumnsType<Specification> = [
    {
      title: 'Título da Especificação SDD',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div
          className="cursor-pointer hover:text-loft-orange transition font-semibold"
          onClick={() => openSpecViewer(record)}
        >
          <div className="text-sm text-loft-dark">{title || record.name}</div>
          <div className="text-xs text-loft-muted font-mono">{record.slug || record.id}</div>
        </div>
      ),
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => (
        <Tag color={cat?.includes('Frontend') ? 'blue' : 'purple'}>
          {cat || 'Architecture'}
        </Tag>
      ),
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version',
      render: (v) => <Tag color="orange" className="font-mono font-bold">v{v}</Tag>,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags?.slice(0, 3).map((t) => (
            <Tag key={t} className="text-[10px]">
              {t}
            </Tag>
          ))}
          {tags?.length > 3 && <Tag className="text-[10px]">+{tags.length - 3}</Tag>}
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
            onClick={(e) => openSpecViewer(record, e)}
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
            Versionar
          </Button>
          <Popconfirm
            title="Excluir especificação?"
            description="Tem certeza que deseja remover esta especificação do catálogo?"
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

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(specs.map((s) => s.category).filter(Boolean)));
  }, [specs]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    specs.forEach((s) => s.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [specs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catálogo de Especificações SDD"
        subtitle="Indexação integral de todos os 10 documentos de especificação de Frontend e Backend com visualização rica em Markdown, versionamento SemVer e CRUD completo."
        breadcrumbs={[
          { title: 'Knowledge Base', href: '/knowledge' },
          { title: 'Especificações SDD' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchSpecs}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Nova Especificação
            </Button>
          </Space>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar por título, resumo ou tags..."
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
            placeholder="Categoria SDD"
            allowClear
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              resetToFirstPage();
            }}
            className="w-56"
            options={uniqueCategories.map((c) => ({ label: c, value: c }))}
          />

          {selectedTag && (
            <Tag
              closable
              onClose={() => {
                setSelectedTag(undefined);
                resetToFirstPage();
              }}
              color="orange"
              className="px-2 py-0.5"
            >
              Tag: {selectedTag}
            </Tag>
          )}
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
        <LoadingState tip="Carregando especificações técnicas (SDDs)..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSpecs} />
      ) : filteredSpecs.length === 0 ? (
        <EmptyState
          title="Nenhuma especificação encontrada"
          description="Ajuste os filtros de busca ou crie uma nova especificação técnica."
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-loft-border overflow-hidden shadow-2xs">
          <Table
            columns={tableColumns}
            dataSource={paginatedSpecs}
            rowKey="id"
            pagination={false}
          />
          <div className="p-4 border-t border-loft-border flex justify-between items-center">
            <span className="text-xs text-loft-muted">
              Total: {filteredSpecs.length} especificações
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredSpecs.length}
              onChange={(p, s) => {
                setCurrentPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={['6', '10', '20']}
            />
          </div>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>
            {paginatedSpecs.map((spec) => (
              <Col xs={24} md={12} lg={8} key={spec.id}>
                <Card
                  hoverable
                  className="h-full flex flex-col justify-between border-loft-border rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer group"
                  onClick={() => openSpecViewer(spec)}
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => openSpecViewer(spec, e)}
                    >
                      Ver SDD
                    </Button>,
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => handleOpenEdit(spec, e)}
                    >
                      Editar
                    </Button>,
                    <Button
                      type="text"
                      size="small"
                      icon={<BranchesOutlined />}
                      onClick={(e) => handleOpenVersionModal(spec, e)}
                    >
                      v{spec.version}
                    </Button>,
                  ]}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <FileTextOutlined className="text-loft-orange text-base shrink-0" />
                        <span className="font-bold text-sm text-loft-dark group-hover:text-loft-orange transition line-clamp-1">
                          {spec.title || spec.name}
                        </span>
                      </div>
                      <Tag color={spec.category?.includes('Frontend') ? 'blue' : 'purple'} className="shrink-0 text-[10px]">
                        {spec.category?.includes('Frontend') ? 'Frontend' : 'Backend'}
                      </Tag>
                    </div>

                    <p className="text-xs text-loft-muted line-clamp-3 mb-4 leading-relaxed">
                      {spec.summary || spec.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-auto">
                      {spec.tags?.map((t) => (
                        <Tag
                          key={t}
                          className="text-[10px] cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(t);
                          }}
                        >
                          {t}
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
              Exibindo {paginatedSpecs.length} de {filteredSpecs.length} especificações SDD
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredSpecs.length}
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

      {/* Rich Markdown Reader Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2">
              <FileTextOutlined className="text-loft-orange text-lg" />
              <span className="font-bold text-loft-dark text-base">
                {selectedSpec?.title || selectedSpec?.name}
              </span>
              <Tag color="orange" className="font-mono font-bold">
                v{selectedSpec?.version}
              </Tag>
            </div>
          </div>
        }
        open={viewerModalOpen}
        onCancel={() => setViewerModalOpen(false)}
        width={1000}
        centered
        destroyOnClose
        styles={{
          body: {
            maxHeight: 'calc(85vh - 140px)',
            overflowY: 'auto',
          },
        }}
        footer={[
          <Button
            key="copy"
            icon={<CopyOutlined />}
            onClick={() => {
              if (selectedSpec) handleCopyContent(selectedSpec);
            }}
          >
            Copiar Conteúdo
          </Button>,
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={() => {
              if (selectedSpec) handleDownloadMarkdown(selectedSpec);
            }}
          >
            Baixar .MD
          </Button>,
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              if (selectedSpec) {
                setViewerModalOpen(false);
                handleOpenEdit(selectedSpec);
              }
            }}
          >
            Editar
          </Button>,
          <Button
            key="version"
            icon={<BranchesOutlined />}
            onClick={() => {
              if (selectedSpec) {
                handleOpenVersionModal(selectedSpec);
              }
            }}
          >
            Histórico & Versões
          </Button>,
          <Button
            key="360"
            type="primary"
            icon={<CompassOutlined />}
            className="bg-loft-orange hover:bg-[#D9532B] border-none"
            onClick={() => {
              if (selectedSpec) {
                handleOpen360(selectedSpec);
                setViewerModalOpen(false);
              }
            }}
          >
            360° Inspector
          </Button>,
        ]}
      >
        {selectedSpec && (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs text-loft-muted flex items-center justify-between">
              <div>
                <b className="text-loft-dark">Resumo Executivo:</b> {selectedSpec.summary || selectedSpec.description}
              </div>
              <Tag color={selectedSpec.category?.includes('Frontend') ? 'blue' : 'purple'}>
                {selectedSpec.category}
              </Tag>
            </div>

            <Tabs
              activeKey={viewerTab}
              onChange={(k: string) => setViewerTab(k as any)}
              items={[
                {
                  key: 'preview',
                  label: 'Visualização Formatada (Markdown)',
                  children: (
                    <div className="p-5 bg-white border border-loft-border rounded-xl">
                      <MarkdownViewer content={selectedSpec.content || ''} />
                    </div>
                  ),
                },
                {
                  key: 'raw',
                  label: 'Código Fonte Markdown',
                  children: (
                    <div className="p-4 bg-[#0F172A] rounded-xl">
                      <pre className="text-[#CBD5E1] font-mono text-xs whitespace-pre-wrap leading-relaxed">
                        {selectedSpec.content}
                      </pre>
                    </div>
                  ),
                },
                {
                  key: 'meta',
                  label: 'Relacionamentos & Metadados',
                  children: (
                    <div className="space-y-3 p-4 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-loft-dark">Componentes Relacionados:</span>{' '}
                        {selectedSpec.related_components?.join(', ') || 'Nenhum'}
                      </div>
                      <div>
                        <span className="font-bold text-loft-dark">Regras Associadas:</span>{' '}
                        {selectedSpec.related_rules?.join(', ') || 'Nenhuma'}
                      </div>
                      <div>
                        <span className="font-bold text-loft-dark">Templates de Referência:</span>{' '}
                        {selectedSpec.related_templates?.join(', ') || 'Nenhum'}
                      </div>
                      <div>
                        <span className="font-bold text-loft-dark">Arquiteturas:</span>{' '}
                        {selectedSpec.related_architectures?.join(', ') || 'Nenhuma'}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Create / Edit Specification Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-loft-orange" />
            <span>{editingSpec ? 'Editar Especificação SDD' : 'Nova Especificação Técnica SDD'}</span>
          </div>
        }
        open={formModalOpen}
        onCancel={() => setFormModalOpen(false)}
        footer={null}
        width={850}
        centered
        destroyOnClose
        styles={{
          body: {
            maxHeight: 'calc(85vh - 100px)',
            overflowY: 'auto',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveForm}
          className="pt-2 pr-1"
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Título da Especificação"
                rules={[{ required: true, message: 'Informe o título' }]}
              >
                <Input placeholder="Ex: Loft Backend AI Specification" />
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
                    { label: 'Frontend Specification', value: 'Frontend Specification' },
                    { label: 'Backend Specification', value: 'Backend Specification' },
                    { label: 'Architecture Specification', value: 'Architecture Specification' },
                    { label: 'Security Specification', value: 'Security Specification' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="summary"
            label="Resumo Executivo"
            rules={[{ required: true, message: 'Informe um resumo da especificação' }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Breve descrição do escopo, padrões e objetivos desta especificação..."
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Conteúdo Markdown Completo"
            rules={[{ required: true, message: 'Informe o conteúdo da especificação' }]}
          >
            <Input.TextArea
              rows={8}
              className="font-mono text-xs"
              placeholder="# Título da Especificação..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Adicione tags (ex: frontend, security, sdd)"
                  options={allTags.map((t) => ({ label: t, value: t }))}
                />
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
                    { label: 'Published', value: 'Published' },
                    { label: 'Draft', value: 'Draft' },
                    { label: 'Deprecated', value: 'Deprecated' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex items-center justify-between pt-4 border-t border-loft-border">
            {editingSpec ? (
              <Popconfirm
                title="Excluir permanentemente do banco de dados?"
                description={
                  <div className="max-w-[280px] text-xs text-loft-muted">
                    Esta ação removerá a especificação <strong>{editingSpec.title || editingSpec.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
                  </div>
                }
                okText="Sim, excluir permanentemente"
                cancelText="Cancelar"
                okButtonProps={{ danger: true, loading: formSubmitting, className: 'bg-[#E12D39]' }}
                onConfirm={async () => {
                  try {
                    await catalogService.deleteSpecification(editingSpec.id);
                    message.success(`Especificação '${editingSpec.title || editingSpec.name}' excluída com sucesso do banco de dados!`);
                    setFormModalOpen(false);
                    fetchSpecs();
                  } catch (err: any) {
                    message.error(err.message || 'Falha ao excluir especificação');
                  }
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Excluir Especificação
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
                {editingSpec ? 'Salvar Alterações' : 'Criar Especificação'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Universal Versioning Modal */}
      {versionTargetSpec && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="specification"
          entityId={versionTargetSpec.id}
          entityName={versionTargetSpec.title || versionTargetSpec.name || ''}
          currentVersion={versionTargetSpec.version || '1.0.0'}
          versions={versionTargetSpec.versions}
          onSuccess={fetchSpecs}
        />
      )}
    </div>
  );
};
