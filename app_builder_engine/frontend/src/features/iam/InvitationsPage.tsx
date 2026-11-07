import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm, Tooltip, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, CloseCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { StatusTag } from '@/components/loft/StatusTag';
import { iamService } from '@/services/iam.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type { IamInvitation, IamGroup, IamRole } from '@/types/iam.types';

const { Text } = Typography;

export const InvitationsPage: React.FC = () => {
  const [invitations, setInvitations] = useState<IamInvitation[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [groups, setGroups] = useState<IamGroup[]>([]);
  const [roles, setRoles] = useState<IamRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentPage, pageSize, onPaginationChange } = useUrlPagination(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await iamService.getInvitationsPaginated({
        page: currentPage,
        page_size: pageSize,
      });
      setInvitations(res.items);
      setTotalItems(res.total);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar convites');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const fetchDependencies = async () => {
    try {
      const [g, r] = await Promise.all([
        iamService.getGroups(),
        iamService.getRoles(),
      ]);
      setGroups(g);
      setRoles(r);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const handleCreateInvitation = async (values: any) => {
    try {
      await iamService.createInvitation(values);
      message.success('Convite enviado com sucesso!');
      setIsModalOpen(false);
      form.resetFields();
      fetchInvitations();
    } catch (err: any) {
      message.error(err.message || 'Erro ao enviar convite');
    }
  };

  const handleCancelInvitation = async (inv: IamInvitation) => {
    try {
      await iamService.cancelInvitation(inv.id);
      message.success(`Convite para ${inv.email} cancelado.`);
      fetchInvitations();
    } catch (err: any) {
      message.error(err.message || 'Erro ao cancelar convite');
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(link);
    message.success('Link do convite copiado para a área de transferência!');
  };

  const columns = [
    {
      title: 'E-mail do Convidado',
      key: 'email',
      render: (_: any, record: IamInvitation) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827' }}>{record.email}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Convidado por: {record.invited_by_name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Papel Proposto',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: 'Expira Em',
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (date: string) => new Date(date).toLocaleString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: IamInvitation) => (
        <Space size={8}>
          {record.status === 'Pending' && (
            <>
              <Tooltip title="Copiar Link de Convite">
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyLink(record.token)}
                />
              </Tooltip>
              <Popconfirm
                title="Cancelar Convite"
                description={`Deseja cancelar o convite de ${record.email}?`}
                onConfirm={() => handleCancelInvitation(record)}
                okButtonProps={{ danger: true }}
              >
                <Button type="text" danger icon={<CloseCircleOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Convites de Acesso"
        subtitle="Gerenciamento de convites externos com definição de papéis e expiração segura"
        breadcrumbs={[
          { title: 'IAM' },
          { title: 'Convites' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchInvitations} loading={loading}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              onClick={() => {
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Convidar Membro
            </Button>
          </Space>
        }
      />
      <Table
        dataSource={invitations}
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

      <Modal
        title="Enviar Convite de Acesso"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Gerar Convite"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateInvitation}>
          <Form.Item name="email" label="E-mail Corporativo" rules={[{ required: true, type: 'email', message: 'Insira um e-mail válido' }]}>
            <Input placeholder="ex: novo.engenheiro@loft.com.br" />
          </Form.Item>
          <Form.Item name="role_id" label="Papel Inicial" rules={[{ required: true, message: 'Selecione o papel' }]}>
            <Select placeholder="Selecione o papel">
              {roles.map((r) => (
                <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="group_id" label="Grupo Inicial">
            <Select placeholder="Selecione o grupo (opcional)" allowClear>
              {groups.map((g) => (
                <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
