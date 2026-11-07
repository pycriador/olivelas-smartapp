import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message, Popconfirm, Tooltip, Typography } from 'antd';
import { SafetyCertificateOutlined, PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { StatusTag } from '@/components/loft/StatusTag';
import { iamService } from '@/services/iam.service';
import type { IamRole, IamPermission } from '@/types/iam.types';

const { Text } = Typography;

export const RolesManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<IamRole[]>([]);
  const [permissions, setPermissions] = useState<IamPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IamRole | null>(null);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await iamService.getRoles();
      setRoles(data);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await iamService.getPermissions();
      setPermissions(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleSave = async (values: any) => {
    try {
      if (editingRole) {
        await iamService.updateRole(editingRole.id, values);
        message.success('Role atualizada com sucesso!');
      } else {
        await iamService.createRole(values);
        message.success('Role criada com sucesso!');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingRole(null);
      fetchRoles();
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar role');
    }
  };

  const handleDelete = async (role: IamRole) => {
    try {
      await iamService.deleteRole(role.id);
      message.success(`Role ${role.name} excluída.`);
      fetchRoles();
    } catch (err: any) {
      message.error(err.message || 'Erro ao excluir role');
    }
  };

  const openCreateModal = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (role: IamRole) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      category: role.category,
      priority: role.priority,
      description: role.description,
      status: role.status,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Papel (Role)',
      key: 'role',
      render: (_: any, record: IamRole) => (
        <Space size={12}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827',
              fontSize: 18,
            }}
          >
            <SafetyCertificateOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>
              {record.name}
              {record.is_system && (
                <Tag color="gold" style={{ marginLeft: 8, fontSize: 11 }}>
                  Sistema
                </Tag>
              )}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="geekblue">{cat}</Tag>,
    },
    {
      title: 'Prioridade',
      dataIndex: 'priority',
      key: 'priority',
      render: (prio: number) => <Tag color="purple">{prio}</Tag>,
    },
    {
      title: 'Permissões Atribuídas',
      dataIndex: 'permission_count',
      key: 'permission_count',
      render: (count: number) => <Tag color="cyan">{count} permissões</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: IamRole) => (
        <Space size={8}>
          <Tooltip title="Editar Role">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          </Tooltip>
          {!record.is_system && (
            <Popconfirm
              title="Excluir Role"
              description={`Deseja excluir ${record.name}?`}
              onConfirm={() => handleDelete(record)}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Papéis & Privilégios (Roles)"
        subtitle="Definição de perfis de autorização com hierarquia de prioridade e conjuntos de privilégios"
        breadcrumbs={[
          { title: 'IAM' },
          { title: 'Roles' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchRoles} loading={loading}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              onClick={openCreateModal}
            >
              Nova Role
            </Button>
          </Space>
        }
      />
      <Table
        dataSource={roles}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRole ? `Editar Role: ${editingRole.name}` : 'Criar Nova Role'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Salvar Role"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Nome do Papel" rules={[{ required: true, message: 'Insira o nome' }]}>
            <Input placeholder="ex: Tech Lead" />
          </Form.Item>
          <Form.Item name="category" label="Categoria" initialValue="Engineering">
            <Select>
              <Select.Option value="Engineering">Engineering</Select.Option>
              <Select.Option value="Security">Security</Select.Option>
              <Select.Option value="Governance">Governance</Select.Option>
              <Select.Option value="Observability">Observability</Select.Option>
              <Select.Option value="Custom">Custom</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Nível de Prioridade (1 a 100)" initialValue={50}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Descrição">
            <Input.TextArea placeholder="ex: Permissões de revisão e publicação de componentes de frontend" />
          </Form.Item>
          {!editingRole && (
            <Form.Item name="permission_ids" label="Permissões Iniciais">
              <Select mode="multiple" placeholder="Selecione as permissões">
                {permissions.map((p) => (
                  <Select.Option key={p.id} value={p.id}>{p.code} — {p.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageContainer>
  );
};
