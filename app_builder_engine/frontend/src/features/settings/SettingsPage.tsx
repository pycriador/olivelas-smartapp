import React, { useState, useEffect, useCallback } from 'react';
import {
  Tabs,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Card,
  Row,
  Col,
  Typography,
  Popconfirm,
  Tooltip,
  Switch,
  InputNumber,
} from 'antd';
import {
  AppstoreOutlined,
  SafetyCertificateOutlined,
  SlidersOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  NodeIndexOutlined,
  BlockOutlined,
  LayoutOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { useUIStore } from '@/stores/uiStore';
import { settingsService } from '@/services/settings.service';
import { iamService } from '@/services/iam.service';
import { navigateTo } from '@/router/navigation';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import type { CategoryItem, SystemSettingsSummary } from '@/types/settings.types';
import type { IamRole, IamPermission, PermissionMatrixItem } from '@/types/iam.types';

const { Paragraph } = Typography;

const ENTITY_TYPE_OPTIONS = [
  { value: 'all', label: 'Todos os Tipos de Ativos', icon: <AppstoreOutlined /> },
  { value: 'component', label: 'Componentes Copan', icon: <AppstoreOutlined className="text-[#FF774A]" /> },
  { value: 'module', label: 'Módulos de Domínio', icon: <BlockOutlined className="text-[#0066CC]" /> },
  { value: 'template', label: 'Templates de Aplicação', icon: <LayoutOutlined className="text-loft-success" /> },
  { value: 'rule', label: 'Golden Rules', icon: <SafetyCertificateOutlined className="text-[#9A60B4]" /> },
  { value: 'specification', label: 'Especificações SDD', icon: <FileTextOutlined className="text-loft-orange" /> },
  { value: 'architecture', label: 'Arquiteturas Padrão', icon: <ApartmentOutlined className="text-[#E6A23C]" /> },
  { value: 'project', label: 'Projetos de Software', icon: <FolderOpenOutlined className="text-[#334E68]" /> },
];

const PRESET_COLORS = [
  '#FF774A', '#F56738', '#0066CC', '#20A483', '#9A60B4', '#E6A23C', '#2B6CB0', '#C53030', '#4A5568', '#121619'
];

interface SettingsPageProps {
  initialTab?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ initialTab }) => {
  const { currentRole } = useUIStore();

  // Determine active tab from URL path, query params, or prop
  const getTabFromUrl = (): string => {
    const path = window.location.pathname.replace(/\/$/, '');
    if (path.includes('/settings/roles') || path.includes('/iam/roles')) return 'roles';
    if (path.includes('/settings/matrix') || path.includes('/settings/permissions-matrix') || path.includes('/iam/matrix')) return 'matrix';
    if (path.includes('/settings/system')) return 'system';
    if (path.includes('/settings/categories')) return 'categories';

    const sp = new URLSearchParams(window.location.search);
    const tabParam = sp.get('tab');
    if (tabParam && ['categories', 'roles', 'matrix', 'system'].includes(tabParam)) {
      return tabParam;
    }

    return initialTab || 'categories';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromUrl);
  const { currentPage, pageSize, onPaginationChange, resetToFirstPage } = useUrlPagination(10);

  // Sync tab with URL changes
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigateTo(`/settings/${key}`);
  };

  // ---------------------------------------------------------------------------
  // 1. Categories State & Handlers
  // ---------------------------------------------------------------------------
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [summary, setSummary] = useState<SystemSettingsSummary | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryForm] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState('#0066CC');

  const fetchCategoriesData = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const [catsRes, sum] = await Promise.all([
        settingsService.getCategoriesPaginated({
          search: searchCategory || undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
          page: currentPage,
          page_size: pageSize,
        }),
        settingsService.getSummary(),
      ]);
      setCategories(catsRes.items);
      setTotalCategories(catsRes.total);
      setSummary(sum);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoadingCategories(false);
    }
  }, [searchCategory, selectedType, currentPage, pageSize]);

  useEffect(() => {
    if (isCategoryModalOpen && editingCategory) {
      categoryForm.setFieldsValue({
        name: editingCategory.name,
        type: editingCategory.type,
        description: editingCategory.description,
      });
      setSelectedColor(editingCategory.color || '#0066CC');
    }
  }, [isCategoryModalOpen, editingCategory, categoryForm]);

  const handleSaveCategory = async (values: any) => {
    try {
      if (editingCategory) {
        await settingsService.updateCategory(editingCategory.id, {
          name: values.name,
          description: values.description,
          color: selectedColor,
        });
        message.success(`Categoria '${values.name}' atualizada com sucesso!`);
      } else {
        await settingsService.createCategory({
          name: values.name,
          type: values.type,
          description: values.description,
          color: selectedColor,
        });
        message.success(`Nova categoria '${values.name}' cadastrada com sucesso!`);
      }
      setIsCategoryModalOpen(false);
      categoryForm.resetFields();
      setEditingCategory(null);
      fetchCategoriesData();
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar categoria');
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    try {
      await settingsService.deleteCategory(cat.id);
      message.success(`Categoria '${cat.name}' excluída com sucesso.`);
      fetchCategoriesData();
    } catch (err: any) {
      message.error(err.message || 'Erro ao excluir categoria');
    }
  };

  // ---------------------------------------------------------------------------
  // 2. Roles State & Handlers
  // ---------------------------------------------------------------------------
  const [roles, setRoles] = useState<IamRole[]>([]);
  const [totalRoles, setTotalRoles] = useState<number>(0);
  const [permissions, setPermissions] = useState<IamPermission[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IamRole | null>(null);
  const [roleForm] = Form.useForm();

  const fetchRolesData = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const [rRes, pList] = await Promise.all([
        iamService.getRolesPaginated({ page: currentPage, page_size: pageSize }),
        iamService.getPermissions(),
      ]);
      setRoles(rRes.items);
      setTotalRoles(rRes.total);
      setPermissions(pList);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar papéis (roles)');
    } finally {
      setLoadingRoles(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (isRoleModalOpen && editingRole) {
      roleForm.setFieldsValue({
        name: editingRole.name,
        category: editingRole.category,
        priority: editingRole.priority,
        description: editingRole.description,
        status: editingRole.status,
      });
    }
  }, [isRoleModalOpen, editingRole, roleForm]);

  const handleSaveRole = async (values: any) => {
    try {
      if (editingRole) {
        await iamService.updateRole(editingRole.id, values);
        message.success(`Papel '${values.name}' atualizado com sucesso!`);
      } else {
        await iamService.createRole(values);
        message.success(`Novo papel '${values.name}' criado com sucesso!`);
      }
      setIsRoleModalOpen(false);
      roleForm.resetFields();
      setEditingRole(null);
      fetchRolesData();
      fetchMatrixData();
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar papel');
    }
  };

  const handleDeleteRole = async (role: IamRole) => {
    try {
      await iamService.deleteRole(role.id);
      message.success(`Papel '${role.name}' excluído com sucesso.`);
      fetchRolesData();
      fetchMatrixData();
    } catch (err: any) {
      message.error(err.message || 'Erro ao excluir papel');
    }
  };

  // ---------------------------------------------------------------------------
  // 3. Permission Matrix State & Handlers
  // ---------------------------------------------------------------------------
  const [matrix, setMatrix] = useState<PermissionMatrixItem[]>([]);
  const [totalMatrix, setTotalMatrix] = useState<number>(0);
  const [loadingMatrix, setLoadingMatrix] = useState(false);
  const [searchMatrix, setSearchMatrix] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [togglingKeys, setTogglingKeys] = useState<Record<string, boolean>>({});
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionMatrixItem | null>(null);
  const [permissionForm] = Form.useForm();

  const fetchMatrixData = useCallback(async () => {
    setLoadingMatrix(true);
    try {
      const searchVal = selectedModule !== 'all' ? selectedModule : searchMatrix || undefined;
      const res = await iamService.getPermissionMatrixPaginated({
        search: searchVal,
        page: currentPage,
        page_size: pageSize,
      });
      setMatrix(res.items);
      setTotalMatrix(res.total);
    } catch (err: any) {
      message.error(err.message || 'Erro ao carregar matriz de permissões');
    } finally {
      setLoadingMatrix(false);
    }
  }, [searchMatrix, selectedModule, currentPage, pageSize]);

  const handleTogglePermission = async (roleName: string, permissionId: string, currentGranted: boolean) => {
    const key = `${roleName}_${permissionId}`;
    setTogglingKeys((prev) => ({ ...prev, [key]: true }));
    try {
      await iamService.toggleRolePermission(permissionId, roleName, !currentGranted);
      // Optimistic update
      setMatrix((prev) =>
        prev.map((item) => {
          if (item.permission_id === permissionId) {
            const nextRoles = currentGranted
              ? item.granted_roles.filter((r) => r !== roleName)
              : [...item.granted_roles, roleName];
            return {
              ...item,
              granted_roles: nextRoles,
            };
          }
          return item;
        })
      );
      message.success(
        `Permissão ${!currentGranted ? 'concedida' : 'revogada'} com sucesso e persistida no SQLite!`
      );
    } catch (err: any) {
      message.error(err.message || 'Erro ao atualizar privilégio');
      fetchMatrixData();
    } finally {
      setTogglingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSavePermission = async (values: any) => {
    try {
      if (editingPermission) {
        await iamService.updatePermission(editingPermission.permission_id, values);
        message.success(`Permissão '${values.code}' atualizada com sucesso!`);
      } else {
        await iamService.createPermission(values);
        message.success(`Nova permissão '${values.code}' cadastrada com sucesso!`);
      }
      setIsPermissionModalOpen(false);
      permissionForm.resetFields();
      setEditingPermission(null);
      fetchMatrixData();
    } catch (err: any) {
      message.error(err.message || 'Erro ao salvar permissão');
    }
  };

  const handleDeletePermission = async (perm: PermissionMatrixItem) => {
    try {
      await iamService.deletePermission(perm.permission_id);
      message.success(`Permissão '${perm.code}' excluída com sucesso.`);
      fetchMatrixData();
    } catch (err: any) {
      message.error(err.message || 'Erro ao excluir permissão');
    }
  };

  // Trigger data load based on tab
  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategoriesData();
    } else if (activeTab === 'roles') {
      fetchRolesData();
    } else if (activeTab === 'matrix') {
      iamService.getRoles().then(setRoles).catch(() => {});
      fetchMatrixData();
    }
  }, [activeTab, fetchCategoriesData, fetchRolesData, fetchMatrixData]);

  const refreshCurrentTab = () => {
    if (activeTab === 'categories') fetchCategoriesData();
    else if (activeTab === 'roles') fetchRolesData();
    else if (activeTab === 'matrix') {
      fetchRolesData();
      fetchMatrixData();
    }
  };

  // ---------------------------------------------------------------------------
  // Table Columns Definitions
  // ---------------------------------------------------------------------------
  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchCategory.toLowerCase()) ||
      c.description.toLowerCase().includes(searchCategory.toLowerCase());
    const matchesType = selectedType === 'all' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const categoryColumns = [
    {
      title: 'Categoria',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CategoryItem) => (
        <Space>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: record.color || '#0066CC',
            }}
          />
          <span className="font-semibold text-loft-dark">{name}</span>
          {record.is_system && (
            <Tag color="blue" className="text-[10px] uppercase font-bold">
              Canônico
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Tipo de Ativo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const option = ENTITY_TYPE_OPTIONS.find((o) => o.value === type);
        return (
          <Space size={6}>
            {option?.icon}
            <span className="text-xs text-loft-muted font-medium">{option?.label || type}</span>
          </Space>
        );
      },
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => <span className="text-xs text-loft-muted">{desc || '—'}</span>,
    },
    {
      title: 'Ativos Vinculados',
      dataIndex: 'usage_count',
      key: 'usage_count',
      width: 140,
      render: (count: number) => (
        <Tag color="cyan" className="font-mono text-xs">
          {count ?? 0} ativos
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 100,
      render: (_: any, record: CategoryItem) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record);
              setIsCategoryModalOpen(true);
            }}
          />
          {!record.is_system && (
            <Popconfirm
              title="Excluir Categoria"
              description={`Deseja realmente excluir a categoria '${record.name}'?`}
              onConfirm={() => handleDeleteCategory(record)}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const roleColumns = [
    {
      title: 'Nome do Papel (Role)',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: IamRole) => (
        <Space direction="vertical" size={2}>
          <Space>
            <span className="font-semibold text-loft-dark">{name}</span>
            {record.is_system && (
              <Tag color="purple" className="text-[10px] uppercase font-bold">
                Sistema
              </Tag>
            )}
          </Space>
          <span className="text-xs text-loft-muted">{record.description}</span>
        </Space>
      ),
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat || 'Geral'}</Tag>,
    },
    {
      title: 'Prioridade Hierárquica',
      dataIndex: 'priority',
      key: 'priority',
      width: 160,
      render: (p: number) => (
        <Tag color={p >= 90 ? 'red' : p >= 50 ? 'orange' : 'default'} className="font-mono">
          Nível {p}
        </Tag>
      ),
    },
    {
      title: 'Privilégios',
      dataIndex: 'permission_count',
      key: 'permission_count',
      width: 120,
      render: (count: number) => <Tag color="volcano">{count ?? 0} permissões</Tag>,
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 100,
      render: (_: any, record: IamRole) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRole(record);
              setIsRoleModalOpen(true);
            }}
          />
          {!record.is_system && (
            <Popconfirm
              title="Excluir Papel"
              description={`Deseja excluir o papel '${record.name}'?`}
              onConfirm={() => handleDeleteRole(record)}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const modulesList = Array.from(new Set(matrix.map((m) => m.module))).filter(Boolean);

  const filteredMatrix = matrix.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchMatrix.toLowerCase()) ||
      item.name.toLowerCase().includes(searchMatrix.toLowerCase()) ||
      item.module.toLowerCase().includes(searchMatrix.toLowerCase());
    const matchesMod = selectedModule === 'all' || item.module === selectedModule;
    return matchesSearch && matchesMod;
  });

  const matrixColumns: any[] = [
    {
      title: 'Módulo',
      dataIndex: 'module',
      key: 'module',
      width: 130,
      render: (mod: string) => (
        <Tag color="geekblue" className="font-semibold text-xs">
          {mod}
        </Tag>
      ),
    },
    {
      title: 'Código do Privilégio',
      dataIndex: 'code',
      key: 'code',
      width: 240,
      render: (code: string, record: PermissionMatrixItem) => (
        <Space direction="vertical" size={1}>
          <span className="font-mono text-xs font-bold text-loft-dark">{code}</span>
          <span className="text-[11px] text-loft-muted">{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Ação',
      dataIndex: 'category',
      key: 'category',
      width: 90,
      render: (cat: string) => {
        const color = cat === 'Read' ? 'cyan' : cat === 'Write' ? 'orange' : cat === 'Admin' ? 'red' : 'purple';
        return <Tag color={color} className="text-[10px]">{cat}</Tag>;
      },
    },
  ];

  roles.forEach((r) => {
    matrixColumns.push({
      title: (
        <div className="text-center font-semibold text-xs">
          <div>{r.name}</div>
          {r.is_system && <span className="text-[10px] text-loft-muted font-normal">(Sistema)</span>}
        </div>
      ),
      key: `role_${r.id}`,
      width: 120,
      align: 'center',
      render: (_: any, record: PermissionMatrixItem) => {
        const isGranted = (record.granted_roles || []).includes(r.name);
        const isToggling = togglingKeys[`${r.name}_${record.permission_id}`];

        return (
          <Switch
            size="small"
            checked={isGranted}
            loading={isToggling}
            disabled={r.name === 'Global Admin'}
            onChange={() => handleTogglePermission(r.name, record.permission_id, isGranted)}
            style={{
              backgroundColor: isGranted ? '#20A483' : undefined,
            }}
          />
        );
      },
    });
  });

  matrixColumns.push({
    title: 'Ações',
    key: 'actions',
    width: 80,
    align: 'center',
    render: (_: any, record: PermissionMatrixItem) => (
      <Space size={4}>
        <Tooltip title="Editar Permissão">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPermission(record);
              permissionForm.setFieldsValue({
                code: record.code,
                name: record.name,
                module: record.module,
                category: record.category,
              });
              setIsPermissionModalOpen(true);
            }}
          />
        </Tooltip>
        <Popconfirm
          title="Excluir Permissão"
          description={`Deseja excluir '${record.code}'?`}
          onConfirm={() => handleDeletePermission(record)}
          okButtonProps={{ danger: true }}
        >
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  });

  return (
    <PageContainer>
      <PageHeader
        title="Configurações & Governança do Sistema"
        subtitle="Central unificada para categorização de catálogo de engenharia, gestão de papéis organizacionais e matriz RBAC"
        breadcrumbs={[
          { title: 'Administração' },
          { title: 'Configurações' },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refreshCurrentTab}>
              Atualizar
            </Button>
            {activeTab === 'categories' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: '#FF774A', borderColor: '#FF774A' }}
                onClick={() => {
                  setEditingCategory(null);
                  categoryForm.resetFields();
                  setSelectedColor('#0066CC');
                  setIsCategoryModalOpen(true);
                }}
              >
                Nova Categoria
              </Button>
            )}
            {activeTab === 'roles' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: '#FF774A', borderColor: '#FF774A' }}
                onClick={() => {
                  setEditingRole(null);
                  roleForm.resetFields();
                  setIsRoleModalOpen(true);
                }}
              >
                Nova Role
              </Button>
            )}
            {activeTab === 'matrix' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: '#FF774A', borderColor: '#FF774A' }}
                onClick={() => {
                  setEditingPermission(null);
                  permissionForm.resetFields();
                  setIsPermissionModalOpen(true);
                }}
              >
                Nova Permissão
              </Button>
            )}
          </Space>
        }
      />

      {/* Metric Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card size="small" className="border-loft-border shadow-2xs hover:border-[#BEE3F8] transition">
            <div className="text-xs text-loft-muted font-medium mb-1">Categorias de Ativos</div>
            <div className="text-2xl font-bold text-loft-dark">{summary?.total_categories ?? categories.length}</div>
            <div className="text-[11px] text-loft-success mt-1 font-medium">Classificação canônica ativa</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" className="border-loft-border shadow-2xs hover:border-[#BEE3F8] transition">
            <div className="text-xs text-loft-muted font-medium mb-1">Papéis Mapeados (Roles)</div>
            <div className="text-2xl font-bold text-[#0066CC]">{roles.length}</div>
            <div className="text-[11px] text-loft-muted mt-1 font-medium">Controle de acesso granular</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" className="border-loft-border shadow-2xs">
            <div className="text-xs text-loft-muted font-medium mb-1">Seu Perfil Ativo (RBAC)</div>
            <div className="flex items-center gap-2 mt-1">
              <Tag color="orange" className="font-bold text-sm px-2.5 py-0.5">
                {currentRole}
              </Tag>
              <span className="text-xs text-loft-muted">
                {currentRole === 'Viewer' ? 'Somente Leitura' : 'Acesso Total Permitido'}
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Unified Tab Navigation */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="bg-white p-6 rounded-xl border border-loft-border shadow-2xs"
        items={[
          {
            key: 'categories',
            label: (
              <span className="font-semibold text-sm">
                <AppstoreOutlined className="mr-1.5" />
                Categorias de Ativos ({categories.length})
              </span>
            ),
            children: (
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#FAFBFD] border border-loft-border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                    <Input
                      prefix={<SearchOutlined className="text-[#9CA3AF]" />}
                      placeholder="Filtrar por nome ou descrição da categoria..."
                      value={searchCategory}
                      onChange={(e) => {
                        setSearchCategory(e.target.value);
                        resetToFirstPage();
                      }}
                      style={{ width: 320 }}
                      allowClear
                    />
                    <Select
                      value={selectedType}
                      onChange={(v) => {
                        setSelectedType(v);
                        resetToFirstPage();
                      }}
                      style={{ width: 240 }}
                      options={ENTITY_TYPE_OPTIONS.map((o) => ({
                        value: o.value,
                        label: (
                          <div className="flex items-center gap-2">
                            {o.icon}
                            <span>{o.label}</span>
                          </div>
                        ),
                      }))}
                    />
                  </div>
                  <div className="text-xs text-loft-muted">
                    Exibindo <b>{filteredCategories.length}</b> de <b>{totalCategories || categories.length}</b> categorias
                  </div>
                </div>

                <Table
                  dataSource={filteredCategories}
                  columns={categoryColumns}
                  rowKey="id"
                  loading={loadingCategories}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalCategories,
                    onChange: onPaginationChange,
                    showSizeChanger: true,
                  }}
                />
              </div>
            ),
          },
          {
            key: 'roles',
            label: (
              <span className="font-semibold text-sm">
                <SafetyCertificateOutlined className="mr-1.5" />
                Papéis & Privilégios ({roles.length})
              </span>
            ),
            children: (
              <div className="space-y-4 pt-2">
                <Paragraph className="text-sm text-loft-muted">
                  Gerenciamento de papéis organizacionais (Roles) com níveis de prioridade, proteção contra exclusão de papéis de sistema e contagem de privilégios atribuídos.
                </Paragraph>
                <Table
                  dataSource={roles}
                  columns={roleColumns}
                  rowKey="id"
                  loading={loadingRoles}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalRoles || roles.length,
                    onChange: onPaginationChange,
                    showSizeChanger: true,
                  }}
                />
              </div>
            ),
          },
          {
            key: 'matrix',
            label: (
              <span className="font-semibold text-sm">
                <NodeIndexOutlined className="mr-1.5" />
                Matriz RBAC Unificada ({totalMatrix || matrix.length})
              </span>
            ),
            children: (
              <div className="space-y-4 pt-2">
                <Paragraph className="text-sm text-loft-muted">
                  Central unificada e funcional de controle de acesso. Alterne permissões em tempo real diretamente na tabela com persistência automática no SQLite.
                </Paragraph>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#FAFBFD] border border-loft-border rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                    <Input
                      prefix={<SearchOutlined className="text-[#9CA3AF]" />}
                      placeholder="Buscar por código, nome ou módulo..."
                      value={searchMatrix}
                      onChange={(e) => {
                        setSearchMatrix(e.target.value);
                        resetToFirstPage();
                      }}
                      style={{ width: 320 }}
                      allowClear
                    />
                    <Select
                      value={selectedModule}
                      onChange={(v) => {
                        setSelectedModule(v);
                        resetToFirstPage();
                      }}
                      style={{ width: 220 }}
                    >
                      <Select.Option value="all">Todos os Módulos ({totalMatrix || matrix.length})</Select.Option>
                      {modulesList.map((m) => (
                        <Select.Option key={m} value={m}>
                          {m}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="text-xs text-loft-muted">
                    Exibindo <b>{filteredMatrix.length}</b> de <b>{totalMatrix || matrix.length}</b> permissões
                  </div>
                </div>

                <Table
                  dataSource={filteredMatrix}
                  columns={matrixColumns}
                  rowKey="permission_id"
                  loading={loadingMatrix}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalMatrix,
                    onChange: onPaginationChange,
                    showSizeChanger: true,
                  }}
                />
              </div>
            ),
          },
          {
            key: 'system',
            label: (
              <span className="font-semibold text-sm">
                <SlidersOutlined className="mr-1.5" />
                Parâmetros do Sistema
              </span>
            ),
            children: (
              <div className="space-y-6 pt-2">
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card
                      title={
                        <Space>
                          <LockOutlined className="text-[#FF774A]" />
                          <span>Políticas de Versionamento & Imutabilidade</span>
                        </Space>
                      }
                      size="small"
                      className="border-loft-border"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm text-loft-dark">Exigir SemVer Estrito</div>
                            <div className="text-xs text-loft-muted">Bloqueia publicação com versões fora do padrão MAJOR.MINOR.PATCH</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm text-loft-dark">Incremento Automático de Versão</div>
                            <div className="text-xs text-loft-muted">Sugere próximo patch ao salvar alterações em Blueprints</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card
                      title={
                        <Space>
                          <SafetyCertificateOutlined className="text-loft-success" />
                          <span>Auditoria Universal & Compliance</span>
                        </Space>
                      }
                      size="small"
                      className="border-loft-border"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm text-loft-dark">Trilha de Auditoria Universal</div>
                            <div className="text-xs text-loft-muted">Registra todas as ações mutantes com ator, IP e timestamp</div>
                          </div>
                          <Switch defaultChecked disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm text-loft-dark">Validação Obrigatória de Golden Rules</div>
                            <div className="text-xs text-loft-muted">Impede geração de Blueprints com violações críticas de arquitetura</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
        ]}
      />

      {/* Category Create/Edit Modal */}
      <Modal
        title={editingCategory ? `Editar Categoria: ${editingCategory.name}` : 'Cadastrar Nova Categoria'}
        open={isCategoryModalOpen}
        onCancel={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onOk={() => categoryForm.submit()}
        okText="Salvar Categoria"
        cancelText="Cancelar"
        destroyOnClose
        centered
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleSaveCategory}>
          <Form.Item
            name="name"
            label="Nome da Categoria"
            rules={[{ required: true, message: 'Por favor informe o nome da categoria' }]}
          >
            <Input placeholder="Ex: Gateway de Pagamentos, UI Primitives, Segurança" />
          </Form.Item>

          {!editingCategory && (
            <Form.Item
              name="type"
              label="Tipo de Entidade Relacionada"
              rules={[{ required: true, message: 'Selecione o tipo de entidade' }]}
              initialValue="component"
            >
              <Select
                options={ENTITY_TYPE_OPTIONS.filter((o) => o.value !== 'all').map((o) => ({
                  value: o.value,
                  label: (
                    <div className="flex items-center gap-2">
                      {o.icon}
                      <span>{o.label}</span>
                    </div>
                  ),
                }))}
              />
            </Form.Item>
          )}

          <Form.Item name="description" label="Descrição da Categoria">
            <Input.TextArea
              rows={3}
              placeholder="Descreva o propósito desta categoria e suas diretrizes de uso na arquitetura Loft..."
            />
          </Form.Item>

          <Form.Item label="Cor Identificadora da Tag">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      backgroundColor: c,
                      border: selectedColor === c ? '2px solid #121619' : '1px solid #E1E9EF',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
              <Input
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{ width: 100 }}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Role Create/Edit Modal */}
      <Modal
        title={editingRole ? `Editar Papel: ${editingRole.name}` : 'Criar Novo Papel (Role)'}
        open={isRoleModalOpen}
        onCancel={() => {
          setIsRoleModalOpen(false);
          setEditingRole(null);
        }}
        onOk={() => roleForm.submit()}
        okText="Salvar Papel"
        cancelText="Cancelar"
        destroyOnClose
        centered
      >
        <Form form={roleForm} layout="vertical" onFinish={handleSaveRole}>
          <Form.Item name="name" label="Nome do Papel" rules={[{ required: true, message: 'Insira o nome do papel' }]}>
            <Input placeholder="Ex: Tech Lead, Security Officer, QA Engineer" />
          </Form.Item>
          <Form.Item name="category" label="Categoria do Papel" initialValue="Engineering">
            <Select>
              <Select.Option value="Engineering">Engineering</Select.Option>
              <Select.Option value="Security">Security</Select.Option>
              <Select.Option value="Governance">Governance</Select.Option>
              <Select.Option value="Observability">Observability</Select.Option>
              <Select.Option value="Custom">Custom</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Nível de Prioridade Hierárquica (1 a 100)" initialValue={50}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Descrição dos Privilégios">
            <Input.TextArea placeholder="Ex: Permissão de revisão e aprovação de blueprints corporativos" rows={3} />
          </Form.Item>
          {!editingRole && (
            <Form.Item name="permission_ids" label="Permissões Iniciais (Opcional)">
              <Select mode="multiple" placeholder="Selecione as permissões para conceder">
                {permissions.map((p) => (
                  <Select.Option key={p.id} value={p.id}>{p.code} — {p.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Permission Create/Edit Modal */}
      <Modal
        title={editingPermission ? `Editar Permissão: ${editingPermission.code}` : 'Criar Nova Permissão RBAC'}
        open={isPermissionModalOpen}
        onCancel={() => {
          setIsPermissionModalOpen(false);
          setEditingPermission(null);
        }}
        onOk={() => permissionForm.submit()}
        okText="Salvar Permissão"
        cancelText="Cancelar"
        destroyOnClose
        centered
      >
        <Form form={permissionForm} layout="vertical" onFinish={handleSavePermission}>
          <Form.Item name="code" label="Código da Permissão" rules={[{ required: true, message: 'Insira o código' }]}>
            <Input placeholder="ex: blueprints.export.terraform" />
          </Form.Item>
          <Form.Item name="name" label="Nome Descritivo" rules={[{ required: true, message: 'Insira o nome' }]}>
            <Input placeholder="ex: Exportar Blueprint para Terraform" />
          </Form.Item>
          <Form.Item name="module" label="Módulo / Domínio" rules={[{ required: true, message: 'Selecione o módulo' }]} initialValue="Blueprints">
            <Select>
              <Select.Option value="Core">Core</Select.Option>
              <Select.Option value="Catalog">Catalog</Select.Option>
              <Select.Option value="Blueprints">Blueprints</Select.Option>
              <Select.Option value="Knowledge">Knowledge</Select.Option>
              <Select.Option value="IAM">IAM</Select.Option>
              <Select.Option value="Audit">Audit</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Ação / Categoria" initialValue="Write">
            <Select>
              <Select.Option value="Read">Read</Select.Option>
              <Select.Option value="Write">Write</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Security">Security</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
