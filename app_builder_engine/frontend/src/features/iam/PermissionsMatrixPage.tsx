import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Input,
  Space,
  Button,
  Select,
  Modal,
  Form,
  message,
  Typography,
  Popconfirm,
  Tooltip,
  Switch,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { iamService } from '@/services/iam.service';
import type { PermissionMatrixItem } from '@/types/iam.types';

const { Text } = Typography;

export const PermissionsMatrixPage: React.FC = () => {
  const [matrix, setMatrix] = useState<PermissionMatrixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  // Modals for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionMatrixItem | null>(null);
  const [form] = Form.useForm();
  const [togglingKeys, setTogglingKeys] = useState<Record<string, boolean>>({});

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const m = await iamService.getPermissionMatrix();
      setMatrix(m);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar matriz de permissões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const modules = Array.from(new Set(matrix.map((item) => item.module))).sort();

  const filteredMatrix = matrix.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.module.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchModule = selectedModule === 'all' || item.module === selectedModule;
    return matchSearch && matchModule;
  });

  const handleToggleRole = async (record: PermissionMatrixItem, roleName: string, currentGranted: boolean) => {
    const key = `${record.permission_id}_${roleName}`;
    setTogglingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      await iamService.toggleRolePermission(record.permission_id, roleName, !currentGranted);
      message.success(`Permissão ${record.code} ${!currentGranted ? 'concedida' : 'revogada'} para ${roleName}!`);
      fetchMatrix();
    } catch (err: any) {
      message.error(err.message || 'Erro ao alterar permissão');
    } finally {
      setTogglingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSavePermission = async (values: any) => {
    try {
      if (editingPermission) {
        await iamService.updatePermission(editingPermission.permission_id, values);
        message.success('Permissão atualizada com sucesso!');
      } else {
        await iamService.createPermission(values);
        message.success('Permissão criada com sucesso!');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingPermission(null);
      fetchMatrix();
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar permissão');
    }
  };

  const handleDeletePermission = async (record: PermissionMatrixItem) => {
    try {
      await iamService.deletePermission(record.permission_id);
      message.success(`Permissão ${record.code} excluída.`);
      fetchMatrix();
    } catch (err: any) {
      message.error(err.message || 'Erro ao excluir permissão');
    }
  };

  const openCreateModal = () => {
    setEditingPermission(null);
    form.resetFields();
    form.setFieldsValue({
      module: selectedModule !== 'all' ? selectedModule : 'Core',
      category: 'General',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: PermissionMatrixItem) => {
    setEditingPermission(record);
    form.setFieldsValue({
      name: record.name,
      module: record.module,
      category: record.category,
    });
    setIsModalOpen(true);
  };

  const renderRoleToggle = (record: PermissionMatrixItem, roleName: string, isFixedAdmin = false) => {
    const isGranted = isFixedAdmin || record.granted_roles.includes(roleName);
    const toggleKey = `${record.permission_id}_${roleName}`;
    const isToggling = !!togglingKeys[toggleKey];

    if (isFixedAdmin) {
      return (
        <Tooltip title="Global Admin possui acesso total irrevogável">
          <Switch checked disabled size="small" style={{ backgroundColor: '#52C41A' }} />
        </Tooltip>
      );
    }

    return (
      <Tooltip title={`Clique para ${isGranted ? 'revogar' : 'conceder'} para ${roleName}`}>
        <Switch
          checked={isGranted}
          loading={isToggling}
          onChange={() => handleToggleRole(record, roleName, isGranted)}
          size="small"
        />
      </Tooltip>
    );
  };

  const columns = [
    {
      title: 'Permissão (Código & Nome)',
      key: 'code',
      width: 280,
      render: (_: any, record: PermissionMatrixItem) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-[#0066CC]">{record.code}</span>
          </div>
          <Text type="secondary" className="text-xs">
            {record.name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Módulo',
      dataIndex: 'module',
      key: 'module',
      width: 140,
      render: (m: string) => <Tag color="orange">{m}</Tag>,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Global Admin',
      key: 'ga',
      width: 110,
      align: 'center' as const,
      render: (_: any, record: PermissionMatrixItem) => renderRoleToggle(record, 'Global Admin', true),
    },
    {
      title: 'Admin',
      key: 'admin',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: PermissionMatrixItem) => renderRoleToggle(record, 'Admin'),
    },
    {
      title: 'Editor',
      key: 'editor',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: PermissionMatrixItem) => renderRoleToggle(record, 'Editor'),
    },
    {
      title: 'Viewer',
      key: 'viewer',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: PermissionMatrixItem) => renderRoleToggle(record, 'Viewer'),
    },
    {
      title: 'Grupos Vinculados',
      key: 'groups',
      render: (_: any, record: PermissionMatrixItem) => (
        <Space size={4} wrap>
          {record.granted_groups.length === 0 ? (
            <span className="text-xs text-gray-400 italic">Nenhum</span>
          ) : (
            record.granted_groups.map((g, i) => (
              <Tag key={i} color="geekblue" className="text-xs">
                {g}
              </Tag>
            ))
          )}
        </Space>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 90,
      align: 'center' as const,
      render: (_: any, record: PermissionMatrixItem) => (
        <Space size={4}>
          <Tooltip title="Editar metadados da permissão">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Excluir Permissão"
            description={`Deseja realmente remover '${record.code}'?`}
            onConfirm={() => handleDeletePermission(record)}
            okText="Sim, excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Excluir permissão">
              <Button type="text" size="small" icon={<DeleteOutlined className="text-red-500" />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Matriz 360° de Permissões (RBAC)"
        subtitle="Visualização granular e controle dinâmico cruzando Módulos, Roles de Sistema e Grupos Organizacionais"
        breadcrumbs={[{ title: 'IAM' }, { title: 'Matriz de Permissões' }]}
        actions={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={openCreateModal} style={{ backgroundColor: '#F56738' }}>
              Nova Permissão
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchMatrix} loading={loading}>
              Atualizar Matriz
            </Button>
          </Space>
        }
      />

      {/* Spacious Toolbar with Search & Module Dropdown */}
      <div className="bg-white p-4 rounded-xl border border-loft-border mb-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <Input
            prefix={<SearchOutlined className="text-[#9CA3AF]" />}
            placeholder="Buscar por código, nome, categoria ou módulo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 340 }}
            size="middle"
            allowClear
          />

          <div className="flex items-center gap-2">
            <FilterOutlined className="text-loft-muted" />
            <Select
              value={selectedModule}
              onChange={setSelectedModule}
              style={{ width: 240 }}
              size="middle"
              options={[
                { value: 'all', label: `Todos os Módulos (${matrix.length})` },
                ...modules.map((m) => ({
                  value: m,
                  label: `${m} (${matrix.filter((i) => i.module === m).length})`,
                })),
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-loft-muted">
          <span>Mostrando <b>{filteredMatrix.length}</b> de <b>{matrix.length}</b> permissões</span>
        </div>
      </div>

      <Table
        dataSource={filteredMatrix}
        columns={columns}
        rowKey="permission_id"
        loading={loading}
        pagination={{ pageSize: 12, showSizeChanger: true }}
        className="bg-white rounded-xl border border-loft-border shadow-2xs overflow-hidden"
      />

      {/* Create / Edit Permission Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-loft-orange" />
            <span>{editingPermission ? 'Editar Permissão' : 'Nova Permissão de Sistema'}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingPermission ? 'Salvar Alterações' : 'Criar Permissão'}
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSavePermission} className="mt-4">
          {!editingPermission && (
            <Form.Item
              name="code"
              label="Código Canônico (ex: users:create, catalog:manage)"
              rules={[{ required: true, message: 'Informe o código da permissão' }]}
            >
              <Input placeholder="ex: blueprints:export" />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="Nome Amigável"
            rules={[{ required: true, message: 'Informe o nome da permissão' }]}
          >
            <Input placeholder="ex: Exportar Blueprints para Produção" />
          </Form.Item>

          <Form.Item
            name="module"
            label="Módulo"
            rules={[{ required: true, message: 'Informe o módulo da permissão' }]}
          >
            <Input placeholder="ex: Blueprints" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: 'Informe a categoria' }]}
          >
            <Input placeholder="ex: Execution" />
          </Form.Item>

          <Form.Item name="description" label="Descrição Detalhada">
            <Input.TextArea rows={3} placeholder="Descreva o escopo e restrições desta permissão..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
