import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { iamService } from '@/services/iam.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type { IamShare, IamUser, IamGroup } from '@/types/iam.types';

const { Text } = Typography;

export const ResourceSharingPage: React.FC = () => {
  const [shares, setShares] = useState<IamShare[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [users, setUsers] = useState<IamUser[]>([]);
  const [groups, setGroups] = useState<IamGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentPage, pageSize, onPaginationChange } = useUrlPagination(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchShares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await iamService.getSharesPaginated({
        page: currentPage,
        page_size: pageSize,
      });
      setShares(res.items);
      setTotalItems(res.total);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar compartilhamentos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const fetchDependencies = async () => {
    try {
      const [u, g] = await Promise.all([
        iamService.getUsers(),
        iamService.getGroups(),
      ]);
      setUsers(u);
      setGroups(g);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await iamService.createShare(values);
      message.success('Compartilhamento configurado com sucesso!');
      setIsModalOpen(false);
      form.resetFields();
      fetchShares();
    } catch (err: any) {
      message.error(err.message || 'Erro ao criar compartilhamento');
    }
  };

  const handleDelete = async (share: IamShare) => {
    try {
      await iamService.deleteShare(share.id);
      message.success('Compartilhamento revogado.');
      fetchShares();
    } catch (err: any) {
      message.error(err.message || 'Erro ao revogar compartilhamento');
    }
  };

  const columns = [
    {
      title: 'Tipo de Recurso',
      dataIndex: 'resource_type',
      key: 'resource_type',
      render: (type: string) => <Tag color="geekblue">{type}</Tag>,
    },
    {
      title: 'Identificador do Recurso',
      dataIndex: 'resource_id',
      key: 'resource_id',
      render: (id: string) => <Text code>{id}</Text>,
    },
    {
      title: 'Beneficiário (Grantee)',
      key: 'grantee',
      render: (_: any, record: IamShare) => (
        <Space size={8}>
          <Tag color={record.grantee_type === 'user' ? 'green' : 'orange'}>
            {record.grantee_type === 'user' ? 'Usuário' : 'Grupo'}
          </Tag>
          <Text strong>{record.grantee_name}</Text>
        </Space>
      ),
    },
    {
      title: 'Nível de Permissão',
      dataIndex: 'permission_level',
      key: 'permission_level',
      render: (lvl: string) => {
        let color = 'default';
        if (lvl === 'admin') color = 'magenta';
        else if (lvl === 'edit') color = 'blue';
        else if (lvl === 'comment') color = 'gold';
        else if (lvl === 'read') color = 'cyan';
        return <Tag color={color}>{lvl.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Concedido Por',
      dataIndex: 'grantor_name',
      key: 'grantor_name',
      render: (name: string) => <Text type="secondary">{name}</Text>,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: IamShare) => (
        <Popconfirm
          title="Revogar Acesso"
          description="Deseja revogar o compartilhamento deste recurso?"
          onConfirm={() => handleDelete(record)}
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Revogar
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Compartilhamento Granular de Recursos"
        subtitle="Concessão de privilégios de leitura, edição e administração em Blueprints e Projetos"
        breadcrumbs={[
          { title: 'IAM' },
          { title: 'Compartilhamento' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchShares} loading={loading}>
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
              Novo Compartilhamento
            </Button>
          </Space>
        }
      />
      <Table
        dataSource={shares}
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
        title="Compartilhar Recurso"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Conceder Acesso"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} initialValues={{ resource_type: 'Blueprint', permission_level: 'read', grantee_type: 'group' }}>
          <Form.Item name="resource_type" label="Tipo de Recurso" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Blueprint">Blueprint Arquitetural</Select.Option>
              <Select.Option value="Project">Projeto de Software</Select.Option>
              <Select.Option value="Template">Template Canônico</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="resource_id" label="ID do Recurso" rules={[{ required: true, message: 'Insira o ID do recurso' }]}>
            <Input placeholder="ex: bp_portal_fianca_aluguel" />
          </Form.Item>
          <Form.Item name="grantee_type" label="Compartilhar com" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="group">Grupo Organizacional</Select.Option>
              <Select.Option value="user">Usuário Específico</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.grantee_type !== cur.grantee_type}
          >
            {({ getFieldValue }) =>
              getFieldValue('grantee_type') === 'user' ? (
                <Form.Item name="grantee_id" label="Selecione o Usuário" rules={[{ required: true }]}>
                  <Select placeholder="Selecione o usuário">
                    {users.map((u) => (
                      <Select.Option key={u.id} value={u.id}>{u.name} ({u.email})</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item name="grantee_id" label="Selecione o Grupo" rules={[{ required: true }]}>
                  <Select placeholder="Selecione o grupo">
                    {groups.map((g) => (
                      <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item name="permission_level" label="Nível de Permissão" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="read">Leitura (Read)</Select.Option>
              <Select.Option value="comment">Comentário (Comment)</Select.Option>
              <Select.Option value="edit">Edição (Edit)</Select.Option>
              <Select.Option value="admin">Administração Total (Admin)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
