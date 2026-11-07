import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Avatar,
  message,
  Popconfirm,
  Tooltip,
  Switch,
  Typography,
} from 'antd';
import {
  UserAddOutlined,
  ReloadOutlined,
  KeyOutlined,
  UnlockOutlined,
  LockOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { FilterBar } from '@/components/loft/FilterBar';
import { StatusTag } from '@/components/loft/StatusTag';
import { iamService } from '@/services/iam.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type { IamUser, IamGroup, IamRole } from '@/types/iam.types';

const { Text } = Typography;

export const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<IamUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [groups, setGroups] = useState<IamGroup[]>([]);
  const [roles, setRoles] = useState<IamRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { currentPage, pageSize, onPaginationChange, resetToFirstPage } = useUrlPagination(10);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IamUser | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await iamService.getUsersPaginated({
        search: search || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        page_size: pageSize,
      });
      setUsers(res.items);
      setTotalItems(res.total);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, currentPage, pageSize]);

  const fetchDependencies = async () => {
    try {
      const [grps, rls] = await Promise.all([
        iamService.getGroups(),
        iamService.getRoles(),
      ]);
      setGroups(grps);
      setRoles(rls);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  // Handlers
  const handleCreateUser = async (values: any) => {
    try {
      await iamService.createUser(values);
      message.success('Usuário criado com sucesso!');
      setIsCreateModalOpen(false);
      createForm.resetFields();
      fetchUsers();
    } catch (err: any) {
      message.error(err.message || 'Erro ao criar usuário');
    }
  };

  const handleEditUser = async (values: any) => {
    if (!selectedUser) return;
    try {
      await iamService.updateUser(selectedUser.id, values);
      message.success('Usuário atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      message.error(err.message || 'Erro ao atualizar usuário');
    }
  };

  const handleAdminResetPassword = async (values: any) => {
    if (!selectedUser) return;
    try {
      await iamService.adminResetPassword(selectedUser.id, {
        new_password: values.new_password,
        force_change_on_login: values.force_change_on_login,
      });
      message.success('Senha resetada com sucesso!');
      setIsResetModalOpen(false);
      resetForm.resetFields();
    } catch (err: any) {
      message.error(err.message || 'Erro ao resetar senha');
    }
  };

  const handleUnlockUser = async (user: IamUser) => {
    try {
      await iamService.unlockUser(user.id);
      message.success(`Usuário ${user.name} desbloqueado.`);
      fetchUsers();
    } catch (err: any) {
      message.error(err.message || 'Erro ao desbloquear usuário');
    }
  };

  const handleDeleteUser = async (user: IamUser) => {
    try {
      await iamService.deleteUser(user.id);
      message.success(`Usuário ${user.name} excluído.`);
      fetchUsers();
    } catch (err: any) {
      message.error(err.message || 'Erro ao excluir usuário');
    }
  };

  const openEditModal = (user: IamUser) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      name: user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      is_active: user.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openResetModal = (user: IamUser) => {
    setSelectedUser(user);
    resetForm.resetFields();
    setIsResetModalOpen(true);
  };

  const columns = [
    {
      title: 'Usuário',
      key: 'user',
      render: (_: any, record: IamUser) => (
        <Space size={12}>
          <Avatar src={record.avatar_url || undefined} style={{ background: '#FF774A' }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              @{record.username} • {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Papel (Role)',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'default';
        if (role === 'Global Admin') color = 'magenta';
        else if (role === 'Admin') color = 'volcano';
        else if (role === 'Editor') color = 'blue';
        else if (role === 'Viewer') color = 'cyan';
        return <Tag color={color} style={{ fontWeight: 600 }}>{role}</Tag>;
      },
    },
    {
      title: 'Grupos',
      dataIndex: 'groups',
      key: 'groups',
      render: (grps: string[]) => (
        <Space size={4} wrap>
          {grps && grps.length > 0 ? (
            grps.map((g, i) => <Tag key={i} color="orange">{g}</Tag>)
          ) : (
            <Text type="secondary" style={{ fontSize: 12 }}>-</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: IamUser) => (
        <Space size={6}>
          <StatusTag status={record.status} />
          {record.locked_until && (
            <Tag color="error" icon={<LockOutlined />}>
              Bloqueado
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Último Acesso',
      dataIndex: 'last_login_at',
      key: 'last_login_at',
      render: (date: string) =>
        date ? new Date(date).toLocaleString('pt-BR') : <Text type="secondary">Nunca acessou</Text>,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: IamUser) => (
        <Space size={8}>
          <Tooltip title="Editar Usuário">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Resetar Senha">
            <Button
              type="text"
              icon={<KeyOutlined style={{ color: '#FA8C16' }} />}
              onClick={() => openResetModal(record)}
            />
          </Tooltip>
          {record.locked_until && (
            <Tooltip title="Desbloquear Conta">
              <Button
                type="text"
                icon={<UnlockOutlined style={{ color: '#52C41A' }} />}
                onClick={() => handleUnlockUser(record)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Excluir Usuário"
            description={`Tem certeza que deseja remover ${record.name}?`}
            onConfirm={() => handleDeleteUser(record)}
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record.email === 'willian.jesus@loft.com.br'}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Controle completo de contas, perfis, atribuição de papéis e segurança de credenciais"
        breadcrumbs={[
          { title: 'IAM' },
          { title: 'Usuários' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              onClick={() => {
                createForm.resetFields();
                setIsCreateModalOpen(true);
              }}
            >
              Novo Usuário
            </Button>
          </Space>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          resetToFirstPage();
        }}
        searchPlaceholder="Buscar por nome, username ou e-mail..."
        filters={[
          {
            key: 'role',
            label: 'Papel',
            value: roleFilter,
            options: [
              { label: 'Todos os Papéis', value: 'all' },
              { label: 'Global Admin', value: 'Global Admin' },
              { label: 'Admin', value: 'Admin' },
              { label: 'Editor', value: 'Editor' },
              { label: 'Viewer', value: 'Viewer' },
            ],
          },
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { label: 'Todos os Status', value: 'all' },
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'role') setRoleFilter(val);
          if (key === 'status') setStatusFilter(val);
          resetToFirstPage();
        }}
        onResetFilters={() => {
          setSearch('');
          setRoleFilter('all');
          setStatusFilter('all');
          resetToFirstPage();
        }}
      />

      <Table
        dataSource={users}
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
        style={{ marginTop: 16 }}
      />

      {/* Create User Modal */}
      <Modal
        title="Cadastrar Novo Usuário"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={() => createForm.submit()}
        okText="Criar Usuário"
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#FF774A', borderColor: '#FF774A' } }}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item name="name" label="Nome Completo" rules={[{ required: true, message: 'Insira o nome completo' }]}>
            <Input placeholder="ex: Ana Silva" />
          </Form.Item>
          <Form.Item name="username" label="Nome de Usuário" rules={[{ required: true, message: 'Insira o username' }]}>
            <Input placeholder="ex: ana.silva" />
          </Form.Item>
          <Form.Item name="email" label="E-mail Corporativo" rules={[{ required: true, type: 'email', message: 'Insira um e-mail válido' }]}>
            <Input placeholder="ex: ana.silva@loft.com.br" />
          </Form.Item>
          <Form.Item name="password" label="Senha Inicial" rules={[{ required: true, min: 8, message: 'Mínimo de 8 caracteres' }]}>
            <Input.Password placeholder="••••••••••••" />
          </Form.Item>
          <Form.Item name="role" label="Papel Principal" initialValue="Editor">
            <Select>
              {roles.map((r) => (
                <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="group_ids" label="Grupos de Acesso">
            <Select mode="multiple" placeholder="Selecione os grupos">
              {groups.map((g) => (
                <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title={`Editar Usuário: ${selectedUser?.name}`}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => editForm.submit()}
        okText="Salvar Alterações"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditUser}>
          <Form.Item name="name" label="Nome Completo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Papel">
            <Select>
              {roles.map((r) => (
                <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status da Conta">
            <Select>
              <Select.Option value="Active">Ativo (Active)</Select.Option>
              <Select.Option value="Inactive">Inativo (Inactive)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`Resetar Senha de ${selectedUser?.name}`}
        open={isResetModalOpen}
        onCancel={() => setIsResetModalOpen(false)}
        onOk={() => resetForm.submit()}
        okText="Confirmar Reset"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
        destroyOnClose
      >
        <Form form={resetForm} layout="vertical" onFinish={handleAdminResetPassword} initialValues={{ force_change_on_login: true }}>
          <Form.Item
            name="new_password"
            label="Nova Senha Provisória"
            rules={[{ required: true, min: 8, message: 'A senha deve ter no mínimo 8 caracteres' }]}
          >
            <Input.Password placeholder="••••••••••••" />
          </Form.Item>
          <Form.Item name="force_change_on_login" valuePropName="checked">
            <Switch defaultChecked /> <span style={{ marginLeft: 8 }}>Exigir troca de senha no próximo login</span>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
