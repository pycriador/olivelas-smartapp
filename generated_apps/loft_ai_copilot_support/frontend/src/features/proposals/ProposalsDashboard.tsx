import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Select, Modal, Form, InputNumber, Popconfirm, message, Card, Statistic, Row, Col } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Proposal } from '../../types/domain.types';
import { proposalApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';

interface ProposalsDashboardProps {
  appName: string;
}

export const ProposalsDashboard: React.FC<ProposalsDashboardProps> = ({ appName }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await proposalApi.list(statusFilter, search);
      setProposals(data);
    } catch (err) {
      message.error('Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleCreate = async (values: any) => {
    try {
      await proposalApi.create(values);
      message.success('Proposta criada com sucesso!');
      setModalOpen(false);
      form.resetFields();
      loadData();
    } catch (err) {
      message.error('Falha ao criar proposta');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await proposalApi.delete(id);
      message.success('Proposta excluída com sucesso');
      loadData();
    } catch (err) {
      message.error('Falha ao excluir proposta');
    }
  };

  const totalValue = proposals.reduce((acc, p) => acc + (p.amount || 0), 0);
  const approvedCount = proposals.filter((p) => p.status === 'Approved').length;

  const columns = [
    {
      title: 'Proposta / Título',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Proposal) => (
        <div>
          <div className="font-semibold text-[#121619]">{text}</div>
          <div className="text-xs text-[#627D98]">{record.client_name} • {record.client_document}</div>
        </div>
      ),
    },
    {
      title: 'Modalidade',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Valor Locação',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold text-[#121619]">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
        </span>
      ),
    },
    {
      title: 'Score de Risco',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score: number) => (
        <Tag color={score >= 750 ? '#0B6B4F' : score >= 600 ? '#FA8C16' : '#CE4242'}>
          {score} pts
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const map: Record<string, { color: string; label: string }> = {
          Approved: { color: 'success', label: 'Aprovada' },
          Pending: { color: 'warning', label: 'Em Análise' },
          Rejected: { color: 'error', label: 'Recusada' },
        };
        const conf = map[st] || { color: 'default', label: st };
        return <Tag color={conf.color}>{conf.label}</Tag>;
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Proposal) => (
        <Popconfirm
          title="Excluir proposta?"
          description="Esta ação removerá o registro permanentemente."
          onConfirm={() => handleDelete(record.id)}
          okButtonProps={{ danger: true }}
        >
          <Button danger type="text" icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Painel de Propostas & Garantias"
        subtitle={`Gerenciamento operacional de esteiras e garantias da aplicação ${appName}.`}
        breadcrumbs={[
          { title: 'Home' },
          { title: appName },
          { title: 'Propostas' },
        ]}
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            className="bg-[#F56738] hover:bg-[#D94616] font-semibold"
          >
            Nova Proposta
          </Button>
        }
      />

      {/* Top Metrics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Total de Propostas</span>}
              value={proposals.length}
              prefix={<ClockCircleOutlined className="text-[#F56738]" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Volume Total sob Garantia</span>}
              value={totalValue}
              precision={2}
              prefix={<DollarOutlined className="text-[#0B6B4F]" />}
              formatter={(val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Propostas Aprovadas</span>}
              value={approvedCount}
              valueStyle={{ color: '#0B6B4F' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <Input
              placeholder="Buscar por título ou cliente..."
              prefix={<SearchOutlined className="text-[#627D98]" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={loadData}
              className="max-w-md"
            />
            <Select
              placeholder="Filtrar por Status"
              allowClear
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="w-44"
              options={[
                { label: 'Aprovada', value: 'Approved' },
                { label: 'Em Análise', value: 'Pending' },
                { label: 'Recusada', value: 'Rejected' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={loadData} />
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            className="bg-[#F56738] hover:bg-[#D94616] font-semibold"
          >
            Nova Proposta
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={proposals}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Centered Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-[#F56738]" />
            <span>Cadastrar Nova Proposta de Garantia</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Criar Proposta"
        cancelText="Cancelar"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="pt-2">
          <Form.Item name="title" label="Título da Proposta" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="Ex: Locação Apartamento Bela Vista 302" />
          </Form.Item>
          <Form.Item name="client_name" label="Nome do Proponente / Locatário" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="Ex: Fernanda Lima" />
          </Form.Item>
          <Form.Item name="client_email" label="E-mail de Contato" rules={[{ required: true, type: 'email', message: 'E-mail inválido' }]}>
            <Input placeholder="Ex: fernanda.lima@exemplo.com" />
          </Form.Item>
          <Form.Item name="client_document" label="CPF / CNPJ" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="Ex: 123.456.789-00" />
          </Form.Item>
          <Form.Item name="amount" label="Valor Mensal do Aluguel (R$)" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <InputNumber className="w-full" min={100} placeholder="Ex: 3500.00" />
          </Form.Item>
          <Form.Item name="category" label="Modalidade" initialValue="Fiança Aluguel">
            <Select
              options={[
                { label: 'Fiança Aluguel', value: 'Fiança Aluguel' },
                { label: 'Garantia Empresarial', value: 'Garantia Empresarial' },
                { label: 'Depósito Caução Assistido', value: 'Depósito Caução Assistido' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
