import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Button, Spin, Progress } from 'antd';
import {
  AppstoreOutlined,
  LayoutOutlined,
  BlockOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { navigateTo } from '@/router/navigation';
import { dashboardService } from '@/services/dashboard.service';
import type { DashboardMetrics, EngineeringHealthMetrics } from '@/types/domain.types';

export const CatalogHubPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [health, setHealth] = useState<EngineeringHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getMetrics(),
      dashboardService.getEngineeringHealth(),
    ])
      .then(([metricsData, healthData]) => {
        setMetrics(metricsData);
        setHealth(healthData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  const catalogSections = [
    {
      title: 'Componentes Copan',
      count: metrics?.components_count || 0,
      description: 'Componentes React/TypeScript homologados do Design System Olivelas Portal com tokens semânticos e estados acessíveis.',
      icon: <AppstoreOutlined className="text-xl text-loft-orange" />,
      route: '/catalog/components',
      tag: 'UI Foundation & Data Display',
      tagColor: 'orange',
    },
    {
      title: 'Templates de Aplicação',
      count: metrics?.templates_count || 0,
      description: 'Arquétipos e layouts estruturados de portais administrativos, dashboards, fluxos de auth e visualizadores.',
      icon: <LayoutOutlined className="text-xl text-[#0066CC]" />,
      route: '/catalog/templates',
      tag: 'Application Archetypes',
      tagColor: 'blue',
    },
    {
      title: 'Módulos de Domínio',
      count: metrics?.modules_count || 0,
      description: 'Blocos funcionais reutilizáveis contendo rotas de API, contratos schemas, regras e componentes acoplados.',
      icon: <BlockOutlined className="text-xl text-loft-success" />,
      route: '/catalog/modules',
      tag: 'Domain Capabilities',
      tagColor: 'green',
    },
    {
      title: 'Golden Rules',
      count: metrics?.rules_count || 0,
      description: 'Padrões de engenharia compulsórios de arquitetura, segurança, design system, consistência de API e testes.',
      icon: <SafetyCertificateOutlined className="text-xl text-[#805AD5]" />,
      route: '/knowledge/rules',
      tag: 'Governance & Standards',
      tagColor: 'purple',
    },
    {
      title: 'Arquiteturas Padrão',
      count: metrics?.architectures_count || 0,
      description: 'Blueprints de topologia técnica (Modular Monolith, Layered FastAPI + React, Event-Driven, Microservices).',
      icon: <ApartmentOutlined className="text-xl text-[#D69E2E]" />,
      route: '/knowledge/architectures',
      tag: 'Topology & Layout',
      tagColor: 'gold',
    },
    {
      title: 'Especificações (SDDs)',
      count: metrics?.specifications_count || 0,
      description: 'Documentos técnicos de especificação com markdown completo de arquitetura, frontend, backend e segurança.',
      icon: <FileTextOutlined className="text-xl text-[#4A5568]" />,
      route: '/knowledge/specifications',
      tag: 'Technical Docs',
      tagColor: 'default',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Catálogo Unificado de Engenharia"
        subtitle="Navegue e inspecione todos os ativos homologados da plataforma: componentes, templates, módulos, regras e arquiteturas."
        breadcrumbs={[
          { title: 'Engineering Workspace' },
          { title: 'Catálogo de Engenharia' },
        ]}
        actions={
          <Button
            type="primary"
            style={{ backgroundColor: '#F56738' }}
            onClick={() => navigateTo('/workshop')}
          >
            Abrir Blueprint Studio
          </Button>
        }
      />

      {/* Health Overview Banner */}
      {health && (
        <Card className="border border-loft-border shadow-2xs rounded-xl bg-linear-to-r from-[#FAFBFD] to-white p-2">
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={6}>
              <div className="text-xs font-bold text-loft-muted uppercase tracking-wider">
                Saúde do Catálogo
              </div>
              <div className="text-2xl font-black text-loft-dark mt-1 flex items-center gap-2">
                <CheckCircleOutlined className="text-loft-success" />
                <span>100% Homologado</span>
              </div>
              <div className="text-xs text-[#829AB1] mt-1">
                {health.total_components + health.total_modules + health.total_templates} blocos de construção catalogados
              </div>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <div className="text-xs text-loft-muted">Componentes Publicados</div>
              <div className="text-lg font-bold text-loft-success">
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
              <div className="text-lg font-bold text-loft-orange">
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
              <div className="text-xs text-loft-muted">Violações de Regras Críticas</div>
              <div className="text-lg font-bold text-loft-dark">
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
              <div className="text-xs text-loft-muted">Deprecations Ativas</div>
              <div className="text-lg font-bold text-loft-muted">
                {health.components_deprecated} componentes
              </div>
              <div className="text-[11px] text-[#829AB1]">
                {health.missing_dependencies_count} dependências pendentes
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Catalog Hub Grid */}
      <Row gutter={[24, 24]}>
        {catalogSections.map((sec, idx) => (
          <Col xs={24} md={12} lg={8} key={idx}>
            <Card
              hoverable
              onClick={() => navigateTo(sec.route)}
              className="h-full border border-loft-border shadow-2xs hover:shadow-md transition-all rounded-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-loft-bg flex items-center justify-center">
                    {sec.icon}
                  </div>
                  <Tag color={sec.tagColor} className="font-semibold text-xs m-0">
                    {sec.tag}
                  </Tag>
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-base font-bold text-loft-dark">{sec.title}</h3>
                  <span className="text-xl font-black text-[#334E68]">{sec.count}</span>
                </div>

                <p className="text-xs text-loft-muted line-clamp-3 leading-relaxed mt-2">
                  {sec.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-loft-border flex items-center justify-between text-xs font-semibold text-loft-orange">
                <span>Explorar catálogo</span>
                <ArrowRightOutlined />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
