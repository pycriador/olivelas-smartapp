import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Typography, Tooltip } from 'antd';
import { DesktopOutlined, DeleteOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { iamService } from '@/services/iam.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type { IamSession } from '@/types/iam.types';

const { Text } = Typography;

export const SessionsManagementPage: React.FC = () => {
  const [sessions, setSessions] = useState<IamSession[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentPage, pageSize, onPaginationChange } = useUrlPagination(10);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await iamService.getSessionsPaginated({
        page: currentPage,
        page_size: pageSize,
      });
      setSessions(res.items);
      setTotalItems(res.total);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar sessões ativas');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleTerminateSession = async (session: IamSession) => {
    try {
      await iamService.terminateSession(session.id);
      message.success(`Sessão de ${session.user_name} encerrada com sucesso.`);
      fetchSessions();
    } catch (err: any) {
      message.error(err.message || 'Erro ao encerrar sessão');
    }
  };

  const handleTerminateAllUser = async (userId: string, userName: string) => {
    try {
      await iamService.terminateAllUserSessions(userId);
      message.success(`Todas as sessões de ${userName} foram encerradas.`);
      fetchSessions();
    } catch (err: any) {
      message.error(err.message || 'Erro ao encerrar sessões do usuário');
    }
  };

  const columns = [
    {
      title: 'Usuário',
      key: 'user',
      render: (_: any, record: IamSession) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827' }}>{record.user_name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.user_email}</Text>
        </div>
      ),
    },
    {
      title: 'Dispositivo / Navegador',
      key: 'device',
      render: (_: any, record: IamSession) => (
        <Space size={8}>
          <DesktopOutlined style={{ color: '#FF774A' }} />
          <span>{record.browser} no {record.os_name}</span>
        </Space>
      ),
    },
    {
      title: 'Endereço IP',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (ip: string) => <Tag color="geekblue">{ip}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? 'Ativa' : 'Encerrada'}
        </Tag>
      ),
    },
    {
      title: 'Última Atividade',
      dataIndex: 'last_activity',
      key: 'last_activity',
      render: (date: string) => new Date(date).toLocaleString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: IamSession) => (
        <Space size={8}>
          {record.is_active && (
            <Popconfirm
              title="Encerrar Sessão"
              description="Deseja revogar o token desta sessão?"
              onConfirm={() => handleTerminateSession(record)}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
                Encerrar
              </Button>
            </Popconfirm>
          )}
          <Tooltip title="Encerrar todas as sessões deste usuário">
            <Button
              type="text"
              icon={<StopOutlined />}
              onClick={() => handleTerminateAllUser(record.user_id, record.user_name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Sessões & Tokens Ativos"
        subtitle="Monitoramento em tempo real de dispositivos conectados e revogação de acessos"
        breadcrumbs={[
          { title: 'IAM' },
          { title: 'Sessões' },
        ]}
        actions={
          <Button icon={<ReloadOutlined />} onClick={fetchSessions} loading={loading}>
            Atualizar
          </Button>
        }
      />
      <Table
        dataSource={sessions}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: onPaginationChange,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};
