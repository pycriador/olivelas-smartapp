import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Modal,
  Tabs,
  Input,
  Select,
  Pagination,
  Radio,
  Table,
  message,
  Space,
  Drawer,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  BuildOutlined,
  EyeOutlined,
  CopyOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';
import { EntityVersionModal } from '@/components/ui/EntityVersionModal';
import { BlueprintEditModal } from './components/BlueprintEditModal';
import { blueprintsService } from '@/services/blueprints.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { navigateTo } from '@/router/navigation';
import type { Blueprint } from '@/types/domain.types';

export const BlueprintsPage: React.FC = () => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [totalBlueprints, setTotalBlueprints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [architectureFilter, setArchitectureFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // URL-synced & Server-Side Pagination
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(6);

  // Modals & Validation Drawer
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBlueprint, setEditingBlueprint] = useState<Blueprint | null>(null);

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetBp, setVersionTargetBp] = useState<Blueprint | null>(null);

  const [diagnosticsDrawer, setDiagnosticsDrawer] = useState<{ open: boolean; report: any | null; bpName: string }>({
    open: false,
    report: null,
    bpName: '',
  });

  const fetchBlueprints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await blueprintsService.getBlueprintsPaginated({
        search: search || undefined,
        architecture_id: architectureFilter,
        status: statusFilter,
        page: currentPage,
        page_size: pageSize,
      });
      setBlueprints(res.data);
      setTotalBlueprints(res.meta?.total ?? res.data.length);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar blueprints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlueprints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, architectureFilter, statusFilter]);

  const archOptions = useMemo(() => {
    const map = new Map<string, string>();
    blueprints.forEach((b) => {
      map.set(b.architecture_id, b.architecture_name || b.architecture_id);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [blueprints]);

  const filteredBlueprints = useMemo(() => ({ length: totalBlueprints }), [totalBlueprints]);
  const paginatedBlueprints = blueprints;

  const handleOpenEdit = (bp: Blueprint, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingBlueprint(bp);
    setEditModalOpen(true);
  };

  const handleDelete = async (bp: Blueprint, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await blueprintsService.deleteBlueprint(bp.id);
      message.success(`Blueprint '${bp.name}' removido com sucesso!`);
      if (selectedBlueprint?.id === bp.id) setDetailModalOpen(false);
      fetchBlueprints();
    } catch (err: any) {
      message.error(err.message || 'Falha ao remover blueprint');
    }
  };

  const handleOpenVersionModal = (bp: Blueprint, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetBp(bp);
    setVersionModalOpen(true);
  };

  const handleValidate = async (bp: Blueprint, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const report: any = await blueprintsService.validateBlueprint(bp.id);
      setDiagnosticsDrawer({ open: true, report, bpName: bp.name });
      const isValid = report?.status === 'ready' || report?.can_publish === true || report?.valid === true;
      if (isValid) {
        message.success('Blueprint certificado sem violações!');
      } else {
        message.warning('Diagnóstico concluiu com violações de regras.');
      }
    } catch (err: any) {
      message.error(`Erro na validação: ${err.message}`);
    }
  };

  const handleDownloadJson = (bp: Blueprint, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const jsonStr = JSON.stringify(bp, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blueprint-${bp.slug || bp.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success(`Download do arquivo blueprint-${bp.slug || bp.id}.json iniciado!`);
  };

  const tableColumns: ColumnsType<Blueprint> = [
    {
      title: 'Blueprint',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div
          className="cursor-pointer hover:text-loft-orange transition font-semibold"
          onClick={() => {
            setSelectedBlueprint(record);
            setDetailModalOpen(true);
          }}
        >
          <div className="text-sm text-loft-dark">{name}</div>
          <div className="text-xs text-loft-muted font-mono">{record.id}</div>
        </div>
      ),
    },
    {
      title: 'Arquitetura',
      dataIndex: 'architecture_id',
      key: 'architecture_id',
      render: (arch) => <Tag color="blue" className="font-mono text-xs">{arch}</Tag>,
    },
    {
      title: 'Módulos / Componentes',
      key: 'assets',
      render: (_, record) => (
        <span className="text-xs text-loft-muted">
          {record.modules?.length || 0} mods | {record.components?.length || 0} comps
        </span>
      ),
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version',
      render: (v) => <Tag color="purple" className="font-mono">v{v}</Tag>,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedBlueprint(record);
              setDetailModalOpen(true);
            }}
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
            icon={<CheckCircleOutlined />}
            onClick={(e) => handleValidate(record, e)}
          >
            Validar
          </Button>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={(e) => handleDownloadJson(record, e)}
          />
          <Popconfirm
            title="Excluir blueprint?"
            description="Tem certeza que deseja excluir este blueprint?"
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
        title="Blueprints Arquiteturais da Loft"
        subtitle="Especificações determinísticas completas contendo regras de negócio, componentes Copan, contratos de API e estrutura física de pastas. CRUD completo e versionamento SemVer."
        breadcrumbs={[
          { title: 'Workspaces', href: '/blueprints' },
          { title: 'Blueprints' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchBlueprints}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigateTo('/workshop')}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Compor no Studio
            </Button>
          </Space>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar blueprints por nome, descrição ou arquitetura..."
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
              { value: 'Ready', label: 'Ready' },
              { value: 'Draft', label: 'Draft' },
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
        <LoadingState tip="Carregando catálogo de blueprints..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBlueprints} />
      ) : filteredBlueprints.length === 0 ? (
        <EmptyState
          title="Nenhum blueprint encontrado"
          description="Ajuste os filtros de busca ou componha um novo blueprint no Workshop Studio."
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-loft-border overflow-hidden shadow-2xs">
          <Table
            columns={tableColumns}
            dataSource={paginatedBlueprints}
            rowKey="id"
            pagination={false}
          />
          <div className="p-4 border-t border-loft-border flex justify-between items-center">
            <span className="text-xs text-loft-muted">
              Total: {filteredBlueprints.length} blueprints
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredBlueprints.length}
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
            {paginatedBlueprints.map((bp) => (
              <Col xs={24} md={12} lg={8} key={bp.id}>
                <Card
                  hoverable
                  className="h-full flex flex-col justify-between shadow-2xs border-loft-border transition hover:border-loft-orange cursor-pointer group"
                  onClick={() => {
                    setSelectedBlueprint(bp);
                    setDetailModalOpen(true);
                  }}
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => handleOpenEdit(bp, e)}
                    >
                      Editar
                    </Button>,
                    <Button
                      key="ver"
                      type="text"
                      size="small"
                      icon={<BranchesOutlined />}
                      onClick={(e) => handleOpenVersionModal(bp, e)}
                    >
                      v{bp.version}
                    </Button>,
                    <Button
                      key="val"
                      type="text"
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={(e) => handleValidate(bp, e)}
                    >
                      Validar
                    </Button>,
                    <Button
                      key="dl"
                      type="text"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={(e) => handleDownloadJson(bp, e)}
                    />,
                  ]}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-base text-loft-dark group-hover:text-loft-orange transition line-clamp-1">
                        {bp.name}
                      </span>
                      <Tag color="purple" className="font-mono text-xs">
                        v{bp.version}
                      </Tag>
                    </div>

                    <p className="text-xs text-loft-muted line-clamp-2 mb-4 leading-relaxed">
                      {bp.description}
                    </p>

                    <div className="space-y-2 text-xs bg-[#FAFBFD] p-3 rounded-lg border border-loft-border">
                      <div className="flex justify-between items-center">
                        <span className="text-loft-muted">Arquitetura:</span>
                        <Tag color="blue" className="text-[11px] font-mono">
                          {bp.architecture_id}
                        </Tag>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-loft-muted">Módulos Inclusos:</span>
                        <span className="font-semibold text-loft-dark">
                          {bp.modules?.length || 0} módulos
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-loft-muted">Componentes:</span>
                        <span className="font-semibold text-loft-dark">
                          {bp.components?.length || 0} componentes
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-loft-border shadow-2xs">
            <span className="text-xs text-loft-muted font-medium">
              Exibindo {paginatedBlueprints.length} de {filteredBlueprints.length} blueprints
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredBlueprints.length}
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

      {/* Blueprint Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <BuildOutlined className="text-loft-orange" />
            <span>Blueprint: {selectedBlueprint?.name}</span>
            <Tag color="purple" className="font-mono">v{selectedBlueprint?.version}</Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width={860}
        footer={[
          <Button
            key="copy"
            icon={<CopyOutlined />}
            onClick={() => {
              if (selectedBlueprint) {
                navigator.clipboard.writeText(JSON.stringify(selectedBlueprint, null, 2));
                message.success('Blueprint JSON copiado!');
              }
            }}
          >
            Copiar JSON
          </Button>,
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={() => {
              if (selectedBlueprint) handleDownloadJson(selectedBlueprint);
            }}
          >
            Baixar JSON
          </Button>,
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => {
              if (selectedBlueprint) {
                const b = selectedBlueprint;
                setDetailModalOpen(false);
                handleOpenEdit(b);
              }
            }}
          >
            Editar
          </Button>,
          <Button
            key="version"
            icon={<BranchesOutlined />}
            onClick={() => selectedBlueprint && handleOpenVersionModal(selectedBlueprint)}
          >
            Versões
          </Button>,
          <Button
            key="validate"
            type="primary"
            icon={<CheckCircleOutlined />}
            className="bg-loft-orange border-none"
            onClick={() => {
              if (selectedBlueprint) {
                handleValidate(selectedBlueprint);
              }
            }}
          >
            Validar Conformidade
          </Button>,
        ]}
      >
        {selectedBlueprint && (
          <Tabs
            items={[
              {
                key: 'overview',
                label: 'Visão Geral & Ativos',
                children: (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-loft-dark">{selectedBlueprint.description}</p>
                    <div className="text-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <b>Arquitetura:</b> <Tag color="blue">{selectedBlueprint.architecture_id}</Tag>
                      </div>
                      <div>
                        <b>Módulos Vinculados ({selectedBlueprint.modules?.length || 0}):</b>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBlueprint.modules?.map((m) => (
                            <Tag key={m} color="cyan">{m}</Tag>
                          ))}
                        </div>
                      </div>
                      <div>
                        <b>Componentes Copan ({selectedBlueprint.components?.length || 0}):</b>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBlueprint.components?.map((c) => (
                            <Tag key={c} color="orange">{c}</Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'structure',
                label: 'Estrutura Física de Pastas',
                children: (
                  <MarkdownViewer
                    content={`\`\`\`json\n${JSON.stringify(selectedBlueprint.folder_structure, null, 2)}\n\`\`\``}
                  />
                ),
              },
              {
                key: 'json',
                label: 'Blueprint JSON Schema',
                children: (
                  <MarkdownViewer
                    content={`\`\`\`json\n${JSON.stringify(selectedBlueprint, null, 2)}\n\`\`\``}
                  />
                ),
              },
            ]}
          />
        )}
      </Modal>

      {/* Workshop-grade Rich Visual Blueprint Editor Modal */}
      <BlueprintEditModal
        open={editModalOpen}
        blueprint={editingBlueprint}
        onClose={() => setEditModalOpen(false)}
        onSuccess={fetchBlueprints}
      />

      {/* Diagnostics Drawer */}
      <Drawer
        title={`Diagnóstico de Validação: ${diagnosticsDrawer.bpName}`}
        open={diagnosticsDrawer.open}
        onClose={() => setDiagnosticsDrawer({ open: false, report: null, bpName: '' })}
        width={540}
      >
        {diagnosticsDrawer.report && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl border font-semibold text-sm ${
                diagnosticsDrawer.report.can_publish || diagnosticsDrawer.report.valid
                  ? 'bg-[#F2FBF8] border-[#8CE0CC] text-loft-success'
                  : 'bg-[#FDF2F2] border-[#F8B4B4] text-loft-error'
              }`}
            >
              {diagnosticsDrawer.report.can_publish || diagnosticsDrawer.report.valid
                ? '✓ Blueprint 100% Válido para Produção!'
                : `✕ Violações encontradas: ${(diagnosticsDrawer.report.errors || []).length} erros`}
            </div>

            {diagnosticsDrawer.report.errors && diagnosticsDrawer.report.errors.length > 0 && (
              <div>
                <div className="text-xs font-bold text-loft-error mb-2 uppercase tracking-wide">
                  Erros Bloqueantes
                </div>
                <div className="space-y-2">
                  {diagnosticsDrawer.report.errors.map((err: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-lg text-xs text-loft-dark">
                      {typeof err === 'string' ? err : JSON.stringify(err)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Universal Versioning Modal */}
      {versionTargetBp && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="blueprint"
          entityId={versionTargetBp.id}
          entityName={versionTargetBp.name}
          currentVersion={versionTargetBp.version || '1.0.0'}
          versions={(versionTargetBp as any).versions}
          onSuccess={fetchBlueprints}
        />
      )}
    </div>
  );
};
