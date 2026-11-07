import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, List, Tag, Typography, Progress } from 'antd';
import {
  AppstoreOutlined,
  BlockOutlined,
  SafetyCertificateOutlined,
  BuildOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  RocketOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  LayoutOutlined,
  ApartmentOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState } from '@/components/ui/FeedbackStates';
import { dashboardService } from '@/services/dashboard.service';
import { useUIStore } from '@/stores/uiStore';
import { navigateTo } from '@/router/navigation';
import type { DashboardMetrics, EngineeringHealthMetrics, AuditLog } from '@/types/domain.types';

const { Text } = Typography;

export const DashboardPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [health, setHealth] = useState<EngineeringHealthMetrics | null>(null);
  const [activity, setActivity] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [m, h, a] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getEngineeringHealth(),
        dashboardService.getActivity(8),
      ]);
      setMetrics(m);
      setHealth(h);
      setActivity(a);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar métricas do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingState tip="Carregando métricas da plataforma..." />;
  if (error) return <ErrorState description={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering Workspace"
        subtitle="Central de governança, catálogos e composição de arquiteturas padronizadas Loft"
        breadcrumbs={[
          { title: 'Engineering Workspace' },
          { title: 'Dashboard' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              type="primary"
              style={{ backgroundColor: '#F56738' }}
              icon={<BuildOutlined />}
              onClick={() => navigateTo('/workshop')}
            >
              Blueprint Studio
            </Button>
            <Button
              icon={<RobotOutlined />}
              onClick={() => navigateTo('/ai/composer')}
            >
              AI Composer
            </Button>
          </div>
        }
      />

      {/* Real-Time Engineering Health Indicator Banner */}
      {health && (
        <Card className="border border-loft-border shadow-2xs rounded-xl bg-linear-to-r from-[#FAFBFD] to-white p-2">
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={6}>
              <div className="text-xs font-bold text-loft-muted uppercase tracking-wider">
                Saúde da Engenharia
              </div>
              <div className="text-xl font-black text-loft-dark mt-0.5 flex items-center gap-2">
                <CheckCircleOutlined className="text-loft-success" />
                <span>100% Homologado</span>
              </div>
              <div className="text-xs text-[#829AB1]">
                Padrões Loft Portal & Copan Enforced
              </div>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <div className="text-xs text-loft-muted">Componentes Ativos</div>
              <div className="text-base font-bold text-loft-success">
                {health.components_published} / {health.total_components}
              </div>
              <Progress
                percent={Math.round((health.components_published / (health.total_components || 1)) * 100)}
                size="small"
                strokeColor="#20A483"
                showInfo={false}
              />
            </Col>

            <Col xs={12} sm={6} md={4}>
              <div className="text-xs text-loft-muted">Blueprints Prontos</div>
              <div className="text-base font-bold text-loft-orange">
                {health.blueprints_ready} / {health.total_blueprints}
              </div>
              <Progress
                percent={Math.round((health.blueprints_ready / (health.total_blueprints || 1)) * 100)}
                size="small"
                strokeColor="#F56738"
                showInfo={false}
              />
            </Col>

            <Col xs={12} sm={6} md={5}>
              <div className="text-xs text-loft-muted">Violações de Regras</div>
              <div className="text-base font-bold text-loft-dark">
                {health.critical_rule_violations_count === 0 ? (
                  <span className="text-loft-success">0 Violações</span>
                ) : (
                  <span className="text-[#E12D39] flex items-center gap-1">
                    <AlertOutlined /> {health.critical_rule_violations_count}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#829AB1]">
                Compliance com Golden Rules
              </div>
            </Col>

            <Col xs={12} sm={6} md={5}>
              <div className="text-xs text-loft-muted">Deprecations & Bloqueios</div>
              <div className="text-base font-bold text-loft-muted">
                {health.components_deprecated} componentes
              </div>
              <div className="text-[11px] text-[#829AB1]">
                {health.missing_dependencies_count} dependências pendentes
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* KPI Cards Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigateTo('/catalog/components')}
            className="border-t-4 border-t-loft-orange transition shadow-2xs hover:shadow-md cursor-pointer"
          >
            <Statistic
              title={<span className="text-xs font-semibold text-loft-muted uppercase">Componentes Copan</span>}
              value={metrics?.components_count || 0}
              prefix={<AppstoreOutlined className="text-loft-orange mr-2" />}
              suffix={<span className="text-xs text-loft-muted">ativos</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigateTo('/catalog/templates')}
            className="border-t-4 border-t-[#0066CC] transition shadow-2xs hover:shadow-md cursor-pointer"
          >
            <Statistic
              title={<span className="text-xs font-semibold text-loft-muted uppercase">Templates de App</span>}
              value={metrics?.templates_count || 0}
              prefix={<LayoutOutlined className="text-[#0066CC] mr-2" />}
              suffix={<span className="text-xs text-loft-muted">arquétipos</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigateTo('/catalog/modules')}
            className="border-t-4 border-t-loft-success transition shadow-2xs hover:shadow-md cursor-pointer"
          >
            <Statistic
              title={<span className="text-xs font-semibold text-loft-muted uppercase">Módulos de Domínio</span>}
              value={metrics?.modules_count || 0}
              prefix={<BlockOutlined className="text-loft-success mr-2" />}
              suffix={<span className="text-xs text-loft-muted">módulos</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigateTo('/knowledge/rules')}
            className="border-t-4 border-t-loft-warning transition shadow-2xs hover:shadow-md cursor-pointer"
          >
            <Statistic
              title={<span className="text-xs font-semibold text-loft-muted uppercase">Golden Rules</span>}
              value={metrics?.rules_count || 0}
              prefix={<SafetyCertificateOutlined className="text-loft-warning mr-2" />}
              suffix={<span className="text-xs text-loft-muted">regras</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Sections */}
      <Row gutter={[24, 24]}>
        {/* Left Column: Workshop Callout & Quick Navigation */}
        <Col xs={24} lg={15}>
          <Card className="mb-6 bg-linear-to-r from-[#FFF5F2] to-white border-[#FDC4B2]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-loft-orange uppercase tracking-wider">
                  Blueprint Studio Interativo
                </span>
                <h2 className="text-xl font-bold text-loft-dark mt-1">
                  Monte a Arquitetura da sua Próxima Aplicação
                </h2>
                <p className="text-sm text-loft-muted mt-1 max-w-xl leading-relaxed">
                  Selecione módulos de negócio, componentes do Copan e veja o grafo de dependências e regras arquiteturais sendo resolvido em tempo real.
                </p>
              </div>
              <Button
                type="primary"
                size="large"
                style={{ backgroundColor: '#F56738' }}
                icon={<RocketOutlined />}
                onClick={() => navigateTo('/workshop')}
                className="shrink-0"
              >
                Abrir Blueprint Studio
              </Button>
            </div>
          </Card>

          {/* Catalog shortcuts */}
          <Card
            title="Catálogos de Engenharia"
            extra={
              <Button type="link" size="small" onClick={() => navigateTo('/catalog/hub')}>
                Ver Catalog Hub
              </Button>
            }
            className="shadow-2xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => navigateTo('/catalog/components')}
                className="p-4 border border-loft-border hover:border-loft-orange hover:bg-[#FFF9F6] rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF2EC] flex items-center justify-center text-loft-orange text-lg">
                    <AppstoreOutlined />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-loft-dark">Componentes Copan</div>
                    <div className="text-xs text-loft-muted">{metrics?.components_count} itens cadastrados</div>
                  </div>
                </div>
                <ArrowRightOutlined className="text-loft-muted" />
              </div>

              <div
                onClick={() => navigateTo('/catalog/templates')}
                className="p-4 border border-loft-border hover:border-[#0066CC] hover:bg-[#F0F7FF] rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF8FF] flex items-center justify-center text-[#0066CC] text-lg">
                    <LayoutOutlined />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-loft-dark">Templates de Aplicação</div>
                    <div className="text-xs text-loft-muted">{metrics?.templates_count} arquétipos</div>
                  </div>
                </div>
                <ArrowRightOutlined className="text-loft-muted" />
              </div>

              <div
                onClick={() => navigateTo('/catalog/modules')}
                className="p-4 border border-loft-border hover:border-loft-success hover:bg-[#F2FBF8] rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F8F5] flex items-center justify-center text-loft-success text-lg">
                    <BlockOutlined />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-loft-dark">Módulos de Domínio</div>
                    <div className="text-xs text-loft-muted">{metrics?.modules_count} módulos de negócio</div>
                  </div>
                </div>
                <ArrowRightOutlined className="text-loft-muted" />
              </div>

              <div
                onClick={() => navigateTo('/knowledge/rules')}
                className="p-4 border border-loft-border hover:border-loft-warning hover:bg-[#FEF8EE] rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FEF8EE] flex items-center justify-center text-loft-warning text-lg">
                    <SafetyCertificateOutlined />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-loft-dark">Golden Rules</div>
                    <div className="text-xs text-loft-muted">{metrics?.rules_count} padrões mandatórios</div>
                  </div>
                </div>
                <ArrowRightOutlined className="text-loft-muted" />
              </div>

              <div
                onClick={() => navigateTo('/knowledge/architectures')}
                className="p-4 border border-loft-border hover:border-[#D69E2E] hover:bg-[#FEFCF3] rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FEF9E7] flex items-center justify-center text-[#D69E2E] text-lg">
                    <ApartmentOutlined />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-loft-dark">Arquiteturas Padrão</div>
                    <div className="text-xs text-loft-muted">{metrics?.architectures_count} topologias</div>
                  </div>
                </div>
                <ArrowRightOutlined className="text-loft-muted" />
              </div>

              <div
                onClick={() => navigateTo('/knowledge/specifications')}
                className="p-4 border border-loft-border hover:border-loft-info hover:bg-[#EBF8FF] rounded-xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF8FF] flex items-center justify-center text-loft-info text-lg">
                    <FileTextOutlined />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-loft-dark">Especificações SDD</div>
                    <div className="text-xs text-loft-muted">{metrics?.specifications_count} documentos técnicos</div>
                  </div>
                </div>
                <ArrowRightOutlined className="text-loft-muted" />
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Activity Feed */}
        <Col xs={24} lg={9}>
          <Card
            title="Atividades Recentes & Auditoria"
            extra={
              <Button type="link" size="small" onClick={() => navigateTo('/admin/audit')}>
                Ver histórico
              </Button>
            }
            className="shadow-2xs"
          >
            <List
              dataSource={activity}
              renderItem={(log: any) => (
                <List.Item
                  className="cursor-pointer hover:bg-loft-bg px-2 rounded-lg transition"
                  onClick={() => openInspector360(log.entity_type || 'Component', log.entity_id || log.resource_id || '')}
                >
                  <div className="flex items-start gap-2.5 w-full">
                    <div className="w-2 h-2 rounded-full bg-loft-orange mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Tag className="text-[10px] font-semibold">
                          {typeof log.action === 'object' && log.action?.value ? log.action.value : String(log.action || '')}
                        </Tag>
                        <span className="text-[11px] text-[#829AB1] font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-loft-dark truncate mt-1">
                        {log.entity_id || log.resource_id}
                      </div>
                      <Text type="secondary" className="text-[11px] block truncate">
                        Por {log.actor || log.user_email}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
