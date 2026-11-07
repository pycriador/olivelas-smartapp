import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Table,
  Space,
  Radio,
  Tooltip,
  Alert,
  Drawer,
  Collapse,
  Result,
  Spin,
  Typography,
  Input,
  Select,
  Pagination,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  CloudSyncOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  BugOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/FeedbackStates';
import { libraryUpdatesService } from '@/services/libraryUpdates.service';
import { ApiError } from '@/services/api-client';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type {
  LibraryUpdateEntry,
  LibraryUpdatesStatus,
  CandidateChoice,
  TestCandidateResult,
} from '@/types/libraryUpdates.types';

const { Text, Paragraph } = Typography;

/** Unique identifier for a scanned row: ecosystem + package name. */
const rowKeyOf = (e: Pick<LibraryUpdateEntry, 'ecosystem' | 'package'>) => `${e.ecosystem}::${e.package}`;

/** Key used to track a "tested & passed" combination, scoped to the exact version. */
const testKeyOf = (ecosystem: string, pkg: string, version: string) => `${ecosystem}::${pkg}::${version}`;

function resolveVersion(entry: LibraryUpdateEntry, choice: CandidateChoice | undefined): string | null {
  if (!choice) return null;
  if (choice === 'safe') return entry.safe_update;
  if (choice === 'latest') return entry.latest_stable;
  return entry.latest_test;
}

function defaultChoiceFor(entry: LibraryUpdateEntry): CandidateChoice | undefined {
  if (entry.safe_update) return 'safe';
  if (entry.latest_stable) return 'latest';
  if (entry.latest_test) return 'test';
  return undefined;
}

/** Formats an ISO timestamp as a human relative time in Brazilian Portuguese. */
function formatRelativeTime(iso: string | null): string {
  if (!iso) return 'Nunca verificado';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Nunca verificado';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return 'agora mesmo';
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'agora mesmo';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin} minuto${diffMin === 1 ? '' : 's'}`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `há ${diffHour} hora${diffHour === 1 ? '' : 's'}`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `há ${diffDay} dia${diffDay === 1 ? '' : 's'}`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `há ${diffMonth} mês${diffMonth === 1 ? '' : 'es'}`;
  const diffYear = Math.floor(diffMonth / 12);
  return `há ${diffYear} ano${diffYear === 1 ? '' : 's'}`;
}

function findStatusCurrent(status: LibraryUpdatesStatus | null, ecosystem: string, pkg: string): string | undefined {
  if (!status) return undefined;
  const fromFrontend = status.stack_versions?.frontend?.[pkg];
  if (fromFrontend && fromFrontend.ecosystem === ecosystem) return fromFrontend.current;
  const fromBackend = status.stack_versions?.backend?.[pkg];
  if (fromBackend && fromBackend.ecosystem === ecosystem) return fromBackend.current;
  return undefined;
}

export const LibraryUpdatesPage: React.FC = () => {
  const mountedRef = useRef(true);
  useEffect(() => {
    // Reset on every (re)mount — React 18 StrictMode double-invokes effects in
    // development (mount → cleanup → mount), which would otherwise leave this
    // stuck at `false` forever after the simulated first unmount.
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<LibraryUpdatesStatus | null>(null);

  const [scanning, setScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [entries, setEntries] = useState<LibraryUpdateEntry[]>([]);

  // Standard Filters & URL Pagination (loads all on-demand, paginates via URL)
  const [search, setSearch] = useState('');
  const [ecosystemFilter, setEcosystemFilter] = useState<string | undefined>(undefined);
  const [updateFilter, setUpdateFilter] = useState<string | undefined>(undefined);
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(10);

  const [selectedChoice, setSelectedChoice] = useState<Record<string, CandidateChoice | undefined>>({});
  const [testingKeys, setTestingKeys] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestCandidateResult & { version: string }>>({});
  const [passedTests, setPassedTests] = useState<Set<string>>(new Set());
  const [applyingKeys, setApplyingKeys] = useState<Record<string, boolean>>({});

  const [resultDrawerKey, setResultDrawerKey] = useState<string | null>(null);

  const loadStatus = async () => {
    setStatusLoading(true);
    try {
      const s = await libraryUpdatesService.getStatus();
      if (!mountedRef.current) return;
      setStatus(s);
      setPermissionDenied(false);
      // Seed initial entries from stack_versions if not yet scanned so the table & URL pagination work immediately
      setEntries((prev) => {
        if (prev.length > 0) return prev;
        const seeded: LibraryUpdateEntry[] = [];
        const fe = s.stack_versions?.frontend || {};
        const be = s.stack_versions?.backend || {};
        Object.entries(fe).forEach(([pkg, info]) => {
          seeded.push({
            ecosystem: (info?.ecosystem as 'npm' | 'pip') || 'npm',
            package: pkg,
            current: info?.current || '-',
            safe_update: null,
            latest_stable: null,
            latest_test: null,
            update_available: false,
            error: null,
          });
        });
        Object.entries(be).forEach(([pkg, info]) => {
          seeded.push({
            ecosystem: (info?.ecosystem as 'npm' | 'pip') || 'pip',
            package: pkg,
            current: info?.current || '-',
            safe_update: null,
            latest_stable: null,
            latest_test: null,
            update_available: false,
            error: null,
          });
        });
        return seeded.sort((a, b) =>
          a.ecosystem !== b.ecosystem
            ? a.ecosystem.localeCompare(b.ecosystem)
            : a.package.localeCompare(b.package)
        );
      });
    } catch (err: any) {
      if (!mountedRef.current) return;
      if (err instanceof ApiError && err.status === 403) {
        setPermissionDenied(true);
      } else {
        message.error(err.message || 'Falha ao carregar o status da Central de Atualizações de Bibliotecas.');
      }
    } finally {
      if (mountedRef.current) setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      const result = await libraryUpdatesService.scan();
      if (!mountedRef.current) return;
      const sorted = [...result].sort((a, b) => {
        if (a.ecosystem !== b.ecosystem) return a.ecosystem.localeCompare(b.ecosystem);
        return a.package.localeCompare(b.package);
      });
      setEntries(sorted);
      setHasScanned(true);
      setPermissionDenied(false);

      // Reset per-row interactive state: a fresh scan supersedes previous selections/results.
      const defaults: Record<string, CandidateChoice | undefined> = {};
      sorted.forEach((e) => {
        defaults[rowKeyOf(e)] = defaultChoiceFor(e);
      });
      setSelectedChoice(defaults);
      setTestResults({});
      setPassedTests(new Set());

      message.success(`Busca concluída: ${sorted.length} pacote${sorted.length === 1 ? '' : 's'} verificado${sorted.length === 1 ? '' : 's'}.`);
      await loadStatus();
    } catch (err: any) {
      if (!mountedRef.current) return;
      if (err instanceof ApiError && err.status === 403) {
        setPermissionDenied(true);
      } else {
        message.error(err.message || 'Falha ao buscar atualizações de bibliotecas.');
      }
    } finally {
      if (mountedRef.current) setScanning(false);
    }
  };

  const handleTest = async (entry: LibraryUpdateEntry) => {
    const key = rowKeyOf(entry);
    const choice = selectedChoice[key];
    const version = resolveVersion(entry, choice);
    if (!version) {
      message.warning('Selecione uma versão candidata válida antes de testar.');
      return;
    }
    setTestingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      const result = await libraryUpdatesService.testCandidate({
        ecosystem: entry.ecosystem,
        package: entry.package,
        version,
      });
      if (!mountedRef.current) return;
      setTestResults((prev) => ({ ...prev, [key]: { ...result, version } }));
      if (result.passed) {
        setPassedTests((prev) => new Set(prev).add(testKeyOf(entry.ecosystem, entry.package, version)));
        message.success(`${entry.package}@${version} passou no teste de instalação e build.`);
      } else {
        message.error(`${entry.package}@${version} falhou no teste${result.step_failed ? ` (${result.step_failed})` : ''}.`);
      }
      // Note: intentionally not auto-opening the result Drawer here — its mask
      // would swallow the next click if the user navigated away while waiting
      // (test-candidate can take up to ~2 minutes). The row's "Ver log" tag
      // lets them open it explicitly once they're ready.
    } catch (err: any) {
      if (!mountedRef.current) return;
      if (err instanceof ApiError && err.status === 403) {
        setPermissionDenied(true);
      } else {
        message.error(err.message || `Falha ao testar a versão candidata de ${entry.package}.`);
      }
    } finally {
      if (mountedRef.current) setTestingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleApply = async (entry: LibraryUpdateEntry) => {
    const key = rowKeyOf(entry);
    const choice = selectedChoice[key];
    const version = resolveVersion(entry, choice);
    if (!version) return;
    setApplyingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      await libraryUpdatesService.apply({
        ecosystem: entry.ecosystem,
        package: entry.package,
        version,
      });
      if (!mountedRef.current) return;
      message.success(`${entry.package} atualizado para ${version} em stack_versions.json. Lembre-se: o commit/push continua manual.`);

      const refreshed = await libraryUpdatesService.getStatus();
      if (!mountedRef.current) return;
      setStatus(refreshed);

      const newCurrent = findStatusCurrent(refreshed, entry.ecosystem, entry.package) || version;
      setEntries((prev) =>
        prev.map((e) =>
          rowKeyOf(e) === key
            ? { ...e, current: newCurrent, update_available: false }
            : e
        )
      );
    } catch (err: any) {
      if (!mountedRef.current) return;
      if (err instanceof ApiError && err.status === 403) {
        setPermissionDenied(true);
      } else {
        message.error(err.message || `Falha ao aplicar a nova versão de ${entry.package}.`);
      }
    } finally {
      if (mountedRef.current) setApplyingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const summary = useMemo(() => {
    const total = entries.length;
    const withUpdate = entries.filter((e) => e.update_available).length;
    const withError = entries.filter((e) => !!e.error).length;
    return { total, withUpdate, withError };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch =
        !search ||
        e.package.toLowerCase().includes(search.toLowerCase()) ||
        e.current.toLowerCase().includes(search.toLowerCase());
      const matchEco = !ecosystemFilter || e.ecosystem === ecosystemFilter;
      const matchUpdate =
        !updateFilter ||
        (updateFilter === 'update_available' && e.update_available) ||
        (updateFilter === 'up_to_date' && !e.update_available && !e.error) ||
        (updateFilter === 'error' && !!e.error);
      return matchSearch && matchEco && matchUpdate;
    });
  }, [entries, search, ecosystemFilter, updateFilter]);

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEntries.slice(start, start + pageSize);
  }, [filteredEntries, currentPage, pageSize]);

  const columns: ColumnsType<LibraryUpdateEntry> = [
    {
      title: 'Pacote',
      key: 'package',
      dataIndex: 'package',
      sorter: (a, b) => a.package.localeCompare(b.package),
      render: (_: string, record) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-loft-dark font-mono text-sm">{record.package}</span>
          <Tag
            className="w-fit text-[10px] m-0"
            color={record.ecosystem === 'npm' ? 'blue' : 'green'}
          >
            {record.ecosystem === 'npm' ? 'Frontend · NPM' : 'Backend · PyPI'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Atual',
      dataIndex: 'current',
      key: 'current',
      width: 140,
      render: (v: string) => <Tag className="font-mono text-xs m-0">{v}</Tag>,
    },
    {
      title: 'Status',
      key: 'status',
      width: 170,
      render: (_: any, record) => {
        if (record.error) {
          return (
            <Tooltip title={record.error}>
              <Tag color="red" icon={<WarningOutlined />}>Erro na consulta</Tag>
            </Tooltip>
          );
        }
        if (!hasScanned) {
          return <Tag color="default">Aguardando busca</Tag>;
        }
        if (record.update_available) {
          return <Tag color="orange">Atualização disponível</Tag>;
        }
        return <Tag color="green">Atualizado</Tag>;
      },
    },
    {
      title: 'Versão candidata',
      key: 'candidate',
      width: 320,
      render: (_: any, record) => {
        const key = rowKeyOf(record);
        if (record.error) {
          return <Text type="secondary" className="text-xs">Indisponível — falha ao consultar o registry.</Text>;
        }
        const choice = selectedChoice[key];
        const resolved = resolveVersion(record, choice);
        return (
          <div className="flex flex-col gap-1">
            <Radio.Group
              size="small"
              value={choice}
              onChange={(e) => setSelectedChoice((prev) => ({ ...prev, [key]: e.target.value }))}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="safe" disabled={!record.safe_update}>🛡️ Segura</Radio.Button>
              <Radio.Button value="latest" disabled={!record.latest_stable}>🚀 Mais nova</Radio.Button>
              <Radio.Button value="test" disabled={!record.latest_test}>🧪 Teste</Radio.Button>
            </Radio.Group>
            <span className="text-[11px] text-loft-muted font-mono">
              {resolved
                ? `→ ${resolved}`
                : hasScanned
                ? 'Nenhuma versão candidata disponível'
                : 'Clique em "Buscar Atualizações" para consultar'}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 220,
      render: (_: any, record) => {
        const key = rowKeyOf(record);
        const choice = selectedChoice[key];
        const version = resolveVersion(record, choice);
        const testing = !!testingKeys[key];
        const applying = !!applyingKeys[key];
        const testResult = testResults[key];
        const hasPassedForVersion = !!version && passedTests.has(testKeyOf(record.ecosystem, record.package, version));
        const canTest = !record.error && !!version && !testing;
        const canApply = hasPassedForVersion && !applying && !testing;

        return (
          <div className="flex flex-col gap-1.5">
            <Space size={6} wrap>
              <Tooltip title={!version ? 'Nenhuma versão candidata disponível' : undefined}>
                <Button
                  size="small"
                  icon={<ExperimentOutlined />}
                  loading={testing}
                  disabled={!canTest}
                  onClick={() => handleTest(record)}
                >
                  Testar
                </Button>
              </Tooltip>
              <Tooltip
                title={
                  !hasPassedForVersion
                    ? 'Rode "Testar" com sucesso para esta versão antes de aplicar.'
                    : undefined
                }
              >
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={applying}
                  disabled={!canApply}
                  onClick={() => handleApply(record)}
                  style={canApply ? { background: '#FF774A', borderColor: '#FF774A' } : undefined}
                >
                  Aplicar
                </Button>
              </Tooltip>
            </Space>
            {testing && (
              <span className="text-[11px] text-loft-muted flex items-center gap-1">
                <Spin size="small" /> Instalando e buildando, pode levar até 2 minutos...
              </span>
            )}
            {testResult && !testing && (
              <Button
                size="small"
                type="link"
                className="p-0 h-auto text-xs justify-start"
                onClick={() => setResultDrawerKey(key)}
              >
                {testResult.passed ? (
                  <Tag color="green" icon={<CheckCircleOutlined />} className="m-0">Passou — ver log</Tag>
                ) : (
                  <Tag color="red" icon={<CloseCircleOutlined />} className="m-0">Falhou — ver log</Tag>
                )}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const drawerEntry = resultDrawerKey
    ? entries.find((e) => rowKeyOf(e) === resultDrawerKey)
    : null;
  const drawerResult = resultDrawerKey ? testResults[resultDrawerKey] : null;

  if (permissionDenied) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Central de Atualizações de Bibliotecas"
          breadcrumbs={[
            { title: 'Plataforma', href: '/platform/library-updates' },
            { title: 'Atualizações de Bibliotecas' },
          ]}
        />
        <Result
          status="403"
          title="Acesso restrito"
          subTitle="Você não tem permissão para gerenciar atualizações de bibliotecas. Essa ação é restrita ao papel Global Admin."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central de Atualizações de Bibliotecas"
        subtitle="Consulta ao vivo de versões no npm e PyPI, com teste real de instalação/build antes de aplicar qualquer atualização ao stack da plataforma."
        breadcrumbs={[
          { title: 'Plataforma', href: '/platform/library-updates' },
          { title: 'Atualizações de Bibliotecas' },
        ]}
        actions={
          <Space wrap align="center">
            <span className="text-xs text-loft-muted flex items-center gap-1 mr-1">
              <ClockCircleOutlined />
              {statusLoading ? 'Carregando...' : `Última verificação: ${formatRelativeTime(status?.last_scan_at ?? null)}`}
            </span>
            <Button icon={<ReloadOutlined />} onClick={loadStatus} loading={statusLoading}>
              Atualizar Status
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              loading={scanning}
              onClick={handleScan}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Buscar Atualizações
            </Button>
          </Space>
        }
      />

      <Alert
        type="info"
        showIcon
        message="Esta tela só grava localmente (Carregamento Sob Demanda)"
        description='Ao clicar em "Buscar Atualizações", todos os pacotes do stack são verificados sob demanda no npm e PyPI. Ao clicar em "Aplicar", a versão escolhida é gravada no arquivo stack_versions.json do backend. O commit/push para o GitHub continua manual.'
      />

      {/* Summary KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small" className="border-loft-border shadow-2xs">
            <div className="text-xs text-loft-muted font-medium mb-1">Pacotes monitorados no stack</div>
            <div className="text-2xl font-bold text-loft-dark">{summary.total}</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" className="border-loft-border shadow-2xs">
            <div className="text-xs text-loft-muted font-medium mb-1">Atualizações disponíveis</div>
            <div className="text-2xl font-bold text-[#FF774A]">
              {hasScanned ? summary.withUpdate : '—'}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" className="border-loft-border shadow-2xs">
            <div className="text-xs text-loft-muted font-medium mb-1">Falhas de consulta ao registry</div>
            <div className="text-2xl font-bold text-red-500">
              {hasScanned ? summary.withError : '—'}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Standard Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Filtrar pacotes por nome ou versão atual..."
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
            placeholder="Ecossistema"
            allowClear
            value={ecosystemFilter}
            onChange={(val) => {
              setEcosystemFilter(val);
              resetToFirstPage();
            }}
            className="w-48"
            options={[
              { value: 'npm', label: 'Frontend · NPM' },
              { value: 'pip', label: 'Backend · PyPI' },
            ]}
          />
          <Select
            placeholder="Status de Atualização"
            allowClear
            value={updateFilter}
            onChange={(val) => {
              setUpdateFilter(val);
              resetToFirstPage();
            }}
            className="w-52"
            options={[
              { value: 'update_available', label: 'Atualização disponível' },
              { value: 'up_to_date', label: 'Atualizado' },
              { value: 'error', label: 'Erro na consulta' },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tag color={hasScanned ? 'green' : 'default'} className="m-0 font-semibold">
            {hasScanned ? 'Verificado ao vivo' : 'Catálogo local carregado'}
          </Tag>
          <span className="text-xs text-loft-muted font-medium">
            Exibindo {paginatedEntries.length} de {filteredEntries.length} pacote(s)
          </span>
        </div>
      </div>

      {/* Standard Table + Bottom URL Pagination Container */}
      <div className="bg-white rounded-xl border border-loft-border overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-loft-border flex items-center justify-between bg-[#FAFBFD]">
          <div className="flex items-center gap-2">
            <CloudSyncOutlined className="text-[#FF774A]" />
            <span className="font-bold text-sm text-loft-dark">Pacotes do Stack da Plataforma</span>
          </div>
          {!hasScanned && (
            <span className="text-xs text-loft-muted">
              Clique em <b>Buscar Atualizações</b> para consultar novas versões no npm e PyPI sob demanda.
            </span>
          )}
        </div>

        {scanning && entries.length === 0 ? (
          <div className="p-8">
            <LoadingState tip="Consultando npm e PyPI, isso pode levar alguns segundos..." />
          </div>
        ) : (
          <>
            <Table<LibraryUpdateEntry>
              dataSource={paginatedEntries}
              columns={columns}
              rowKey={(r) => rowKeyOf(r)}
              size="middle"
              loading={scanning || statusLoading}
              pagination={false}
              scroll={{ x: 1100 }}
            />
            <div className="p-4 border-t border-loft-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-loft-muted font-medium">
                Página {currentPage} — Exibindo {paginatedEntries.length} de {filteredEntries.length} pacotes
              </span>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredEntries.length}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
                showSizeChanger
                pageSizeOptions={['5', '10', '20', '50']}
              />
            </div>
          </>
        )}
      </div>

      <Drawer
        title={
          drawerEntry
            ? `Resultado do teste — ${drawerEntry.package}@${drawerResult?.version ?? ''}`
            : 'Resultado do teste'
        }
        open={!!resultDrawerKey}
        onClose={() => setResultDrawerKey(null)}
        width={560}
      >
        {drawerResult && (
          <div className="space-y-4">
            <Space wrap>
              {drawerResult.passed ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>Passou</Tag>
              ) : (
                <Tag color="red" icon={<CloseCircleOutlined />}>Falhou</Tag>
              )}
              {drawerResult.step_failed && (
                <Tag color="volcano">Etapa que falhou: {drawerResult.step_failed}</Tag>
              )}
              <Tag color={drawerResult.vulnerabilities_found > 0 ? 'orange' : 'default'} icon={<BugOutlined />}>
                {drawerResult.vulnerabilities_found} vulnerabilidade{drawerResult.vulnerabilities_found === 1 ? '' : 's'} encontrada{drawerResult.vulnerabilities_found === 1 ? '' : 's'}
              </Tag>
            </Space>

            {!drawerResult.passed && (
              <Alert
                type="error"
                showIcon
                message="Teste reprovado"
                description="Esta versão não pode ser aplicada até que passe no teste de instalação e build."
              />
            )}

            {drawerResult.passed && (
              <Alert
                type="success"
                showIcon
                icon={<SafetyOutlined />}
                message="Teste aprovado"
                description='O botão "Aplicar" está liberado para esta combinação de pacote e versão.'
              />
            )}

            <Collapse
              items={[
                {
                  key: 'log',
                  label: 'Log de instalação / build (clique para expandir)',
                  children: (
                    <Paragraph className="!mb-0">
                      <pre className="whitespace-pre-wrap break-words text-xs font-mono bg-[#0B1120] text-[#D1D9E6] p-3 rounded-lg max-h-96 overflow-y-auto">
                        {drawerResult.log_excerpt || '(log vazio)'}
                      </pre>
                    </Paragraph>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};
