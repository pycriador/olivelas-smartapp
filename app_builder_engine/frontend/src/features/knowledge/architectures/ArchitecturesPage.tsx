import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Tag,
  Button,
  Input,
  Select,
  Pagination,
  Modal,
  message,
  Space,
  Form,
  Popconfirm,
  Row,
  Col,
  Tabs,
} from 'antd';
import {
  ApartmentOutlined,
  BuildOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  StopOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { EntityVersionModal } from '@/components/ui/EntityVersionModal';
import { catalogService } from '@/services/catalog.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { useUIStore } from '@/stores/uiStore';
import { navigateTo } from '@/router/navigation';
import type { Architecture } from '@/types/domain.types';

export const ArchitecturesPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [totalArchitectures, setTotalArchitectures] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  // URL-synced & Server-Side Pagination
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(4);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingArch, setEditingArch] = useState<Architecture | null>(null);
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Detail / Structure Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedArch, setSelectedArch] = useState<Architecture | null>(null);

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetArch, setVersionTargetArch] = useState<Architecture | null>(null);

  const fetchArchitectures = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await catalogService.getArchitecturesPaginated({
        search: search || undefined,
        category: categoryFilter,
        page: currentPage,
        page_size: pageSize,
      });
      setArchitectures(res.data);
      setTotalArchitectures(res.meta?.total ?? res.data.length);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar arquiteturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchitectures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, categoryFilter]);

  const filteredArchitectures = useMemo(() => ({ length: totalArchitectures }), [totalArchitectures]);
  const paginatedArchitectures = architectures;

  useEffect(() => {
    if (formModalOpen) {
      if (editingArch) {
        form.setFieldsValue({
          name: editingArch.name,
          category: editingArch.category || 'Pattern',
          description: editingArch.description,
          layers: editingArch.layers || [],
          characteristics: editingArch.characteristics || [],
          recommended_for: editingArch.recommended_for || [],
          restrictions: editingArch.restrictions || [],
          folder_tree:
            typeof editingArch.folder_tree === 'string'
              ? editingArch.folder_tree
              : JSON.stringify(editingArch.folder_tree || editingArch.canonical_folder_structure, null, 2),
          version: editingArch.version || '1.0.0',
          status: editingArch.status || 'Published',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          category: 'Pattern',
          version: '1.0.0',
          status: 'Published',
          layers: ['Presentation (React)', 'API (FastAPI)', 'Services', 'Domain', 'Database (PostgreSQL)'],
          characteristics: ['Alta manutenibilidade', 'Validação estrita de contratos'],
          recommended_for: ['Sistemas web internos', 'Portais B2B'],
          restrictions: ['Não usar chamadas diretas de banco no frontend'],
          folder_tree: 'src/\n├── api/\n├── domain/\n├── services/\n└── static/',
        });
      }
    }
  }, [formModalOpen, editingArch, form]);

  const handleOpenCreate = () => {
    setEditingArch(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (arch: Architecture, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingArch(arch);
    setFormModalOpen(true);
  };

  const handleSaveForm = async (values: any) => {
    setFormSubmitting(true);
    try {
      if (editingArch) {
        await catalogService.updateArchitecture(editingArch.id, values);
        message.success(`Arquitetura '${values.name}' atualizada com sucesso!`);
      } else {
        await catalogService.createArchitecture(values);
        message.success(`Arquitetura '${values.name}' criada com sucesso!`);
      }
      setFormModalOpen(false);
      fetchArchitectures();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar arquitetura');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (arch: Architecture, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await catalogService.deleteArchitecture(arch.id);
      message.success(`Arquitetura '${arch.name}' removida com sucesso!`);
      if (selectedArch?.id === arch.id) setDetailModalOpen(false);
      fetchArchitectures();
    } catch (err: any) {
      message.error(err.message || 'Falha ao remover arquitetura');
    }
  };

  const handleOpenVersionModal = (arch: Architecture, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetArch(arch);
    setVersionModalOpen(true);
  };

  const handleOpenDetail = (arch: Architecture, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedArch(arch);
    setDetailModalOpen(true);
  };

  const handleOpen360 = (arch: Architecture, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/knowledge/architectures', { id: arch.id, type: 'architecture' });
    openInspector360('architecture', arch.id);
  };

  const handleUseInWorkshop = (arch: Architecture, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/workshop', { architectureId: arch.id });
    message.success(`Arquitetura '${arch.name}' selecionada no Workshop!`);
  };

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(architectures.map((a) => a.category).filter(Boolean)));
  }, [architectures]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Arquiteturas Padrão da Olivelas"
        subtitle="Modelos estruturais certificados (Modular Monolith, Fullstack Layered, Event-Driven). CRUD completo e versionamento SemVer."
        breadcrumbs={[
          { title: 'Knowledge Base', href: '/knowledge' },
          { title: 'Arquiteturas' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchArchitectures}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Nova Arquitetura
            </Button>
          </Space>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar por arquitetura, descrição ou camadas..."
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
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState tip="Carregando arquiteturas do catálogo..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchArchitectures} />
      ) : filteredArchitectures.length === 0 ? (
        <EmptyState
          title="Nenhuma arquitetura encontrada"
          description="Ajuste os filtros de busca ou crie uma nova arquitetura padrão."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {paginatedArchitectures.map((arch) => (
            <Card
              key={arch.id}
              hoverable
              styles={{ body: { padding: '24px' } }}
              className="border-loft-border rounded-xl shadow-xs hover:shadow-md hover:border-[#F56738]/40 transition-all duration-200 cursor-pointer group"
              onClick={() => handleOpenDetail(arch)}
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                    <ApartmentOutlined className="text-loft-orange text-lg" />
                    <span className="font-bold text-base text-loft-dark group-hover:text-loft-orange transition">
                      {arch.name}
                    </span>
                    <Tag color="blue">{arch.category || 'Pattern'}</Tag>
                    <Tag color="orange" className="font-mono">v{arch.version || '1.0.0'}</Tag>
                  </div>

                  <p className="text-xs text-loft-muted mb-4 leading-relaxed">
                    {arch.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <div className="p-3.5 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs">
                      <div className="font-bold text-loft-dark mb-1.5 flex items-center gap-1.5">
                        <CheckCircleOutlined className="text-emerald-500" /> Características
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-loft-muted">
                        {arch.characteristics?.slice(0, 3).map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs">
                      <div className="font-bold text-loft-dark mb-1.5 flex items-center gap-1.5">
                        <BuildOutlined className="text-blue-500" /> Recomendado Para
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-loft-muted">
                        {arch.recommended_for?.slice(0, 3).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs">
                      <div className="font-bold text-loft-dark mb-1.5 flex items-center gap-1.5">
                        <StopOutlined className="text-rose-500" /> Restrições
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-loft-muted">
                        {arch.restrictions?.slice(0, 3).map((res, i) => (
                          <li key={i}>{res}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-1 border-t border-[#F0F4F8]">
                    <span className="text-xs text-[#829AB1] font-medium mr-1">Camadas:</span>
                    {arch.layers?.map((layer) => (
                      <Tag key={layer} className="text-xs font-mono m-0">
                        {layer}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex lg:flex-col gap-2 w-full lg:w-36">
                  <Button
                    type="primary"
                    icon={<BuildOutlined />}
                    onClick={(e) => handleUseInWorkshop(arch, e)}
                    className="bg-loft-orange hover:bg-[#D9532B] border-none text-xs"
                  >
                    Usar no Studio
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={(e) => handleOpenDetail(arch, e)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(e) => handleOpenEdit(arch, e)}
                  >
                    Editar
                  </Button>
                  <Button
                    icon={<BranchesOutlined />}
                    size="small"
                    onClick={(e) => handleOpenVersionModal(arch, e)}
                  >
                    Versionar
                  </Button>
                  <Button
                    icon={<CompassOutlined />}
                    size="small"
                    onClick={(e) => handleOpen360(arch, e)}
                  >
                    360°
                  </Button>
                  <Popconfirm
                    title="Excluir arquitetura?"
                    description="Tem certeza que deseja excluir esta arquitetura do catálogo?"
                    onConfirm={(e) => handleDelete(arch, e)}
                    okText="Excluir"
                    cancelText="Cancelar"
                  >
                    <Button size="small" danger icon={<DeleteOutlined />}>
                      Excluir
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-loft-border shadow-2xs">
            <span className="text-xs text-loft-muted font-medium">
              Exibindo {paginatedArchitectures.length} de {filteredArchitectures.length} arquiteturas
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredArchitectures.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={['4', '8', '16']}
            />
          </div>
        </div>
      )}

      {/* Detail & Structure Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ApartmentOutlined className="text-loft-orange" />
            <span>{selectedArch?.name}</span>
            <Tag color="orange" className="font-mono">v{selectedArch?.version || '1.0.0'}</Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width={900}
        centered
        styles={{
          body: {
            maxHeight: 'calc(85vh - 140px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
        destroyOnClose
        footer={[
          <Button key="edit" icon={<EditOutlined />} onClick={() => {
            if (selectedArch) {
              setDetailModalOpen(false);
              handleOpenEdit(selectedArch);
            }
          }}>
            Editar
          </Button>,
          <Button key="version" icon={<BranchesOutlined />} onClick={() => selectedArch && handleOpenVersionModal(selectedArch)}>
            Versões
          </Button>,
          <Button
            key="studio"
            type="primary"
            icon={<BuildOutlined />}
            className="bg-loft-orange border-none"
            onClick={() => selectedArch && handleUseInWorkshop(selectedArch)}
          >
            Abrir no Blueprint Studio
          </Button>,
        ]}
      >
        {selectedArch && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#486581] leading-relaxed">
              {selectedArch.description}
            </p>

            <Tabs
              items={[
                {
                  key: 'structure',
                  label: 'Estrutura Canônica de Pastas',
                  children: (
                    <div className="p-4 bg-[#0F172A] rounded-xl overflow-x-auto max-h-[50vh]">
                      <pre className="text-[#38BDF8] font-mono text-xs whitespace-pre leading-relaxed">
                        {typeof selectedArch.folder_tree === 'string'
                          ? selectedArch.folder_tree
                          : JSON.stringify(selectedArch.folder_tree || selectedArch.canonical_folder_structure, null, 2)}
                      </pre>
                    </div>
                  ),
                },
                {
                  key: 'rules',
                  label: 'Diretrizes & Restrições',
                  children: (
                    <div className="space-y-3 p-4 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs">
                      <div>
                        <div className="font-bold text-loft-dark mb-1">Recomendado Para:</div>
                        <ul className="list-disc pl-4 text-[#486581] space-y-1">
                          {selectedArch.recommended_for?.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-bold text-loft-dark mb-1">Restrições Mandatórias:</div>
                        <ul className="list-disc pl-4 text-loft-error space-y-1">
                          {selectedArch.restrictions?.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Create / Edit Architecture Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ApartmentOutlined className="text-loft-orange" />
            <span>{editingArch ? 'Editar Arquitetura' : 'Nova Arquitetura Padrão'}</span>
          </div>
        }
        open={formModalOpen}
        onCancel={() => setFormModalOpen(false)}
        footer={null}
        width={800}
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
                label="Nome da Arquitetura"
                rules={[{ required: true, message: 'Informe o nome' }]}
              >
                <Input placeholder="Ex: Modular Monolith Enterprise" />
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
                    { value: 'Pattern', label: 'Pattern' },
                    { value: 'Framework', label: 'Framework' },
                    { value: 'Integration', label: 'Integration' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Descrição Geral"
            rules={[{ required: true, message: 'Informe a descrição' }]}
          >
            <Input.TextArea rows={3} placeholder="Descreva os princípios estruturais e objetivo desta arquitetura..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="characteristics" label="Características (Linhas separadas)">
                <Select mode="tags" placeholder="Ex: Alta coesão, Baixo acoplamento" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="layers" label="Camadas Arquiteturais">
                <Select mode="tags" placeholder="Ex: API, Service, Repository" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="recommended_for" label="Recomendado Para">
                <Select mode="tags" placeholder="Ex: Aplicações B2B, Painéis Administrativos" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="restrictions" label="Restrições Mandatórias">
                <Select mode="tags" placeholder="Ex: Não importar DB no React" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="folder_tree" label="Estrutura de Pastas Canônica">
            <Input.TextArea rows={6} className="font-mono text-xs" placeholder="src/&#10;├── api/&#10;└── domain/" />
          </Form.Item>

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
            {editingArch ? (
              <Popconfirm
                title="Excluir permanentemente do banco de dados?"
                description={
                  <div className="max-w-[280px] text-xs text-loft-muted">
                    Esta ação removerá a arquitetura <strong>{editingArch.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
                  </div>
                }
                okText="Sim, excluir permanentemente"
                cancelText="Cancelar"
                okButtonProps={{ danger: true, loading: formSubmitting, className: 'bg-[#E12D39]' }}
                onConfirm={async () => {
                  try {
                    await catalogService.deleteArchitecture(editingArch.id);
                    message.success(`Arquitetura '${editingArch.name}' excluída com sucesso do banco de dados!`);
                    setFormModalOpen(false);
                    fetchArchitectures();
                  } catch (err: any) {
                    message.error(err.message || 'Falha ao excluir arquitetura');
                  }
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Excluir Arquitetura
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
                {editingArch ? 'Salvar Alterações' : 'Criar Arquitetura'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Universal Versioning Modal */}
      {versionTargetArch && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="architecture"
          entityId={versionTargetArch.id}
          entityName={versionTargetArch.name}
          currentVersion={versionTargetArch.version || '1.0.0'}
          versions={versionTargetArch.versions}
          onSuccess={fetchArchitectures}
        />
      )}
    </div>
  );
};
