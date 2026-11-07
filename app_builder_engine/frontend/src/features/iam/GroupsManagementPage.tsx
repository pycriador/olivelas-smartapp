import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm, Tooltip, Typography } from 'antd';
import { TeamOutlined, PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { StatusTag } from '@/components/loft/StatusTag';
import { iamService } from '@/services/iam.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type { IamGroup, IamRole } from '@/types/iam.types';

const { Text } = Typography;

export const GroupsManagementPage: React.FC = () => {
  const [groups, setGroups] = useState<IamGroup[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [roles, setRoles] = useState<IamRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentPage, pageSize, onPaginationChange } = useUrlPagination(10);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<IamGroup | null>(null);
  const [form] = Form.useForm();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await iamService.getGroupsPaginated({
        page: currentPage,
        page_size: pageSize,
      });
      setGroups(res.items);
      setTotalItems(res.total);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const fetchRoles = async () => {
    try {
      const r = await iamService.getRoles();
      setRoles(r);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSave = async (values: any) => {
    try {
      if (editingGroup) {
        await iamService.updateGroup(editingGroup.id, values);
        message.success('Grupo atualizado com sucesso!');
      } else {
        await iamService.createGroup(values);
        message.success('Grupo criado com sucesso!');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingGroup(null);
      fetchGroups();
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar grupo');
    }
  };

  const handleDuplicate = async (group: IamGroup) => {
    try {
      await iamService.duplicateGroup(group.id);
      message.success(`Grupo ${group.name} duplicado com sucesso!`);
      fetchGroups();
    } catch (err: any) {
      message.error(err.message || 'Erro ao duplicar grupo');
    }
  };

  const handleDelete = async (group: IamGroup) => {
    try {
      await iamService.deleteGroup(group.id);
      message.success(`Grupo ${group.name} excluído.`);
      fetchGroups();
    } catch (err: any) {
      message.error(err.message || 'Erro ao excluir grupo');
    }
  };

  const openCreateModal = () => {
    setEditingGroup(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (group: IamGroup) => {
    setEditingGroup(group);
    form.setFieldsValue({
      name: group.name,
      description: group.description,
      color: group.color,
      status: group.status,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Grupo',
      key: 'group',
      render: (_: any, record: IamGroup) => (
        <Space size={12}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: record.color || '#FF774A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            <TeamOutlined />
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
      title: 'Membros',
      dataIndex: 'member_count',
      key: 'member_count',
      render: (count: number) => <Tag color="blue">{count} membros</Tag>,
    },
    {
      title: 'Roles Herdadas',
      dataIndex: 'roles',
      key: 'roles',
      render: (rList: string[]) => (
        <Space size={4} wrap>
          {rList && rList.length > 0 ? (
            rList.map((r, i) => <Tag key={i} color="geekblue">{r}</Tag>)
          ) : (
            <Text type="secondary" style={{ fontSize: 12 }}>-</Text>
          )}
        </Space>
      ),
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
      render: (_: any, record: IamGroup) => (
        <Space size={8}>
          <Tooltip title="Editar Grupo">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          </Tooltip>
          <Tooltip title="Duplicar Grupo">
            <Button type="text" icon={<CopyOutlined />} onClick={() => handleDuplicate(record)} />
          </Tooltip>
          {!record.is_system && (
            <Popconfirm
              title="Excluir Grupo"
              description={`Deseja excluir o grupo ${record.name}?`}
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
        title="Grupos de Acesso"
        subtitle="Organização de membros por equipes funcionais com atribuição de papéis unificada"
        breadcrumbs={[
          { title: 'IAM' },
          { title: 'Grupos' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchGroups} loading={loading}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: '#FF774A', borderColor: '#FF774A' }}
              onClick={openCreateModal}
            >
              Novo Grupo
            </Button>
          </Space>
        }
      />
      <Table
        dataSource={groups}
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

      {/* Modal Create / Edit */}
      <Modal
        title={editingGroup ? `Editar Grupo: ${editingGroup.name}` : 'Criar Novo Grupo'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Salvar Grupo"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Nome do Grupo" rules={[{ required: true, message: 'Insira o nome do grupo' }]}>
            <Input placeholder="ex: Desenvolvedores Frontend" />
          </Form.Item>
          <Form.Item name="description" label="Descrição">
            <Input.TextArea placeholder="ex: Membros da guilda de frontend com permissões de publicação" />
          </Form.Item>
          <Form.Item name="color" label="Cor de Identificação" initialValue="#FF774A">
            <Input type="color" style={{ width: 80, height: 38, padding: 2 }} />
          </Form.Item>
          {!editingGroup && (
            <Form.Item name="role_ids" label="Roles Atribuídas">
              <Select mode="multiple" placeholder="Selecione as roles do grupo">
                {roles.map((r) => (
                  <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageContainer>
  );
};
