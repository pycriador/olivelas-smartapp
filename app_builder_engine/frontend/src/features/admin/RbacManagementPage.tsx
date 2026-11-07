import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Row,
  Col,
  message,
  Tabs,
  Input,
  Select,
  Pagination,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SafetyCertificateOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SwapOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState } from '@/components/ui/FeedbackStates';
import { rbacService } from '@/services/rbac.service';
import { useUIStore } from '@/stores/uiStore';
import type { User, RoleDefinition, RoleName } from '@/types/domain.types';

export const RbacManagementPage: React.FC = () => {
  const { currentRole, setCurrentRole } = useUIStore();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [uList, rList] = await Promise.all([
        rbacService.getUsers(),
        rbacService.getRoles(),
      ]);
      setUsers(uList);
      setRoles(rList);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados de RBAC.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSwitchRole = async (role: RoleName) => {
    try {
      await rbacService.switchRole(role);
      setCurrentRole(role);
      message.success(`Perfil ativo alternado para ${role}.`);
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Falha ao alternar perfil.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !userSearch ||
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());

      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, userSearch, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userSearch, roleFilter]);

  const userColumns: ColumnsType<User> = [
    {
      title: 'Usuário',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div className="font-semibold text-sm text-loft-dark">{name}</div>
          <div className="text-xs text-loft-muted">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Papel RBAC',
      dataIndex: 'role',
      key: 'role',
      render: (role: RoleName) => {
        const color =
          role === 'Global Admin'
            ? 'magenta'
            : role === 'Admin'
            ? 'blue'
            : role === 'Editor'
            ? 'green'
            : 'default';
        return <Tag color={color} className="font-bold text-xs">{role}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: () => (
        <span className="text-xs text-loft-success font-medium flex items-center gap-1">
          <CheckCircleOutlined /> Ativo
        </span>
      ),
    },
    {
      title: 'Ações de Simulação',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Button
          size="small"
          icon={<SwapOutlined />}
          type={currentRole === record.role ? 'primary' : 'default'}
          style={currentRole === record.role ? { backgroundColor: '#F56738' } : undefined}
          onClick={() => handleSwitchRole(record.role)}
        >
          {currentRole === record.role ? 'Perfil Ativo' : `Assumir ${record.role}`}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Governança de Acessos & RBAC"
        subtitle="Gerenciamento de papéis, privilégios granulares e matriz de permissões do Engineering Workspace."
        breadcrumbs={[
          { title: 'Engineering Workspace' },
          { title: 'Governança & Admin' },
          { title: 'Papéis & Permissões' },
        ]}
        actions={
          <Button icon={<ReloadOutlined />} onClick={loadData}>
            Atualizar
          </Button>
        }
      />

      {loading ? (
        <LoadingState tip="Carregando configurações de RBAC..." />
      ) : error ? (
        <ErrorState description={error} onRetry={loadData} />
      ) : (
        <Tabs
          defaultActiveKey="roles"
          items={[
            {
              key: 'roles',
              label: (
                <span className="flex items-center gap-2">
                  <SafetyCertificateOutlined />
                  <span>Matriz de Papéis & Permissões ({roles.length})</span>
                </span>
              ),
              children: (
                <div className="space-y-6 pt-2">
                  <Row gutter={[24, 24]}>
                    {roles.map((r, idx) => (
                      <Col xs={24} md={12} key={idx}>
                        <Card className="border border-loft-border shadow-2xs rounded-xl h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-base font-bold text-loft-dark">{r.name}</h3>
                              {currentRole === r.name && (
                                <Tag color="orange" className="font-bold text-xs">
                                  SEU PERFIL ATIVO
                                </Tag>
                              )}
                            </div>
                            <p className="text-xs text-loft-muted mb-4 leading-relaxed">
                              {r.description}
                            </p>

                            <div className="text-xs font-bold text-[#334E68] uppercase tracking-wider mb-2">
                              Permissões Concedidas ({r.permissions.length}):
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {r.permissions.map((p, pIdx) => (
                                <Tag key={pIdx} color="default" className="text-[11px] font-mono">
                                  {p}
                                </Tag>
                              ))}
                            </div>
                          </div>

                          <Button
                            type={currentRole === r.name ? 'primary' : 'default'}
                            style={
                              currentRole === r.name
                                ? { backgroundColor: '#F56738' }
                                : undefined
                            }
                            onClick={() => handleSwitchRole(r.name as RoleName)}
                            block
                          >
                            {currentRole === r.name
                              ? 'Perfil Ativo no Momento'
                              : `Alternar para ${r.name}`}
                          </Button>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ),
            },
            {
              key: 'users',
              label: (
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  <span>Usuários & Atribuições ({users.length})</span>
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <Card className="border border-loft-border shadow-2xs rounded-xl">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
                      <Input
                        prefix={<SearchOutlined className="text-loft-muted" />}
                        placeholder="Buscar por nome ou e-mail de usuário..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        allowClear
                        className="max-w-md"
                      />

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select
                          placeholder="Filtrar por Papel"
                          allowClear
                          className="w-48"
                          value={roleFilter}
                          onChange={setRoleFilter}
                          options={[
                            { value: 'Global Admin', label: 'Global Admin' },
                            { value: 'Admin', label: 'Admin' },
                            { value: 'Editor', label: 'Editor' },
                            { value: 'Viewer', label: 'Viewer' },
                          ]}
                        />
                        {(userSearch || roleFilter) && (
                          <Button
                            type="link"
                            size="small"
                            onClick={() => {
                              setUserSearch('');
                              setRoleFilter(undefined);
                            }}
                          >
                            Limpar
                          </Button>
                        )}
                      </div>
                    </div>

                    <Table
                      dataSource={paginatedUsers}
                      columns={userColumns}
                      rowKey="id"
                      pagination={false}
                    />

                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-xs text-loft-muted">
                        Exibindo {paginatedUsers.length} de {filteredUsers.length} usuários
                      </span>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredUsers.length}
                        onChange={(page, size) => {
                          setCurrentPage(page);
                          setPageSize(size);
                        }}
                        showSizeChanger
                        pageSizeOptions={['5', '8', '15']}
                      />
                    </div>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};
