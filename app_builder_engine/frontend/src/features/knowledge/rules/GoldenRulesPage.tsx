import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Input,
  Select,
  Pagination,
  Modal,
  message,
  Space,
  Form,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  CopyOutlined,
  ExperimentOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/FeedbackStates';
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';
import { EntityVersionModal } from '@/components/ui/EntityVersionModal';
import { catalogService } from '@/services/catalog.service';
import { rulesService } from '@/services/rules.service';
import { useUrlPagination } from '@/hooks/useUrlPagination';
import { useUIStore } from '@/stores/uiStore';
import { navigateTo } from '@/router/navigation';
import type { Rule } from '@/types/domain.types';

export const GoldenRulesPage: React.FC = () => {
  const { openInspector360 } = useUIStore();
  const [rules, setRules] = useState<Rule[]>([]);
  const [totalRules, setTotalRules] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  // URL-synced & Server-Side Pagination
  const { currentPage, pageSize, setCurrentPage, setPageSize, resetToFirstPage } = useUrlPagination(5);

  // Modals
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [ruleForm] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Versioning Modal
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionTargetRule, setVersionTargetRule] = useState<Rule | null>(null);

  // Detail Modal
  const [detailRule, setDetailRule] = useState<Rule | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Simulator Modal
  const [simulatorModalOpen, setSimulatorModalOpen] = useState(false);
  const [simulatorCode, setSimulatorCode] = useState(
    '// Cole seu código React/FastAPI aqui para validar conformidade\nimport React from "react";\nimport { Button } from "antd";\n'
  );
  const [validationResults, setValidationResults] = useState<any[] | null>(null);
  const [simulating, setSimulating] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await catalogService.getRulesPaginated({
        search: search || undefined,
        severity: severityFilter,
        category: categoryFilter,
        page: currentPage,
        page_size: pageSize,
      });
      setRules(res.data);
      setTotalRules(res.meta?.total ?? res.data.length);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar regras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, search, severityFilter, categoryFilter]);

  const filteredRules = useMemo(() => ({ length: totalRules }), [totalRules]);
  const paginatedRules = rules;

  useEffect(() => {
    if (ruleModalOpen) {
      if (editingRule) {
        ruleForm.setFieldsValue({
          name: editingRule.name,
          category: editingRule.category,
          priority: editingRule.priority || editingRule.severity || 'REQUIRED',
          severity: editingRule.severity || editingRule.priority || 'REQUIRED',
          scope: editingRule.scope || 'Global',
          rule_statement: editingRule.rule_statement || editingRule.description,
          description: editingRule.description,
          good_example: editingRule.good_example || '',
          bad_example: editingRule.bad_example || '',
          referenced_spec: editingRule.referenced_spec || '',
          version: editingRule.version || '1.0.0',
          status: editingRule.status || 'Published',
        });
      } else {
        ruleForm.resetFields();
        ruleForm.setFieldsValue({
          category: 'Frontend & UI',
          priority: 'REQUIRED',
          severity: 'REQUIRED',
          scope: 'Global',
          version: '1.0.0',
          status: 'Published',
        });
      }
    }
  }, [ruleModalOpen, editingRule, ruleForm]);

  const handleOpenCreate = () => {
    setEditingRule(null);
    setRuleModalOpen(true);
  };

  const handleOpenEdit = (rule: Rule, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingRule(rule);
    setRuleModalOpen(true);
  };

  const handleSaveRule = async (values: any) => {
    setFormSubmitting(true);
    try {
      if (editingRule) {
        await catalogService.updateRule(editingRule.id, values);
        message.success(`Regra '${values.name}' atualizada com sucesso!`);
      } else {
        await catalogService.createRule(values);
        message.success(`Regra '${values.name}' cadastrada com sucesso!`);
      }
      setRuleModalOpen(false);
      fetchRules();
    } catch (err: any) {
      message.error(err.message || 'Falha ao salvar regra');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteRule = async (rule: Rule, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await catalogService.deleteRule(rule.id);
      message.success(`Regra '${rule.name}' removida com sucesso!`);
      if (detailRule?.id === rule.id) setDetailModalOpen(false);
      fetchRules();
    } catch (err: any) {
      message.error(err.message || 'Falha ao remover regra');
    }
  };

  const handleOpenVersionModal = (rule: Rule, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVersionTargetRule(rule);
    setVersionModalOpen(true);
  };

  const handleOpenDetail = (rule: Rule, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDetailRule(rule);
    setDetailModalOpen(true);
  };

  const handleCopyRule = (rule: Rule, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(`[${rule.severity || rule.priority}] ${rule.name}: ${rule.rule_statement}`);
    message.success('Declaração da regra copiada!');
  };

  const handleOpen360 = (rule: Rule, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigateTo('/knowledge/rules', { id: rule.id, type: 'rule' });
    openInspector360('rule', rule.id);
  };

  const handleRunSimulator = async () => {
    if (!simulatorCode.trim()) {
      message.warning('Insira o código para validar.');
      return;
    }
    setSimulating(true);
    try {
      const results = await rulesService.validateCode(simulatorCode);
      setValidationResults(results.violations || []);
    } catch (err: any) {
      message.error(err.message || 'Erro ao simular validação');
    } finally {
      setSimulating(false);
    }
  };

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(rules.map((r) => r.category).filter(Boolean)));
  }, [rules]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Golden Rules & Diretrizes de Engenharia"
        subtitle="Padrões mandatórios e recomendados para Frontend, Backend, Arquitetura e Segurança. CRUD completo e versionamento SemVer."
        breadcrumbs={[
          { title: 'Knowledge Base', href: '/knowledge' },
          { title: 'Golden Rules' },
        ]}
        actions={
          <Space>
            <Button
              icon={<ExperimentOutlined />}
              onClick={() => setSimulatorModalOpen(true)}
            >
              Simulador
            </Button>
            <Button icon={<ReloadOutlined />} onClick={fetchRules}>
              Atualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
              className="bg-loft-orange hover:bg-[#D9532B] border-none"
            >
              Nova Golden Rule
            </Button>
          </Space>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <Input
            placeholder="Buscar por nome, declaração ou categoria..."
            prefix={<SearchOutlined className="text-loft-muted" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className="w-full sm:w-80"
            allowClear
          />

          <Select
            placeholder="Categoria"
            allowClear
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              resetToFirstPage();
            }}
            className="w-48"
            options={uniqueCategories.map((c) => ({ label: c, value: c }))}
          />

          <Select
            placeholder="Severidade / Prioridade"
            allowClear
            value={severityFilter}
            onChange={(val) => {
              setSeverityFilter(val);
              resetToFirstPage();
            }}
            className="w-48"
            options={[
              { value: 'MANDATORY', label: 'MANDATORY (Obrigatória)' },
              { value: 'RECOMMENDED', label: 'RECOMMENDED (Recomendada)' },
              { value: 'OPTIONAL', label: 'OPTIONAL (Opcional)' },
            ]}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState tip="Carregando Golden Rules..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRules} />
      ) : filteredRules.length === 0 ? (
        <EmptyState
          title="Nenhuma Golden Rule encontrada"
          description="Ajuste os filtros de busca ou crie uma nova regra de engenharia."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {paginatedRules.map((rule) => (
            <Card
              key={rule.id}
              hoverable
              styles={{ body: { padding: '24px' } }}
              className="border-loft-border rounded-xl shadow-xs hover:shadow-md hover:border-[#F56738]/40 transition-all duration-200 cursor-pointer"
              onClick={() => handleOpenDetail(rule)}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <SafetyCertificateOutlined className="text-loft-orange text-base" />
                    <span className="font-bold text-sm text-loft-dark hover:text-loft-orange transition">
                      {rule.name}
                    </span>
                    <Tag
                      color={
                        rule.severity === 'MANDATORY' || (rule.priority as any) === 'CRITICAL' || (rule.priority as any) === 'REQUIRED' || rule.priority === 'Required'
                          ? 'error'
                          : 'warning'
                      }
                    >
                      {rule.severity || rule.priority}
                    </Tag>
                    <Tag color="blue">{rule.category}</Tag>
                    <Tag color="orange" className="font-mono">v{rule.version || '1.0.0'}</Tag>
                  </div>

                  <p className="text-sm font-semibold text-loft-dark mb-2 leading-relaxed">
                    {rule.rule_statement}
                  </p>

                  <p className="text-xs text-loft-muted mb-4 leading-relaxed">
                    {rule.description}
                  </p>

                  {(rule.good_example || rule.bad_example) && (
                    <Row gutter={[16, 16]}>
                      {rule.good_example && (
                        <Col xs={24} md={12}>
                          <div className="text-[11px] font-semibold text-loft-success mb-1 flex items-center gap-1">
                            <CheckCircleOutlined /> Exemplo Correto (Copan Standard)
                          </div>
                          <MarkdownViewer content={`\`\`\`tsx\n${rule.good_example}\n\`\`\``} />
                        </Col>
                      )}
                      {rule.bad_example && (
                        <Col xs={24} md={12}>
                          <div className="text-[11px] font-semibold text-loft-error mb-1 flex items-center gap-1">
                            <CloseCircleOutlined /> Exemplo Incorreto (Anti-pattern)
                          </div>
                          <MarkdownViewer content={`\`\`\`tsx\n${rule.bad_example}\n\`\`\``} />
                        </Col>
                      )}
                    </Row>
                  )}
                </div>

                <div className="shrink-0 flex sm:flex-col gap-2">
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={(e) => handleOpenDetail(rule, e)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(e) => handleOpenEdit(rule, e)}
                  >
                    Editar
                  </Button>
                  <Button
                    icon={<BranchesOutlined />}
                    size="small"
                    onClick={(e) => handleOpenVersionModal(rule, e)}
                  >
                    Versionar
                  </Button>
                  <Button
                    icon={<CompassOutlined />}
                    size="small"
                    onClick={(e) => handleOpen360(rule, e)}
                  >
                    360°
                  </Button>
                  <Popconfirm
                    title="Excluir regra?"
                    description="Tem certeza que deseja excluir esta Golden Rule do catálogo?"
                    onConfirm={(e) => handleDeleteRule(rule, e)}
                    okText="Excluir"
                    cancelText="Cancelar"
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-loft-border shadow-2xs">
            <span className="text-xs text-loft-muted font-medium">
              Exibindo {paginatedRules.length} de {filteredRules.length} Golden Rules
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredRules.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={['5', '10', '20']}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-loft-orange" />
            <span>{detailRule?.name}</span>
            <Tag color="orange" className="font-mono">v{detailRule?.version || '1.0.0'}</Tag>
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        width={850}
        centered
        styles={{
          body: {
            maxHeight: 'calc(85vh - 140px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={() => detailRule && handleCopyRule(detailRule)}>
            Copiar Declaração
          </Button>,
          <Button key="edit" icon={<EditOutlined />} onClick={() => {
            if (detailRule) {
              setDetailModalOpen(false);
              handleOpenEdit(detailRule);
            }
          }}>
            Editar
          </Button>,
          <Button key="version" icon={<BranchesOutlined />} onClick={() => detailRule && handleOpenVersionModal(detailRule)}>
            Versões
          </Button>,
          <Button key="360" type="primary" className="bg-loft-orange border-none" onClick={() => detailRule && handleOpen360(detailRule)}>
            360° Inspector
          </Button>,
        ]}
      >
        {detailRule && (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-[#FAFBFD] border border-loft-border rounded-xl text-xs flex justify-between items-center">
              <div>
                <b className="text-loft-dark">Escopo:</b> {detailRule.scope || 'Global'} | <b className="text-loft-dark">Prioridade:</b> {detailRule.severity || detailRule.priority}
              </div>
              <Tag color="blue">{detailRule.category}</Tag>
            </div>

            <div className="p-4 bg-white border border-loft-border rounded-xl text-xs space-y-3">
              <div>
                <div className="font-bold text-loft-dark mb-1">Declaração da Regra:</div>
                <div className="p-2.5 bg-[#FFF8F5] border-l-4 border-loft-orange rounded-r text-loft-dark font-medium">
                  {detailRule.rule_statement}
                </div>
              </div>

              <div>
                <div className="font-bold text-loft-dark mb-1">Descrição e Racional:</div>
                <MarkdownViewer content={detailRule.description || ''} />
              </div>

              {detailRule.referenced_spec && (
                <div>
                  <div className="font-bold text-loft-dark mb-1">Especificação Referenciada (SDD):</div>
                  <Tag color="purple">{detailRule.referenced_spec}</Tag>
                </div>
              )}

              {(detailRule.good_example || detailRule.bad_example) && (
                <div className="pt-2">
                  <div className="font-bold text-loft-dark mb-2">Exemplos de Implementação:</div>
                  <Row gutter={[16, 16]}>
                    {detailRule.good_example && (
                      <Col span={12}>
                        <div className="text-[11px] font-semibold text-loft-success mb-1">
                          ✓ Exemplo Recomendado
                        </div>
                        <MarkdownViewer content={`\`\`\`tsx\n${detailRule.good_example}\n\`\`\``} />
                      </Col>
                    )}
                    {detailRule.bad_example && (
                      <Col span={12}>
                        <div className="text-[11px] font-semibold text-loft-error mb-1">
                          ✕ Exemplo Anti-pattern
                        </div>
                        <MarkdownViewer content={`\`\`\`tsx\n${detailRule.bad_example}\n\`\`\``} />
                      </Col>
                    )}
                  </Row>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Edit Rule Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-loft-orange" />
            <span>{editingRule ? 'Editar Golden Rule' : 'Nova Golden Rule'}</span>
          </div>
        }
        open={ruleModalOpen}
        onCancel={() => setRuleModalOpen(false)}
        footer={null}
        width={750}
        centered
        styles={{
          body: {
            maxHeight: 'calc(85vh - 140px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
        destroyOnClose
      >
        <Form
          form={ruleForm}
          layout="vertical"
          onFinish={handleSaveRule}
          className="pt-2"
        >
          <Form.Item
            name="name"
            label="Nome da Regra"
            rules={[{ required: true, message: 'Informe o nome da regra' }]}
          >
            <Input placeholder="Ex: Loft Copan Component Usage" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Categoria"
                rules={[{ required: true, message: 'Selecione a categoria' }]}
              >
                <Select
                  options={[
                    { value: 'Frontend & UI', label: 'Frontend & UI' },
                    { value: 'Design System', label: 'Design System' },
                    { value: 'Layout & Navigation', label: 'Layout & Navigation' },
                    { value: 'Architecture', label: 'Architecture' },
                    { value: 'API & Security', label: 'API & Security' },
                    { value: 'State Management', label: 'State Management' },
                    { value: 'Performance', label: 'Performance' },
                    { value: 'Backend Engineering', label: 'Backend Engineering' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Prioridade / Severidade"
                rules={[{ required: true, message: 'Selecione a severidade' }]}
              >
                <Select
                  options={[
                    { value: 'REQUIRED', label: 'REQUIRED (Mandatória / Crítica)' },
                    { value: 'RECOMMENDED', label: 'RECOMMENDED (Recomendada)' },
                    { value: 'OPTIONAL', label: 'OPTIONAL (Opcional)' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="rule_statement"
            label="Declaração Mandatória da Regra"
            rules={[{ required: true, message: 'Informe a declaração objetiva da regra' }]}
          >
            <Input.TextArea rows={2} placeholder="Ex: Todo componente React deve utilizar exclusivamente tokens do Design System Copan." />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição e Racional Arquitetural"
            rules={[{ required: true, message: 'Informe a descrição' }]}
          >
            <Input.TextArea rows={3} placeholder="Explique por que esta regra existe e quais problemas ela previne..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="good_example" label="Exemplo Correto (Código)">
                <Input.TextArea rows={4} className="font-mono text-xs" placeholder="import { Button } from '@/components/copan';" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bad_example" label="Exemplo Incorreto (Anti-pattern)">
                <Input.TextArea rows={4} className="font-mono text-xs" placeholder="import { Button } from 'antd';" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="referenced_spec" label="Especificação SDD Vinculada">
                <Input placeholder="Ex: spec_fe_volume_i_loft_design_system_foundat" className="font-mono" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="version" label="Versão">
                <Input placeholder="1.0.0" className="font-mono" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="scope" label="Escopo">
                <Input placeholder="Global" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex items-center justify-between pt-4 border-t border-loft-border">
            {editingRule ? (
              <Popconfirm
                title="Excluir permanentemente do banco de dados?"
                description={
                  <div className="max-w-[280px] text-xs text-loft-muted">
                    Esta ação removerá a regra <strong>{editingRule.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
                  </div>
                }
                okText="Sim, excluir permanentemente"
                cancelText="Cancelar"
                okButtonProps={{ danger: true, loading: formSubmitting, className: 'bg-[#E12D39]' }}
                onConfirm={async () => {
                  try {
                    await catalogService.deleteRule(editingRule.id);
                    message.success(`Golden Rule '${editingRule.name}' excluída com sucesso do banco de dados!`);
                    setRuleModalOpen(false);
                    fetchRules();
                  } catch (err: any) {
                    message.error(err.message || 'Falha ao excluir regra');
                  }
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Excluir Regra
                </Button>
              </Popconfirm>
            ) : <div />}
            <div className="flex items-center gap-2">
              <Button onClick={() => setRuleModalOpen(false)}>Cancelar</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={formSubmitting}
                className="bg-loft-orange hover:bg-[#D9532B] border-none"
              >
                {editingRule ? 'Salvar Alterações' : 'Cadastrar Regra'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Simulator Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExperimentOutlined className="text-loft-orange" />
            <span>Simulador de Validação de Golden Rules</span>
          </div>
        }
        open={simulatorModalOpen}
        onCancel={() => setSimulatorModalOpen(false)}
        centered
        styles={{
          body: {
            maxHeight: 'calc(85vh - 140px)',
            overflowY: 'auto',
            paddingRight: 8,
          },
        }}
        footer={[
          <Button key="close" onClick={() => setSimulatorModalOpen(false)}>
            Fechar
          </Button>,
          <Button
            key="run"
            type="primary"
            loading={simulating}
            icon={<ExperimentOutlined />}
            className="bg-loft-orange hover:bg-[#D9532B] border-none"
            onClick={handleRunSimulator}
          >
            Executar Análise de Conformidade
          </Button>,
        ]}
        width={760}
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-loft-muted">
            Cole um trecho de código JSX ou Python para inspecionar violações contra todas as Golden Rules mandatórias em tempo real.
          </p>
          <Input.TextArea
            rows={8}
            className="font-mono text-xs"
            value={simulatorCode}
            onChange={(e) => setSimulatorCode(e.target.value)}
          />

          {validationResults !== null && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-loft-dark mb-2">Resultado da Análise:</div>
              {validationResults.length === 0 ? (
                <div className="p-3 bg-[#F2FBF8] border border-[#8CE0CC] rounded-lg text-xs text-loft-success font-semibold">
                  ✓ Nenhuma violação detectada! O código atende a todas as Golden Rules da Loft.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {validationResults.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-lg text-xs"
                    >
                      <div className="font-bold text-loft-error">
                        {v.rule_id || v.rule_name || `Violação #${i + 1}`}
                      </div>
                      <div className="text-loft-dark mt-0.5">{v.message || v.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Universal Versioning Modal */}
      {versionTargetRule && (
        <EntityVersionModal
          open={versionModalOpen}
          onClose={() => setVersionModalOpen(false)}
          entityType="rule"
          entityId={versionTargetRule.id}
          entityName={versionTargetRule.name}
          currentVersion={versionTargetRule.version || '1.0.0'}
          versions={versionTargetRule.versions}
          onSuccess={fetchRules}
        />
      )}
    </div>
  );
};
