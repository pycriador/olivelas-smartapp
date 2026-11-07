import React from 'react';
import { Button, Card, Row, Col, Typography, Tag, Space, Collapse } from 'antd';
import {
  RocketOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  BookOutlined,
  ApiOutlined,
  LoginOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const { Title, Paragraph, Text } = Typography;

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuthStore();

  const features = [
    {
      icon: <AppstoreOutlined style={{ fontSize: 28, color: '#FF774A' }} />,
      title: 'Catálogo Canônico 360°',
      description: '180 componentes reais (80 frontend e 100 backend) indexados diretamente da base de código da Loft com preview, contratos de props e rastreabilidade.',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 28, color: '#FF774A' }} />,
      title: 'Blueprint Engine',
      description: 'Motor determinístico de composição arquitetural, resolução de grafos de dependências e validação de conformidade com Golden Rules.',
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: '#0B6B4F' }} />,
      title: 'Enterprise IAM & RBAC',
      description: 'Gestão de acessos com Argon2id, JWT Tokens com rotação, Matriz de Permissões granular por Módulo e auditoria criptográfica de sessões.',
    },
    {
      icon: <BookOutlined style={{ fontSize: 28, color: '#1677FF' }} />,
      title: 'Governança SDD & Rules',
      description: 'Centralização de todos os volumes SDD (Volumes I a X) e Golden Rules para garantir consistência total de design system e engenharia.',
    },
    {
      icon: <ApiOutlined style={{ fontSize: 28, color: '#722ED1' }} />,
      title: 'Loft AI Gateway',
      description: 'Camada de integração para Agentes de IA consultarem o catálogo, proporem blueprints validados e gerarem código aderente às diretrizes.',
    },
    {
      icon: <SettingOutlined style={{ fontSize: 28, color: '#FA8C16' }} />,
      title: 'Auditoria & Observabilidade',
      description: 'Trilha de auditoria completa em tempo real, registro de todas as mutações e governança de releases de software.',
    },
  ];

  const faqs = [
    {
      key: '1',
      label: 'O que é o Loft App Builder Engine?',
      children: 'É a plataforma central de engenharia e governança da Loft para composição, validação e orquestração de aplicações web utilizando componentes do Design System Copan e especificações SDD.',
    },
    {
      key: '2',
      label: 'Como funciona o controle de permissões (IAM)?',
      children: 'O sistema utiliza um modelo RBAC dinâmico onde usuários pertencem a Grupos e recebem Roles com permissões granulares por Módulo (Catalog, Blueprints, IAM, Governance, etc.).',
    },
    {
      key: '3',
      label: 'Quais componentes estão disponíveis no catálogo?',
      children: 'O catálogo conta com todos os componentes canônicos da Loft (PageContainer, DataTable, FilterBar, StatusTag, KPIWidget, AppSwitcher, etc.) e serviços de backend padronizados.',
    },
  ];

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <div
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Space size={12} align="center">
          <div
            style={{
              width: 36,
              height: 36,
              background: '#FF774A',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            L
          </div>
          <div>
            <Text strong style={{ fontSize: 16, color: '#1F2937' }}>
              Loft App Builder
            </Text>
            <Tag color="orange" style={{ marginLeft: 8, fontSize: 11, borderRadius: 10 }}>
              v1.0 Canônica
            </Tag>
          </div>
        </Space>

        <Space size={16}>
          <Button type="text" onClick={() => onNavigate('/catalog')}>
            Catálogo 360°
          </Button>
          <Button type="text" onClick={() => onNavigate('/blueprints')}>
            Blueprints
          </Button>
          <Button type="text" onClick={() => onNavigate('/governance/rules')}>
            Golden Rules
          </Button>
          {isAuthenticated ? (
            <Button
              type="primary"
              icon={<RocketOutlined />}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              onClick={() => onNavigate('/dashboard')}
            >
              Ir para o Painel ({user?.name.split(' ')[0]})
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              onClick={() => onNavigate('/login')}
            >
              Fazer Login
            </Button>
          )}
        </Space>
      </div>

      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F2 100%)',
          padding: '80px 40px 60px',
          textAlign: 'center',
        }}
      >
        <Tag color="orange" style={{ padding: '4px 16px', borderRadius: 20, fontSize: 13, marginBottom: 20 }}>
          🚀 Plataforma Oficial de Engenharia & Design System Copan
        </Tag>
        <Title level={1} style={{ fontSize: 44, fontWeight: 800, color: '#111827', maxWidth: 850, margin: '0 auto 20px' }}>
          Construa, Valide e Governe Aplicações Loft com Alta Velocidade
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#4B5563', maxWidth: 700, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Ecossistema fullstack com 180 componentes canônicos, motor determinístico de blueprints, segurança IAM empresarial e conformidade com as diretrizes do SDD.
        </Paragraph>
        <Space size={16}>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            style={{
              background: '#FF774A',
              borderColor: '#FF774A',
              height: 48,
              padding: '0 32px',
              fontSize: 16,
              borderRadius: 8,
              fontWeight: 600,
            }}
            onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/login')}
          >
            {isAuthenticated ? 'Acessar Dashboard' : 'Começar Agora'}
          </Button>
          <Button
            size="large"
            icon={<AppstoreOutlined />}
            style={{ height: 48, padding: '0 28px', fontSize: 16, borderRadius: 8 }}
            onClick={() => onNavigate('/catalog')}
          >
            Explorar Catálogo 360°
          </Button>
        </Space>

        {/* Quick stats pills */}
        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          <Card size="small" style={{ borderRadius: 12, border: '1px solid #FFE6DE', background: '#FFFFFF', minWidth: 150 }}>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>COMPONENTES REAIS</Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#FF774A' }}>180</div>
          </Card>
          <Card size="small" style={{ borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF', minWidth: 150 }}>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>VOLUMES SDD</Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>10</div>
          </Card>
          <Card size="small" style={{ borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF', minWidth: 150 }}>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>GOLDEN RULES</Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0B6B4F' }}>5</div>
          </Card>
          <Card size="small" style={{ borderRadius: 12, border: '1px solid #E5E7EB', background: '#FFFFFF', minWidth: 150 }}>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>MÓDULO IAM</Text>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1677FF' }}>RBAC v1</div>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={2} style={{ color: '#111827', fontWeight: 700 }}>
            Recursos da Plataforma
          </Title>
          <Text style={{ color: '#6B7280', fontSize: 16 }}>
            Tudo o que engenheiros, arquitetos e agentes precisam para entregar software de classe mundial
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {features.map((f, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ marginBottom: 16 }}>{f.icon}</div>
                <Title level={4} style={{ fontSize: 18, marginBottom: 10, color: '#1F2937' }}>
                  {f.title}
                </Title>
                <Paragraph style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>
                  {f.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* FAQ Section */}
      <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#111827', fontWeight: 700 }}>
            Perguntas Frequentes
          </Title>
        </div>
        <Collapse items={faqs} defaultActiveKey={['1']} style={{ background: '#FFFFFF', borderRadius: 12 }} />
      </div>

      {/* Footer */}
      <div style={{ background: '#111827', color: '#9CA3AF', padding: '40px 24px', marginTop: 80, textAlign: 'center' }}>
        <Space size={16} style={{ marginBottom: 16 }}>
          <Button type="link" style={{ color: '#D1D5DB' }} onClick={() => onNavigate('/catalog')}>Catálogo</Button>
          <Button type="link" style={{ color: '#D1D5DB' }} onClick={() => onNavigate('/blueprints')}>Blueprints</Button>
          <Button type="link" style={{ color: '#D1D5DB' }} onClick={() => onNavigate('/iam/users')}>IAM & Usuários</Button>
          <Button type="link" style={{ color: '#D1D5DB' }} onClick={() => onNavigate('/governance/audit')}>Auditoria</Button>
        </Space>
        <div>
          <Text style={{ color: '#6B7280', fontSize: 13 }}>
            © 2026 Loft Inc. — Plataforma de Engenharia e Composição Arquitetural. Todos os direitos reservados.
          </Text>
        </div>
      </div>
    </div>
  );
};
