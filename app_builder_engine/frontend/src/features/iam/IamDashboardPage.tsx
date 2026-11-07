import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, Typography, Spin, message } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  DesktopOutlined,
  ReloadOutlined,
  PlusOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { ContentSection } from '@/components/loft/ContentSection';
import { iamService } from '@/services/iam.service';
import type { IamDashboardStats } from '@/types/iam.types';

const { Text } = Typography;

interface IamDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const IamDashboardPage: React.FC<IamDashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<IamDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await iamService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar estatísticas do IAM');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const auditColumns = [
    {
      title: 'Ação',
      dataIndex: 'action',
      key: 'action',
      render: (val: string) => {
        let color = 'blue';
        if (val.includes('LOGIN')) color = 'green';
        if (val.includes('LOCK') || val.includes('DELETE')) color = 'red';
        if (val.includes('CREATE')) color = 'orange';
        return <Tag color={color} style={{ fontWeight: 600 }}>{val}</Tag>;
      },
    },
    {
      title: 'Usuário / Ator',
      dataIndex: 'actor',
      key: 'actor',
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: 'Recurso',
      dataIndex: 'resource',
      key: 'resource',
      render: (val: string) => <Tag>{val}</Tag>,
    },
    {
      title: 'Resultado',
      dataIndex: 'result',
      key: 'result',
      render: (val: string) => (
        <Tag color={val === 'SUCCESS' ? 'success' : 'error'}>{val}</Tag>
      ),
    },
    {
      title: 'Data / Hora',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (val: string) => new Date(val).toLocaleString('pt-BR'),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Painel de Controle IAM"
        subtitle="Governança centralizada de identidades, autenticação Argon2id, RBAC dinâmico e auditoria"
        breadcrumbs={[
          { title: 'Início', onClick: () => onNavigate('/') },
          { title: 'Administração IAM' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchStats} loading={loading}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              onClick={() => onNavigate('/iam/users')}
            >
              Novo Usuário
            </Button>
          </Space>
        }
      />
      {loading && !stats ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{ borderRadius: 12, border: '1px solid #E5E7EB', cursor: 'pointer' }}
                onClick={() => onNavigate('/iam/users')}
              >
                <Statistic
                  title={<Text style={{ color: '#6B7280' }}>Usuários Cadastrados</Text>}
                  value={stats?.total_users || 0}
                  prefix={<UserOutlined style={{ color: '#FF774A', marginRight: 8 }} />}
                  suffix={<Text style={{ fontSize: 13, color: '#0B6B4F' }}>({stats?.active_users || 0} ativos)</Text>}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{ borderRadius: 12, border: '1px solid #E5E7EB', cursor: 'pointer' }}
                onClick={() => onNavigate('/iam/groups')}
              >
                <Statistic
                  title={<Text style={{ color: '#6B7280' }}>Grupos de Acesso</Text>}
                  value={stats?.total_groups || 0}
                  prefix={<TeamOutlined style={{ color: '#1677FF', marginRight: 8 }} />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{ borderRadius: 12, border: '1px solid #E5E7EB', cursor: 'pointer' }}
                onClick={() => onNavigate('/iam/roles')}
              >
                <Statistic
                  title={<Text style={{ color: '#6B7280' }}>Roles & Privilégios</Text>}
                  value={stats?.total_roles || 0}
                  prefix={<SafetyCertificateOutlined style={{ color: '#0B6B4F', marginRight: 8 }} />}
                  suffix={<Text style={{ fontSize: 13, color: '#6B7280' }}>({stats?.total_permissions || 0} perms)</Text>}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                hoverable
                style={{ borderRadius: 12, border: '1px solid #E5E7EB', cursor: 'pointer' }}
                onClick={() => onNavigate('/iam/sessions')}
              >
                <Statistic
                  title={<Text style={{ color: '#6B7280' }}>Sessões Ativas</Text>}
                  value={stats?.active_sessions || 0}
                  prefix={<DesktopOutlined style={{ color: '#722ED1', marginRight: 8 }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* Management Hub Cards */}
          <ContentSection title="Módulos de Governança de Acesso">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{ borderRadius: 12 }}
                  onClick={() => onNavigate('/iam/users')}
                  actions={[<span key="go">Gerenciar Usuários <ArrowRightOutlined /></span>]}
                >
                  <Card.Meta
                    avatar={<UserOutlined style={{ fontSize: 28, color: '#FF774A' }} />}
                    title="Gestão de Usuários"
                    description="Cadastro completo, reset de senhas, bloqueio por tentativas e associação a grupos."
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{ borderRadius: 12 }}
                  onClick={() => onNavigate('/iam/groups')}
                  actions={[<span key="go">Gerenciar Grupos <ArrowRightOutlined /></span>]}
                >
                  <Card.Meta
                    avatar={<TeamOutlined style={{ fontSize: 28, color: '#1677FF' }} />}
                    title="Grupos & Membros"
                    description="Agrupamento organizacional com herança de roles e customização de cores/ícones."
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{ borderRadius: 12 }}
                  onClick={() => onNavigate('/iam/matrix')}
                  actions={[<span key="go">Ver Matriz RBAC <ArrowRightOutlined /></span>]}
                >
                  <Card.Meta
                    avatar={<KeyOutlined style={{ fontSize: 28, color: '#0B6B4F' }} />}
                    title="Matriz de Permissões"
                    description="Visualização 360° de privilégios cruzando papéis, módulos e grupos de permissão."
                  />
                </Card>
              </Col>
            </Row>
          </ContentSection>

          {/* Recent Security & Audit Logs */}
          <ContentSection title="Trilha de Auditoria Recente">
            <Table
              dataSource={stats?.recent_logs || []}
              columns={auditColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </ContentSection>
        </>
      )}
    </PageContainer>
  );
};
