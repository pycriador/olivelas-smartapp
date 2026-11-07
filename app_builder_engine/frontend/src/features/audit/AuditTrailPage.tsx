import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Pagination,
  Modal,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { auditService } from '@/services/audit.service';
import { useUIStore } from '@/stores/uiStore';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type { AuditLog } from '@/types/domain.types';

export const AuditTrailPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [resultFilter, setResultFilter] = useState<string | undefined>(undefined);

  // URL-Synced Pagination
  const { currentPage, pageSize, onPaginationChange, resetToFirstPage } = useUrlPagination(10);

  // Modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await auditService.getLogsPaginated({
        action: actionFilter,
        resource: typeFilter,
        search: search || undefined,
        page: currentPage,
        page_size: pageSize,
      });
      const items = resultFilter
        ? res.items.filter((l: any) => (l.result || 'SUCCESS').toUpperCase() === resultFilter.toUpperCase())
        : res.items;
      setLogs(items);
      setTotalItems(res.total);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar trilha de auditoria');
    } finally {
      setLoading(false);
    }
  }, [actionFilter, typeFilter, resultFilter, search, currentPage, pageSize]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns: ColumnsType<AuditLog> = [
    {
      title: 'Data & Hora',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (ts) => (
        <span className="font-mono text-xs text-loft-muted">
          {new Date(ts).toLocaleString('pt-BR')}
        </span>
      ),
      width: 170,
    },
    {
      title: 'Ação',
      dataIndex: 'action',
      key: 'action',
      render: (act) => {
        const val = typeof act === 'object' && act?.value ? act.value : String(act || 'ACTION');
        const color =
          val.includes('CREATE') || val.includes('PUBLISH')
            ? 'green'
            : val.includes('DELETE') || val.includes('DEPRECATE')
            ? 'red'
            : 'blue';
        return <Tag color={color}>{val}</Tag>;
      },
      width: 140,
    },
    {
      title: 'Tipo',
      dataIndex: 'entity_type',
      key: 'entity_type',
      render: (t, record: any) => (
        <Tag color="geekblue">{(t || record.resource || 'ENTITY').toUpperCase()}</Tag>
      ),
      width: 130,
    },
    {
      title: 'Ativo / Entidade',
      dataIndex: 'entity_id',
      key: 'entity_id',
      render: (id, record: any) => {
        const targetId = id || record.resource_id || '';
        const targetType = record.entity_type || record.resource || 'component';
        return (
          <Button
            type="link"
            size="small"
            className="p-0 font-mono text-xs text-loft-orange hover:underline"
            onClick={() => openInspector360(targetType, targetId)}
          >
            {targetId}
          </Button>
        );
      },
    },
    {
      title: 'Autor / Ator',
      dataIndex: 'actor',
      key: 'actor',
      render: (actor, record: any) => (
        <span className="font-semibold text-xs text-loft-dark">
          {actor || record.user_email || 'System Admin'}
        </span>
      ),
      width: 180,
    },
    {
      title: 'Resultado',
      dataIndex: 'result',
      key: 'result',
      render: (res) => {
        const isSuccess = (res || 'SUCCESS').toUpperCase() === 'SUCCESS';
        return (
          <Tag
            color={isSuccess ? 'success' : 'error'}
            icon={isSuccess ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          >
            {res || 'SUCCESS'}
          </Tag>
        );
      },
      width: 120,
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Tooltip title="Ver Payload e Metadados">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedLog(record)}
          />
        </Tooltip>
      ),
      width: 70,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trilha de Auditoria & Governança"
        subtitle="Registro imutável de todas as criações, publicações, alterações e composições na plataforma"
        breadcrumbs={[
          { title: 'Engineering Workspace' },
          { title: 'Governança & Admin' },
          { title: 'Trilha de Auditoria' },
        ]}
        actions={
          <Button icon={<ReloadOutlined />} onClick={fetchLogs}>
            Atualizar
          </Button>
        }
      />

      {/* Filter Bar */}
      <Card className="mb-6 shadow-2xs border-loft-border">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full flex flex-col sm:flex-row gap-3 items-center">
            <Input
              prefix={<SearchOutlined className="text-loft-muted" />}
              placeholder="Buscar por ação, ativo ou autor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetToFirstPage();
              }}
              allowClear
              className="max-w-md"
            />

            <Select
              placeholder="Ação"
              allowClear
              className="w-full sm:w-36"
              value={actionFilter}
              onChange={(v) => {
                setActionFilter(v);
                resetToFirstPage();
              }}
              options={[
                { value: 'CREATE', label: 'CREATE' },
                { value: 'UPDATE', label: 'UPDATE' },
                { value: 'PUBLISH', label: 'PUBLISH' },
                { value: 'DEPRECATE', label: 'DEPRECATE' },
                { value: 'DELETE', label: 'DELETE' },
                { value: 'VALIDATE', label: 'VALIDATE' },
              ]}
            />

            <Select
              placeholder="Tipo de Ativo"
              allowClear
              className="w-full sm:w-40"
              value={typeFilter}
              onChange={(v) => {
                setTypeFilter(v);
                resetToFirstPage();
              }}
              options={[
                { value: 'component', label: 'Componente' },
                { value: 'module', label: 'Módulo' },
                { value: 'template', label: 'Template' },
                { value: 'rule', label: 'Golden Rule' },
                { value: 'project', label: 'Projeto' },
                { value: 'blueprint', label: 'Blueprint' },
              ]}
            />

            <Select
              placeholder="Resultado"
              allowClear
              className="w-full sm:w-32"
              value={resultFilter}
              onChange={(v) => {
                setResultFilter(v);
                resetToFirstPage();
              }}
              options={[
                { value: 'SUCCESS', label: 'Sucesso' },
                { value: 'FAILED', label: 'Falha' },
              ]}
            />

            {(actionFilter || typeFilter || resultFilter || search) && (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSearch('');
                  setActionFilter(undefined);
                  setTypeFilter(undefined);
                  setResultFilter(undefined);
                  resetToFirstPage();
                }}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <LoadingState tip="Carregando logs de auditoria..." />
      ) : error ? (
        <ErrorState description={error} onRetry={fetchLogs} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="Nenhum registro de auditoria encontrado"
          description="Nenhum log corresponde aos filtros de busca selecionados."
        />
      ) : (
        <Card className="shadow-2xs border-loft-border">
          <Table
            columns={columns}
            dataSource={logs}
            rowKey="id"
            pagination={false}
          />
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-loft-muted">
              Exibindo {logs.length} de {totalItems} registros de auditoria (Página {currentPage})
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={onPaginationChange}
              showSizeChanger
              pageSizeOptions={['10', '25', '50', '100']}
            />
          </div>
        </Card>
      )}

      {/* Log Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-loft-orange" />
            <span>Detalhes do Evento de Auditoria</span>
          </div>
        }
        open={!!selectedLog}
        onCancel={() => setSelectedLog(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSelectedLog(null)}>
            Fechar
          </Button>,
        ]}
        width={720}
      >
        {selectedLog && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <b className="text-loft-muted">ID do Evento:</b>
                <div className="font-mono text-loft-dark mt-0.5">{selectedLog.id}</div>
              </div>
              <div>
                <b className="text-loft-muted">Timestamp:</b>
                <div className="text-loft-dark mt-0.5">
                  {new Date(selectedLog.timestamp).toLocaleString('pt-BR')}
                </div>
              </div>
              <div>
                <b className="text-loft-muted">Ator / Usuário:</b>
                <div className="text-loft-dark mt-0.5 font-semibold">
                  {selectedLog.actor || (selectedLog as any).user_email}
                </div>
              </div>
              <div>
                <b className="text-loft-muted">Recurso Alvo:</b>
                <div className="font-mono text-loft-orange mt-0.5">
                  {selectedLog.entity_id || (selectedLog as any).resource_id} (
                  {selectedLog.entity_type || (selectedLog as any).resource})
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-loft-muted mb-1">Payload / Metadados JSON</div>
              <pre className="p-3 bg-loft-dark text-loft-success rounded-lg text-xs font-mono overflow-x-auto max-h-60">
                {JSON.stringify(
                  (selectedLog as any).metadata_json ||
                    selectedLog.details ||
                    selectedLog.metadata ||
                    selectedLog,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
