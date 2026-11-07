import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Drawer,
  Tabs,
  message,
  Pagination,
  Tooltip,
  Form,
  Popconfirm,
  Row,
  Col,
  Radio,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  EditOutlined,
  BranchesOutlined,
  FolderOpenOutlined,
  ApartmentOutlined,
  BlockOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  RocketOutlined,
  PlayCircleOutlined,
  ExportOutlined,
  CodeOutlined,
  InboxOutlined,
  UndoOutlined,
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';
import { EntityVersionModal } from '@/components/ui/EntityVersionModal';
import { projectsService } from '@/services/projects.service';
import { catalogService } from '@/services/catalog.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { CreateProjectModal } from './CreateProjectModal';
import type { Project, Architecture, Module, Component, Template } from '@/types/domain.types';

// Helper to determine dynamic icons based on database attributes
const getProjectIcon = (p: Project): string => {
  const text = `${p.tags?.join(' ') || ''} ${p.domain || ''} ${p.name || ''} ${p.slug || ''}`.toLowerCase();
  if (text.includes('noticia') || text.includes('midia') || text.includes('conteudo')) return '📰';
  if (text.includes('chatbot') || text.includes('suporte') || text.includes('atendimento')) return '🤖';
  if (text.includes('usuario') || text.includes('grupo') || text.includes('iam') || text.includes('rbac')) return '👥';
  if (text.includes('imove') || text.includes('venda') || text.includes('real-estate')) return '🏠';
  if (text.includes('wiki') || text.includes('pratica') || text.includes('prompt') || text.includes('conhecimento')) return '📚';
  if (text.includes('ai') || text.includes('gemini') || text.includes('llm')) return '✨';
  if (text.includes('fianca') || text.includes('credito') || text.includes('aluguel') || text.includes('finance')) return '💳';
  return '⚡';
};

// Helper to dynamically resolve launch URL from project slug or ID
const getProjectLaunchUrl = (p: Project): string => {
  if (p.slug) {
    return `/generated_apps/${p.slug}/index.html`;
  }
  return `/generated_apps/${p.id.replace('prj_', '')}/index.html`;
};

// Helper to identify generated apps dynamically from tags or ID pattern
const isGeneratedApp = (p: Project): boolean => {
  return Boolean(
    p.tags?.includes('generated-app') ||
    p.id.startsWith('prj_app') ||
    p.slug?.startsWith('app')
  );
};

const isArchived = (p: Project): boolean => {
  return (
    (p.status && p.status.toLowerCase() === 'archived') ||
    p.tags?.includes('archived') ||
    false
  );
};

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active View Tab: 'generated' | 'all' | 'corporate' | 'archived'
  const [activeTab, setActiveTab] = useState<string>('generated');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [domainFilter, setDomainFilter] = useState<string | undefined>(undefined);

  // URL-synced & Server-Side Pagination
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(6);
  const [pagedProjects, setPagedProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Live Preview Drawer
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [previewApp, setPreviewApp] = useState<{ title: string; url: string; version?: string } | null>(null);
  const [previewIframeKey, setPreviewIframeKey] = useState(1);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetProj, setVersionTargetProj] = useState<Project | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pagedRes, allList, archList, modData, compData, tplData] = await Promise.all([
        projectsService.getProjectsPaginated({
          search: search || undefined,
          status: statusFilter,
          domain: domainFilter,
          category: activeTab,
          page: currentPage,
          page_size: pageSize,
        }),
        projectsService.getProjects(),
        catalogService.getArchitectures(),
        catalogService.getModules(),
        catalogService.getComponents(),
        catalogService.getTemplates(),
      ]);
      setPagedProjects(pagedRes.data);
      setTotalProjects(pagedRes.meta?.total ?? pagedRes.data.length);
      setProjects(allList);
      setArchitectures(archList);
      setModules(modData);
      setComponents(compData);
      setTemplates(tplData);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, activeTab, search, statusFilter, domainFilter]);

  const generatedProjects = useMemo(() => {
    return projects.filter((p) => isGeneratedApp(p) && !isArchived(p));
  }, [projects]);

  const corporateProjects = useMemo(() => {
    return projects.filter((p) => !isGeneratedApp(p) && !isArchived(p));
  }, [projects]);

  const archivedProjects = useMemo(() => {
    return projects.filter(isArchived);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return { length: totalProjects };
  }, [totalProjects]);

  const paginatedProjects = pagedProjects;

  const handleDuplicate = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await projectsService.duplicateProject(id);
      message.success('Projeto duplicado com sucesso!');
      fetchData();
    } catch (err: any) {
      message.error(`Erro ao duplicar: ${err.message}`);
    }
  };

  const handleArchive = async (id: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await projectsService.archiveProject(id);
      message.success(`Projeto '${name}' arquivado com sucesso! Você pode acessá-lo na aba 'Arquivados'.`);
      if (selectedProject?.id === id) setDetailModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(`Erro ao arquivar: ${err.message}`);
    }
  };

  const handleUnarchive = async (id: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await projectsService.unarchiveProject(id);
      message.success(`Projeto '${name}' reativado com sucesso!`);
      if (selectedProject?.id === id) setDetailModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(`Erro ao reativar: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await projectsService.deleteProject(id);
      message.success(`Projeto '${name}' excluído permanentemente da base SQLite!`);
      if (selectedProject?.id === id) setDetailModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(`Erro ao excluir: ${err.message}`);
    }
  };

  useEffect(() => {
    if (editModalOpen && editingProject) {
      form.setFieldsValue({
        name: editingProject.name,
        description: editingProject.description,
        domain: editingProject.domain,
        owner: editingProject.owner || 'willian.jesus@olivelas.com.br',
        status: editingProject.status,
        version: (editingProject as any).version || '1.0.0',
        architecture_id: editingProject.architecture_id || editingProject.architecture,
        modules: editingProject.modules || [],
        components: editingProject.components || [],
        templates: editingProject.templates || [],
        requirements: editingProject.requirements || [],
        tags: editingProject.tags || [],
      });
    }
  }, [editModalOpen, editingProject, form]);

  const handleOpenEdit = (p: Project, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingProject(p);
    setEditModalOpen(true);
  };

  const handleOpenVersionModal = (p: Project, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetProj(p);
    setVersionModalOpen(true);
  };

  const handleOpenDetail = (p: Project, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProject(p);
    setDetailModalOpen(true);
  };

  const handleLaunchApp = (url: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    window.open(url, '_blank');
  };

  const handlePreviewApp = (title: string, url: string, version?: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPreviewApp({ title, url, version });
    setPreviewIframeKey((prev) => prev + 1);
    setPreviewViewport('desktop');
    setPreviewDrawerOpen(true);
  };

  const handleSaveEdit = async (values: any) => {
    if (!editingProject) return;
    setFormSubmitting(true);
    try {
      await projectsService.updateProject(editingProject.id, values);
      message.success(`Projeto '${values.name}' atualizado com sucesso!`);
      setEditModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar projeto');
    } finally {
      setFormSubmitting(false);
    }
  };

  const uniqueDomains = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.domain).filter(Boolean)));
  }, [projects]);

  const columns: ColumnsType<Project> = [
    {
      title: 'Projeto / Aplicação',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => {
        const icon = getProjectIcon(record);
        return (
          <div
            className="cursor-pointer hover:text-loft-orange transition font-semibold"
            onClick={() => handleOpenDetail(record)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <div>
                <div className="text-sm text-loft-dark font-bold">
                  {name}
                </div>
                <div className="text-xs text-loft-muted font-mono">{record.slug || record.id}</div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Domínio',
      dataIndex: 'domain',
      key: 'domain',
      render: (domain) => <Tag color="orange">{domain || 'Geral'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const isGen = isGeneratedApp(record);
        return (
          <Space>
            <StatusBadge status={status} />
            {isGen && <Tag color="green" className="font-semibold text-[10px]">Live Demo</Tag>}
          </Space>
        );
      },
    },
    {
      title: 'Versão',
      key: 'version',
      render: (_, record) => (
        <Tooltip title="Clique para gerenciar versões, histórico e rollback">
          <Button
            size="small"
            type="dashed"
            icon={<BranchesOutlined className="text-loft-orange" />}
            onClick={(e) => handleOpenVersionModal(record, e)}
            className="font-mono text-xs font-semibold hover:border-loft-orange"
          >
            v{(record as any).version || '1.0.0'}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: 'Ações & Execução',
      key: 'actions',
      render: (_, record) => {
        const isGen = isGeneratedApp(record);
        const launchPath = getProjectLaunchUrl(record);
        const archived = isArchived(record);
        return (
          <Space size="small">
            {isGen && (
              <Tooltip title="Abrir aplicação em nova janela">
                <Button
                  size="small"
                  type="primary"
                  icon={<RocketOutlined />}
                  onClick={(e) => handleLaunchApp(launchPath, e)}
                  className="bg-loft-orange hover:bg-[#D9532B] border-none font-medium"
                >
                  Abrir
                </Button>
              </Tooltip>
            )}
            {isGen && (
              <Tooltip title="Visualizar em Tela (Live Preview)">
                <Button
                  size="small"
                  icon={<PlayCircleOutlined />}
                  onClick={(e) =>
                    handlePreviewApp(
                      record.name,
                      launchPath,
                      (record as any).version || '1.0.0',
                      e
                    )
                  }
                >
                  Preview
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Detalhes do Blueprint">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={(e) => handleOpenDetail(record, e)}
              />
            </Tooltip>
            <Tooltip title="Editar Projeto">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => handleOpenEdit(record, e)}
              />
            </Tooltip>
            <Tooltip title="Histórico de Releases & Rollback">
              <Button
                size="small"
                icon={<BranchesOutlined />}
                onClick={(e) => handleOpenVersionModal(record, e)}
              />
            </Tooltip>
            <Tooltip title="Duplicar">
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={(e) => handleDuplicate(record.id, e)}
              />
            </Tooltip>
            {archived ? (
              <Tooltip title="Reativar / Desarquivar Projeto">
                <Button
                  size="small"
                  type="primary"
                  icon={<UndoOutlined />}
                  className="bg-emerald-600 hover:bg-emerald-700 border-none text-white text-xs"
                  onClick={(e) => handleUnarchive(record.id, record.name, e)}
                />
              </Tooltip>
            ) : (
              <Popconfirm
                title="Arquivar projeto?"
                description={`Deseja mover o projeto "${record.name}" para a aba de Arquivados?`}
                onConfirm={(e) => handleArchive(record.id, record.name, e)}
                okText="Arquivar"
                cancelText="Cancelar"
              >
                <Tooltip title="Arquivar Projeto">
                  <Button size="small" icon={<InboxOutlined />} />
                </Tooltip>
              </Popconfirm>
            )}
            <Popconfirm
              title="Excluir permanentemente?"
              description={`Deseja excluir definitivamente o projeto "${record.name}" da base de dados?`}
              onConfirm={(e) => handleDelete(record.id, record.name, e)}
              okText="Excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Excluir Permanentemente">
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projetos & Aplicações da Olivelas"
        subtitle="Catálogo completo de aplicações corporativas e soluções autônomas geradas por IA (generated_apps). Conexão direta às APIs, governança de Blueprints e controle de releases estilo GitHub."
        breadcrumbs={[
          { title: 'Workspaces', href: '/projects' },
          { title: 'Projetos' },
        ]}
        actions={
          <Space>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => window.open('/generated_apps/evidencias_api_e_ia.html', '_blank')}
            >
              Evidências de API & IA ↗
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Novo Projeto
            </Button>
          </Space>
        }
      />

      {/* Top Highlight Banner */}
      <div className="bg-linear-to-r from-[#FFF5F0] via-[#FFF9F6] to-[#FFFFFF] p-5 rounded-2xl border border-loft-orange/20 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-loft-orange text-white flex items-center justify-center text-2xl shadow-xs">
            🚀
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-loft-dark m-0">
                Central de Aplicações Geradas ({generatedProjects.length} Aplicações no Banco de Dados)
              </h3>
              <Tag color="green" className="font-bold">
                100% Dinâmico & Conectado
              </Tag>
            </div>
            <p className="text-xs text-loft-muted m-0 mt-0.5 max-w-3xl">
              Cada aplicação possui controle de versionamento completo, snapshots históricos congelados, rollback em 1 clique e visualização interativa em tela responsiva.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        activeKey={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          resetToFirstPage();
        }}
        className="copan-tabs"
        items={[
          {
            key: 'generated',
            label: (
              <span className="flex items-center gap-2 font-semibold">
                <RocketOutlined /> Aplicações Geradas ({generatedProjects.length})
              </span>
            ),
          },
          {
            key: 'all',
            label: (
              <span className="flex items-center gap-2 font-semibold">
                <AppstoreOutlined /> Todos os Projetos ({projects.length})
              </span>
            ),
          },
          {
            key: 'corporate',
            label: (
              <span className="flex items-center gap-2 font-semibold">
                <ApartmentOutlined /> Projetos Corporativos ({corporateProjects.length})
              </span>
            ),
          },
          {
            key: 'archived',
            label: (
              <span className="flex items-center gap-2 font-semibold text-[#829AB1]">
                <InboxOutlined /> 📦 Arquivados ({archivedProjects.length})
              </span>
            ),
          },
        ]}
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar aplicações por nome, domínio ou descrição..."
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
            placeholder="Domínio de Negócio"
            allowClear
            value={domainFilter}
            onChange={(val) => {
              setDomainFilter(val);
              resetToFirstPage();
            }}
            className="w-56"
            options={uniqueDomains.map((d) => ({ label: d, value: d }))}
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
              { value: 'Active', label: 'Active' },
              { value: 'Planning', label: 'Planning' },
              { value: 'Ready', label: 'Ready' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Archived', label: 'Archived' },
            ]}
          />
        </div>
        <div className="text-xs text-loft-muted font-medium">
          Exibindo {filteredProjects.length} resultado(s)
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingState tip="Carregando projetos e aplicações..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'archived'
              ? 'Nenhum projeto arquivado'
              : 'Nenhuma aplicação encontrada'
          }
          description={
            activeTab === 'archived'
              ? 'Projetos arquivados aparecem nesta seção e podem ser reativados a qualquer momento.'
              : 'Ajuste os filtros de busca ou crie uma nova aplicação a partir de um blueprint.'
          }
        />
      ) : activeTab === 'generated' ? (
        /* Rich Card Grid for Generated Apps with Full Dynamic Rendering and Pagination */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((p) => {
              const icon = getProjectIcon(p);
              const launchPath = getProjectLaunchUrl(p);
              const pVersion = (p as any).version || '1.0.0';

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-loft-border hover:border-loft-orange/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 overflow-hidden group"
                >
                  <div>
                    {/* Card Top Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl p-2 bg-[#FAFBFD] rounded-xl border border-loft-border group-hover:scale-110 transition-transform">
                          {icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Tag color="orange" className="font-semibold text-[11px] m-0">
                              {p.domain || 'Olivelas App'}
                            </Tag>
                            <Tag color="green" className="font-semibold text-[10px] m-0">
                              Live Demo
                            </Tag>
                          </div>
                          <Tooltip title="Clique para gerenciar versões e rollback">
                            <Button
                              type="link"
                              size="small"
                              icon={<BranchesOutlined className="text-loft-orange" />}
                              onClick={(e) => handleOpenVersionModal(p, e)}
                              className="text-[11px] font-mono p-0 h-auto text-loft-muted hover:text-loft-orange font-bold mt-0.5"
                            >
                              v{pVersion}
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    {/* Card Title & Description */}
                    <h3
                      className="text-base font-bold text-loft-dark group-hover:text-loft-orange transition cursor-pointer mb-2"
                      onClick={() => handleOpenDetail(p)}
                    >
                      {p.name}
                    </h3>
                    <p className="text-xs text-loft-muted line-clamp-3 mb-4 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Domain & Architecture */}
                    <div className="bg-[#FAFBFD] p-3 rounded-xl border border-loft-border mb-4 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-loft-muted">Identificador:</span>
                        <span className="font-mono text-[11px] text-loft-dark">{p.slug || p.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-loft-muted">Blueprint:</span>
                        <span className="font-mono text-[11px] text-loft-dark truncate max-w-[170px]">
                          {p.blueprint_id || 'bp_canonical'}
                        </span>
                      </div>
                    </div>

                    {/* Requirements / Features */}
                    {p.requirements && p.requirements.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[11px] font-bold text-loft-dark mb-1.5 flex items-center gap-1">
                          <CheckCircleOutlined className="text-[#0B6B4F]" /> Funcionalidades Integradas:
                        </div>
                        <div className="space-y-1">
                          {p.requirements.slice(0, 3).map((req, idx) => (
                            <div key={idx} className="text-[11px] text-[#486581] flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-loft-orange shrink-0" />
                              <span className="truncate">{req}</span>
                            </div>
                          ))}
                          {p.requirements.length > 3 && (
                            <div className="text-[10px] text-loft-muted pl-3 italic">
                              +{p.requirements.length - 3} outros requisitos
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Módulos & Componentes Vinculados */}
                    {p.modules && p.modules.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[11px] font-bold text-loft-dark mb-1.5 flex items-center gap-1">
                          <CodeOutlined className="text-loft-orange" /> Módulos Vinculados:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {p.modules.map((m) => (
                            <Tag key={m} className="font-mono text-[10px] bg-[#F0F4F8] text-[#334E68] border-none">
                              {m}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-4 border-t border-loft-border space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="primary"
                        icon={<RocketOutlined />}
                        onClick={(e) => handleLaunchApp(launchPath, e)}
                        className="bg-loft-orange hover:bg-[#D9532B] border-none font-bold text-xs w-full"
                      >
                        Abrir App ↗
                      </Button>
                      <Button
                        icon={<PlayCircleOutlined />}
                        onClick={(e) => handlePreviewApp(p.name, launchPath, pVersion, e)}
                        className="font-medium text-xs w-full"
                      >
                        Visualizar em Tela
                      </Button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={(e) => handleOpenDetail(p, e)}
                        className="text-xs p-0 text-loft-muted hover:text-loft-orange"
                      >
                        Detalhes
                      </Button>
                      <Space size="small">
                        <Tooltip title="Histórico de Versões & Releases">
                          <Button
                            size="small"
                            icon={<BranchesOutlined />}
                            onClick={(e) => handleOpenVersionModal(p, e)}
                          />
                        </Tooltip>
                        <Tooltip title="Editar Projeto">
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={(e) => handleOpenEdit(p, e)}
                          />
                        </Tooltip>
                        <Tooltip title="Duplicar">
                          <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={(e) => handleDuplicate(p.id, e)}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="Arquivar projeto?"
                          description={`Deseja mover o projeto "${p.name}" para a aba de Arquivados?`}
                          onConfirm={(e) => handleArchive(p.id, p.name, e)}
                          okText="Arquivar"
                          cancelText="Cancelar"
                        >
                          <Tooltip title="Arquivar">
                            <Button size="small" icon={<InboxOutlined />} />
                          </Tooltip>
                        </Popconfirm>
                        <Popconfirm
                          title="Excluir permanentemente?"
                          description={`Deseja excluir definitivamente o projeto "${p.name}"?`}
                          onConfirm={(e) => handleDelete(p.id, p.name, e)}
                          okText="Excluir"
                          cancelText="Cancelar"
                          okButtonProps={{ danger: true }}
                        >
                          <Tooltip title="Excluir">
                            <Button size="small" danger icon={<DeleteOutlined />} />
                          </Tooltip>
                        </Popconfirm>
                      </Space>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination for Generated Apps Cards View */}
          <div className="p-4 bg-white rounded-xl border border-loft-border flex justify-between items-center shadow-2xs">
            <span className="text-xs text-loft-muted">
              Total: {filteredProjects.length} aplicação(ões) gerada(s)
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProjects.length}
              onChange={(p, s) => {
                setCurrentPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={['6', '9', '12', '24']}
            />
          </div>
        </div>
      ) : (
        /* Table View for All, Corporate and Archived Projects */
        <div className="bg-white rounded-xl border border-loft-border overflow-hidden shadow-2xs">
          <Table
            columns={columns}
            dataSource={paginatedProjects}
            rowKey="id"
            pagination={false}
          />
          <div className="p-4 border-t border-loft-border flex justify-between items-center">
            <span className="text-xs text-loft-muted">
              Total: {filteredProjects.length} projeto(s)
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProjects.length}
              onChange={(p, s) => {
                setCurrentPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={['8', '16', '32']}
            />
          </div>
        </div>
      )}

      {/* Live App Interactive Preview Drawer with Responsive Viewport */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              <RocketOutlined className="text-loft-orange" />
              <span className="font-bold text-loft-dark text-base">{previewApp?.title}</span>
              <Tag color="green" className="font-semibold text-xs">
                Live Preview
              </Tag>
              {previewApp?.version && (
                <Tag color="blue" className="font-mono text-xs">
                  v{previewApp.version}
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Responsive Viewport Selector */}
              <Radio.Group
                size="small"
                value={previewViewport}
                onChange={(e) => setPreviewViewport(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="desktop">
                  <DesktopOutlined /> Desktop
                </Radio.Button>
                <Radio.Button value="tablet">
                  <TabletOutlined /> Tablet (768px)
                </Radio.Button>
                <Radio.Button value="mobile">
                  <MobileOutlined /> Mobile (375px)
                </Radio.Button>
              </Radio.Group>

              <Space>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={() => setPreviewIframeKey((k) => k + 1)}
                >
                  Recarregar
                </Button>
                <Button
                  size="small"
                  type="primary"
                  icon={<ExportOutlined />}
                  onClick={() => previewApp && handleLaunchApp(previewApp.url)}
                  className="bg-loft-orange hover:bg-[#D9532B] border-none"
                >
                  Nova Aba
                </Button>
              </Space>
            </div>
          </div>
        }
        open={previewDrawerOpen}
        onClose={() => setPreviewDrawerOpen(false)}
        width="90%"
        styles={{ body: { padding: 0, overflow: 'hidden', backgroundColor: '#F0F4F8' } }}
      >
        {previewApp && (
          <div className="w-full h-full flex flex-col">
            {/* Top address bar mockup */}
            <div className="bg-[#FAFBFD] px-4 py-2 border-b border-loft-border flex items-center justify-between text-xs text-loft-muted">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>
                  {window.location.origin}
                  {previewApp.url}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-loft-muted">
                <span>Modo: <b>{previewViewport.toUpperCase()}</b></span>
                <span>•</span>
                <span>FastAPI Backend Conectado</span>
              </div>
            </div>

            {/* Viewport Frame Container */}
            <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
              <div
                style={{
                  width:
                    previewViewport === 'mobile'
                      ? '375px'
                      : previewViewport === 'tablet'
                      ? '768px'
                      : '100%',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow:
                    previewViewport !== 'desktop'
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      : 'none',
                  borderRadius: previewViewport !== 'desktop' ? '12px' : '0px',
                  overflow: 'hidden',
                  border: previewViewport !== 'desktop' ? '2px solid #CBD2D9' : 'none',
                }}
                className="bg-white flex flex-col"
              >
                <iframe
                  key={previewIframeKey}
                  src={previewApp.url}
                  title={previewApp.title}
                  className="w-full h-full flex-1 border-none"
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Project Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FolderOpenOutlined className="text-loft-orange" />
            <span>Projeto: {selectedProject?.name}</span>
            <Tag color="orange" className="font-mono">
              v{(selectedProject as any)?.version || '1.0.0'}
            </Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width={750}
        footer={[
          selectedProject && isGeneratedApp(selectedProject) && (
            <Button
              key="launch"
              type="primary"
              icon={<RocketOutlined />}
              onClick={() => handleLaunchApp(getProjectLaunchUrl(selectedProject))}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Abrir Aplicação ↗
            </Button>
          ),
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              if (selectedProject) {
                const p = selectedProject;
                setDetailModalOpen(false);
                handleOpenEdit(p);
              }
            }}
          >
            Editar
          </Button>,
          <Button
            key="version"
            icon={<BranchesOutlined />}
            onClick={() => selectedProject && handleOpenVersionModal(selectedProject)}
          >
            Versões
          </Button>,
          <Button
            key="duplicate"
            icon={<CopyOutlined />}
            onClick={() => selectedProject && handleDuplicate(selectedProject.id)}
          >
            Duplicar Projeto
          </Button>,
        ]}
      >
        {selectedProject && (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs flex justify-between items-center">
              <div>
                <b className="text-loft-dark">Domínio:</b> {selectedProject.domain || 'Geral'} |{' '}
                <b className="text-loft-dark">Blueprint Base:</b> {selectedProject.blueprint_id || 'N/A'}
              </div>
              <StatusBadge status={selectedProject.status} />
            </div>

            <div className="p-4 bg-white border border-loft-border rounded-xl text-xs space-y-3">
              <div>
                <div className="font-bold text-loft-dark mb-1">Descrição do Projeto:</div>
                <MarkdownViewer content={selectedProject.description || ''} />
              </div>

              {selectedProject.requirements && selectedProject.requirements.length > 0 && (
                <div>
                  <div className="font-bold text-loft-dark mb-1">Requisitos & Funcionalidades:</div>
                  <ul className="list-disc pl-4 space-y-1 text-loft-muted">
                    {selectedProject.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.modules && selectedProject.modules.length > 0 && (
                <div>
                  <div className="font-bold text-loft-dark mb-1">Módulos Vinculados:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.modules.map((m) => (
                      <Tag key={m} color="blue">
                        {m}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.specifications && selectedProject.specifications.length > 0 && (
                <div>
                  <div className="font-bold text-loft-dark mb-1">Especificações Técnicas (SDDs):</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.specifications.map((s) => (
                      <Tag key={s} color="purple">
                        {s}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between pr-8 border-b border-loft-border pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF8F5] flex items-center justify-center border border-loft-orange/20">
                <EditOutlined className="text-loft-orange text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-loft-dark text-base">
                    Editar Projeto de Engenharia
                  </span>
                  {editingProject && (
                    <Tag color="orange" className="font-mono font-bold">
                      v{(editingProject as any).version || '1.0.0'}
                    </Tag>
                  )}
                </div>
                <div className="text-xs text-loft-muted font-mono">
                  {editingProject
                    ? `ID: ${editingProject.id} • ${editingProject.domain || 'Core Engineering'}`
                    : ''}
                </div>
              </div>
            </div>
          </div>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        width={850}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveEdit} className="pt-2">
          <Tabs
            defaultActiveKey="general"
            className="copan-tabs mb-4"
            items={[
              {
                key: 'general',
                label: (
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileTextOutlined /> 1. Governança & Dados Gerais
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-2">
                    <Row gutter={16}>
                      <Col span={14}>
                        <Form.Item
                          name="name"
                          label={<span className="font-semibold text-loft-dark">Nome do Projeto</span>}
                          rules={[{ required: true, message: 'Informe o nome do projeto' }]}
                        >
                          <Input placeholder="Ex: Olivelas Partner Portal" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          name="domain"
                          label={<span className="font-semibold text-loft-dark">Domínio de Negócio</span>}
                          rules={[{ required: true, message: 'Informe o domínio' }]}
                        >
                          <Select
                            size="large"
                            options={[
                              { value: 'Mídia & Conteúdo', label: 'Mídia & Conteúdo' },
                              { value: 'Customer Experience & Suporte', label: 'Customer Experience & Suporte' },
                              { value: 'IAM & Governança', label: 'IAM & Governança' },
                              { value: 'Marketplace & Real Estate', label: 'Marketplace & Real Estate' },
                              { value: 'IA & Engenharia de Prompts', label: 'IA & Engenharia de Prompts' },
                              { value: 'Financial Services & Rentals', label: 'Financial Services & Rentals' },
                              { value: 'Core Engineering', label: 'Core Engineering' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="owner"
                          label={<span className="font-semibold text-loft-dark">Tech Lead / Squad Owner</span>}
                        >
                          <Input placeholder="willian.jesus@olivelas.com.br" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="version"
                          label={<span className="font-semibold text-loft-dark">Versão</span>}
                        >
                          <Input placeholder="1.0.0" className="font-mono" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="status"
                          label={<span className="font-semibold text-loft-dark">Status</span>}
                        >
                          <Select
                            options={[
                              { value: 'Active', label: 'Active' },
                              { value: 'Planning', label: 'Planning' },
                              { value: 'In Development', label: 'In Development' },
                              { value: 'Ready', label: 'Ready' },
                              { value: 'Draft', label: 'Draft' },
                              { value: 'Archived', label: 'Archived' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="description"
                      label={<span className="font-semibold text-loft-dark">Descrição & Finalidade</span>}
                      rules={[{ required: true, message: 'Informe a descrição' }]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Descreva o propósito, escopo do projeto e objetivos..."
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: 'arch_modules',
                label: (
                  <span className="flex items-center gap-1.5 font-medium">
                    <ApartmentOutlined /> 2. Arquitetura & Módulos
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-2">
                    <Form.Item
                      name="architecture_id"
                      label={<span className="font-semibold text-loft-dark">Padrão Arquitetural Base</span>}
                    >
                      <Select
                        size="large"
                        placeholder="Selecione a arquitetura base"
                        options={architectures.map((a) => ({
                          value: a.id,
                          label: `${a.name} (${a.category})`,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      name="modules"
                      label={<span className="font-semibold text-loft-dark">Módulos Funcionais Associados</span>}
                    >
                      <Select
                        mode="multiple"
                        size="large"
                        placeholder="Selecione os módulos do projeto"
                        options={modules.map((m) => ({
                          value: m.id,
                          label: `${m.name} (${m.category})`,
                        }))}
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: 'comp_tpl',
                label: (
                  <span className="flex items-center gap-1.5 font-medium">
                    <AppstoreOutlined /> 3. Componentes & Templates
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-2">
                    <Form.Item
                      name="components"
                      label={<span className="font-semibold text-loft-dark">Componentes Visuais Copan Vinculados</span>}
                    >
                      <Select
                        mode="multiple"
                        size="large"
                        placeholder="Selecione os componentes do projeto"
                        options={components.map((c) => ({
                          value: c.id,
                          label: `${c.name} (${c.category})`,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      name="templates"
                      label={<span className="font-semibold text-loft-dark">Templates Certificados Utilizados</span>}
                    >
                      <Select
                        mode="multiple"
                        size="large"
                        placeholder="Selecione os templates base"
                        options={templates.map((t) => ({
                          value: t.id,
                          label: `${t.name} (${t.category})`,
                        }))}
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: 'reqs_tags',
                label: (
                  <span className="flex items-center gap-1.5 font-medium">
                    <BlockOutlined /> 4. Requisitos & Tags
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-2">
                    <Form.Item
                      name="requirements"
                      label={<span className="font-semibold text-loft-dark">Critérios de Aceite / Requisitos Funcionais</span>}
                    >
                      <Select mode="tags" placeholder="Digite um requisito e pressione Enter..." />
                    </Form.Item>

                    <Form.Item
                      name="tags"
                      label={<span className="font-semibold text-loft-dark">Tags de Classificação</span>}
                    >
                      <Select mode="tags" placeholder="Ex: b2b, parceiros, core, generated-app" />
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />

          <div className="flex items-center justify-between pt-4 border-t border-loft-border">
            {editingProject ? (
              <Popconfirm
                title="Excluir permanentemente do banco de dados?"
                description={
                  <div className="max-w-[280px] text-xs text-loft-muted">
                    Esta ação removerá o projeto <strong>{editingProject.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
                  </div>
                }
                okText="Sim, excluir permanentemente"
                cancelText="Cancelar"
                okButtonProps={{ danger: true, loading: formSubmitting, className: 'bg-[#E12D39]' }}
                onConfirm={async () => {
                  try {
                    await projectsService.deleteProject(editingProject.id);
                    message.success(`Projeto '${editingProject.name}' excluído com sucesso do banco de dados!`);
                    setEditModalOpen(false);
                    fetchData();
                  } catch (err: any) {
                    message.error(err.message || 'Falha ao excluir projeto');
                  }
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Excluir Projeto
                </Button>
              </Popconfirm>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Button onClick={() => setEditModalOpen(false)}>Cancelar</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={formSubmitting}
                className="bg-loft-orange hover:bg-[#D9532B] border-none font-semibold"
              >
                Salvar Alterações no Projeto
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          fetchData();
        }}
        architectures={architectures}
        modules={modules}
      />

      {/* Universal Versioning Modal */}
      {versionTargetProj && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="project"
          entityId={versionTargetProj.id}
          entityName={versionTargetProj.name}
          currentVersion={(versionTargetProj as any).version || '1.0.0'}
          versions={(versionTargetProj as any).versions}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};
