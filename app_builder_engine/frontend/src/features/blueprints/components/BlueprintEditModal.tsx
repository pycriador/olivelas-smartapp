import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Tag,
  Alert,
  Card,
  Badge,
  Popconfirm,
  message,
} from 'antd';
import {
  BuildOutlined,
  ApartmentOutlined,
  BlockOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { WorkshopEntitySelector } from '@/features/workshop/components/WorkshopEntitySelector';
import { blueprintsService } from '@/services/blueprints.service';
import { catalogService } from '@/services/catalog.service';
import { projectsService } from '@/services/projects.service';
import { useUIStore } from '@/stores/uiStore';
import type {
  Blueprint,
  Architecture,
  Module,
  Component,
  Template,
  Rule,
  Specification,
  Project,
  BlueprintValidationResult,
  BlueprintValidationDiagnostic,
} from '@/types/domain.types';

interface BlueprintEditModalProps {
  open: boolean;
  blueprint: Blueprint | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BlueprintEditModal: React.FC<BlueprintEditModalProps> = ({
  open,
  blueprint,
  onClose,
  onSuccess,
}) => {
  const { openInspector360 } = useUIStore();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('arch');

  // Catalogs
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Selected Entities
  const [selectedArchId, setSelectedArchId] = useState<string>('');
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [selectedCompIds, setSelectedCompIds] = useState<string[]>([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [selectedSpecIds, setSelectedSpecIds] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  // Validation & Dependency state
  const [validationResult, setValidationResult] = useState<BlueprintValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [resolvingDeps, setResolvingDeps] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load catalogs
  useEffect(() => {
    if (!open) return;
    const loadCatalogs = async () => {
      try {
        const [archList, modData, compData, tplData, rList, specData, projData] = await Promise.all([
          catalogService.getArchitectures(),
          catalogService.getModules(),
          catalogService.getComponents(),
          catalogService.getTemplates(),
          catalogService.getRules(),
          catalogService.getSpecifications(),
          projectsService.getProjects(),
        ]);
        setArchitectures(archList);
        setModules(modData);
        setComponents(compData);
        setTemplates(tplData);
        setRules(rList);
        setSpecifications(specData || []);
        setProjects(projData);
        setDataLoaded(true);
      } catch (err: any) {
        message.error('Falha ao carregar catálogo para edição: ' + (err.message || ''));
      }
    };
    loadCatalogs();
  }, [open]);

  // Populate blueprint values into state
  useEffect(() => {
    if (open && blueprint) {
      form.resetFields();
      form.setFieldsValue({
        name: blueprint.name,
        slug: blueprint.slug || '',
        description: blueprint.description,
        version: blueprint.version || '1.0.0',
        status: (blueprint as any).status || 'Draft',
        project_id: blueprint.project_id || undefined,
        architecture_id: blueprint.architecture_id,
      });

      setSelectedArchId(blueprint.architecture_id);
      setSelectedModuleIds(blueprint.modules || []);
      setSelectedCompIds(blueprint.components || []);
      setSelectedTemplateIds(blueprint.templates || []);
      setSelectedRuleIds(blueprint.rules || []);
      setSelectedSpecIds(blueprint.specifications || []);
      setSelectedProjectId(blueprint.project_id || undefined);
      setValidationResult(blueprint.validation || null);
      setActiveTab('arch');
    }
  }, [open, blueprint, form]);

  // Auto-validate debounce when selections change
  useEffect(() => {
    if (!open || !dataLoaded || !selectedArchId) return;

    const timer = setTimeout(async () => {
      setValidating(true);
      try {
        const res = await blueprintsService.validateConfig({
          architecture_id: selectedArchId,
          module_ids: selectedModuleIds,
          component_ids: selectedCompIds,
          template_ids: selectedTemplateIds,
          rule_ids: selectedRuleIds,
          specification_ids: selectedSpecIds,
        });
        setValidationResult(res);
      } catch {
        // silent fail for real-time validation
      } finally {
        setValidating(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    open,
    dataLoaded,
    selectedArchId,
    selectedModuleIds,
    selectedCompIds,
    selectedTemplateIds,
    selectedRuleIds,
    selectedSpecIds,
  ]);

  const selectedArch = useMemo(() => {
    return architectures.find((a) => a.id === selectedArchId);
  }, [architectures, selectedArchId]);

  const handleResolveAllDependencies = async () => {
    setResolvingDeps(true);
    try {
      const res = await blueprintsService.resolveDependencies({
        architecture_id: selectedArchId,
        module_ids: selectedModuleIds,
        component_ids: selectedCompIds,
        template_ids: selectedTemplateIds,
      });

      setSelectedModuleIds(Array.from(new Set([...selectedModuleIds, ...res.resolved_modules])));
      setSelectedCompIds(Array.from(new Set([...selectedCompIds, ...res.resolved_components])));
      setSelectedRuleIds(Array.from(new Set([...selectedRuleIds, ...res.resolved_rules])));
      setSelectedSpecIds(Array.from(new Set([...selectedSpecIds, ...res.resolved_specifications])));

      message.success('Todas as dependências e regras foram resolvidas determinísticamente!');
    } catch (err: any) {
      message.error(`Erro ao resolver dependências: ${err.message}`);
    } finally {
      setResolvingDeps(false);
    }
  };

  const handleApplyDiagnosticAction = (diagnostic: BlueprintValidationDiagnostic) => {
    const act = diagnostic.recommended_action;
    if (!act || !act.payload) return;

    const payload = act.payload;
    if (payload.type === 'module' && payload.resource_id) {
      setSelectedModuleIds((prev) => Array.from(new Set([...prev, payload.resource_id])));
      message.success(`Módulo ${payload.resource_id} adicionado.`);
    } else if (payload.type === 'rule' && payload.resource_id) {
      setSelectedRuleIds((prev) => Array.from(new Set([...prev, payload.resource_id])));
      message.success(`Regra ${payload.resource_id} vinculada.`);
    } else if (payload.type === 'specification' && payload.resource_id) {
      setSelectedSpecIds((prev) => Array.from(new Set([...prev, payload.resource_id])));
      message.success(`Especificação ${payload.resource_id} vinculada.`);
    } else if (payload.architecture_id) {
      setSelectedArchId(payload.architecture_id);
      form.setFieldValue('architecture_id', payload.architecture_id);
      message.success(`Arquitetura atualizada para ${payload.architecture_id}.`);
    }
  };

  const handleInspect = (entityType: string, id: string) => {
    openInspector360(entityType, id);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!blueprint) return;

      setSubmitting(true);
      const payload = {
        name: values.name,
        slug: values.slug || undefined,
        description: values.description,
        version: values.version,
        status: values.status,
        project_id: values.project_id || null,
        architecture_id: selectedArchId,
        modules: selectedModuleIds,
        components: selectedCompIds,
        templates: selectedTemplateIds,
        rules: selectedRuleIds,
        specifications: selectedSpecIds,
      };

      await blueprintsService.updateBlueprint(blueprint.id, payload);
      message.success(`Blueprint '${values.name}' atualizado com sucesso no banco de dados!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errorFields) {
        message.error('Por favor, preencha todos os campos obrigatórios.');
      } else {
        message.error(err.message || 'Falha ao salvar blueprint');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!blueprint) return;
    setSubmitting(true);
    try {
      await blueprintsService.deleteBlueprint(blueprint.id);
      message.success(`Blueprint '${blueprint.name}' excluído com sucesso do banco de dados!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err.message || 'Falha ao excluir blueprint');
    } finally {
      setSubmitting(false);
    }
  };

  // Preview JSON
  const rawManifestPreview = useMemo(() => {
    return {
      name: form.getFieldValue('name') || blueprint?.name,
      version: form.getFieldValue('version') || blueprint?.version || '1.0.0',
      status: form.getFieldValue('status') || (blueprint as any)?.status || 'Draft',
      architecture: {
        id: selectedArchId,
        name: selectedArch?.name || selectedArchId,
      },
      project_id: selectedProjectId,
      modules: selectedModuleIds,
      components: selectedCompIds,
      templates: selectedTemplateIds,
      rules: selectedRuleIds,
      specifications: selectedSpecIds,
      validation: validationResult
        ? {
            status: validationResult.status,
            can_publish: validationResult.can_publish,
            critical_count: validationResult.critical_count,
            error_count: validationResult.error_count,
          }
        : null,
    };
  }, [
    form,
    blueprint,
    selectedArchId,
    selectedArch,
    selectedProjectId,
    selectedModuleIds,
    selectedCompIds,
    selectedTemplateIds,
    selectedRuleIds,
    selectedSpecIds,
    validationResult,
  ]);

  if (!blueprint) return null;

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-8 border-b border-loft-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF8F5] flex items-center justify-center border border-loft-orange/20">
              <BuildOutlined className="text-loft-orange text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-loft-dark text-base">
                  Editor Visual de Blueprint Copan
                </span>
                <Tag color="orange" className="font-mono font-bold">
                  v{blueprint.version || '1.0.0'}
                </Tag>
                <Tag color={(blueprint as any).status === 'Published' ? 'green' : 'blue'}>
                  {(blueprint as any).status || 'Draft'}
                </Tag>
              </div>
              <div className="text-xs text-loft-muted font-mono">
                ID: {blueprint.id} • Modificações refletidas em tempo real no SQLite
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {validating && (
              <Tag color="processing" className="text-xs">
                Validando...
              </Tag>
            )}
            {validationResult && (
              <Badge
                count={
                  validationResult.can_publish
                    ? '100% Válido'
                    : `${validationResult.critical_count + validationResult.error_count} Alertas`
                }
                style={{
                  backgroundColor: validationResult.can_publish ? '#20A483' : '#E12D39',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            )}
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      destroyOnClose
      centered
      className="copan-blueprint-editor-modal"
    >
      <div className="max-h-[76vh] overflow-y-auto px-1 py-2">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="copan-tabs"
          items={[
            {
              key: 'arch',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <ApartmentOutlined /> 1. Arquitetura & Identificação
                </span>
              ),
              children: (
                <div className="space-y-6 pt-2">
                  <Form form={form} layout="vertical">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label={<span className="font-semibold text-loft-dark">Nome do Blueprint</span>}
                          rules={[{ required: true, message: 'Informe o nome do Blueprint' }]}
                        >
                          <Input placeholder="Ex: Portal de Renegociação B2B Copan" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="version"
                          label={<span className="font-semibold text-loft-dark">Versão SemVer</span>}
                          rules={[{ required: true, message: 'Informe a versão' }]}
                        >
                          <Input placeholder="1.0.0" className="font-mono" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="status"
                          label={<span className="font-semibold text-loft-dark">Status do Ciclo</span>}
                          rules={[{ required: true, message: 'Selecione o status' }]}
                        >
                          <Select
                            size="large"
                            options={[
                              { value: 'Draft', label: 'Draft (Em Construção)' },
                              { value: 'Ready', label: 'Ready (Pronto para Publicação)' },
                              { value: 'Published', label: 'Published (Em Produção)' },
                              { value: 'Deprecated', label: 'Deprecated (Descontinuado)' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={16}>
                        <Form.Item
                          name="description"
                          label={<span className="font-semibold text-loft-dark">Descrição & Finalidade</span>}
                          rules={[{ required: true, message: 'Informe a descrição do blueprint' }]}
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="Descreva o propósito funcional, escopo da aplicação e padrões de governança adotados..."
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="project_id"
                          label={<span className="font-semibold text-loft-dark">Projeto Vinculado</span>}
                        >
                          <Select
                            size="large"
                            allowClear
                            placeholder="Selecione um projeto existente"
                            onChange={(val) => setSelectedProjectId(val)}
                            options={projects.map((p) => ({
                              value: p.id,
                              label: `${p.name} (${p.domain || 'Eng'})`,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>

                  {/* Architecture Selection Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-loft-dark m-0">
                          Padrão Arquitetural Base
                        </h4>
                        <p className="text-xs text-loft-muted m-0">
                          Define a taxonomia de diretórios, separação de camadas e regras de dependência.
                        </p>
                      </div>
                      <Tag color="orange" className="font-mono">
                        {architectures.length} Arquiteturas Certificadas
                      </Tag>
                    </div>

                    <Row gutter={[16, 16]}>
                      {architectures.map((arch) => {
                        const isSelected = selectedArchId === arch.id;
                        return (
                          <Col span={8} key={arch.id}>
                            <Card
                              hoverable
                              onClick={() => {
                                setSelectedArchId(arch.id);
                                form.setFieldValue('architecture_id', arch.id);
                              }}
                              className={`cursor-pointer transition-all h-full rounded-xl border ${
                                isSelected
                                  ? 'border-loft-orange bg-[#FFF8F5] ring-2 ring-[#F56738]/20 shadow-xs'
                                  : 'border-loft-border bg-white hover:border-loft-orange/50'
                              }`}
                              bodyStyle={{ padding: 16 }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className="font-bold text-loft-dark text-sm">
                                  {arch.name}
                                </span>
                                {isSelected ? (
                                  <CheckCircleOutlined className="text-loft-orange text-base" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-[#CBD5E1]" />
                                )}
                              </div>
                              <p className="text-xs text-loft-muted line-clamp-2 mb-3 min-h-[32px]">
                                {arch.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {arch.characteristics?.slice(0, 2).map((c, i) => (
                                  <Tag key={i} className="text-[10px] m-0 bg-white border-loft-border">
                                    {c}
                                  </Tag>
                                ))}
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>

                    {selectedArch && (
                      <div className="mt-4 p-4 bg-[#FAFBFD] border border-loft-border rounded-xl">
                        <div className="text-xs font-bold text-loft-dark uppercase tracking-wider mb-2">
                          Detalhes do Padrão: {selectedArch.name}
                        </div>
                        <Row gutter={16}>
                          <Col span={12}>
                            <div className="text-xs text-loft-muted mb-1 font-semibold">Recomendado Para:</div>
                            <ul className="list-disc pl-4 text-xs text-loft-dark space-y-1">
                              {selectedArch.recommended_for?.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </Col>
                          <Col span={12}>
                            <div className="text-xs text-[#E12D39] mb-1 font-semibold">Restrições Mandatórias:</div>
                            <ul className="list-disc pl-4 text-xs text-loft-dark space-y-1">
                              {selectedArch.restrictions?.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'modules_components',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <BlockOutlined /> 2. Módulos & Componentes
                  <Badge
                    count={selectedModuleIds.length + selectedCompIds.length}
                    style={{ backgroundColor: '#F56738' }}
                  />
                </span>
              ),
              children: (
                <div className="space-y-8 pt-2">
                  <WorkshopEntitySelector
                    stepNumber={1}
                    title="Módulos Funcionais de Domínio"
                    subtitle="Selecione os módulos de negócio e segurança que compõem este blueprint"
                    entityType="module"
                    items={modules}
                    selectedIds={selectedModuleIds}
                    onChange={setSelectedModuleIds}
                    accentColor="#F56738"
                    pageSize={6}
                    onInspect={handleInspect}
                  />

                  <div className="border-t border-loft-border pt-6">
                    <WorkshopEntitySelector
                      stepNumber={2}
                      title="Componentes Visuais do Design System Copan"
                      subtitle="Selecione os componentes React certificados da Loft para a camada de apresentação"
                      entityType="component"
                      items={components}
                      selectedIds={selectedCompIds}
                      onChange={setSelectedCompIds}
                      accentColor="#F56738"
                      pageSize={8}
                      onInspect={handleInspect}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'templates_rules',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <SafetyCertificateOutlined /> 3. Templates, Regras & SDDs
                  <Badge
                    count={selectedTemplateIds.length + selectedRuleIds.length + selectedSpecIds.length}
                    style={{ backgroundColor: '#20A483' }}
                  />
                </span>
              ),
              children: (
                <div className="space-y-8 pt-2">
                  <WorkshopEntitySelector
                    stepNumber={3}
                    title="Templates Certificados de Inicialização"
                    subtitle="Estrutura base de código e boilerplate padronizado para o blueprint"
                    entityType="template"
                    items={templates}
                    selectedIds={selectedTemplateIds}
                    onChange={setSelectedTemplateIds}
                    accentColor="#20A483"
                    pageSize={4}
                    onInspect={handleInspect}
                  />

                  <div className="border-t border-loft-border pt-6">
                    <WorkshopEntitySelector
                      stepNumber={4}
                      title="Golden Rules Mandatórias & Padrões Loft"
                      subtitle="Regras arquiteturais, de segurança e qualidade validadas pelo compilador"
                      entityType="rule"
                      items={rules}
                      selectedIds={selectedRuleIds}
                      onChange={setSelectedRuleIds}
                      accentColor="#E12D39"
                      pageSize={6}
                      onInspect={handleInspect}
                    />
                  </div>

                  <div className="border-t border-loft-border pt-6">
                    <WorkshopEntitySelector
                      stepNumber={5}
                      title="Especificações Técnicas de Software (SDDs)"
                      subtitle="Documentos formais de especificação de domínio e governança técnica"
                      entityType="specification"
                      items={specifications}
                      selectedIds={selectedSpecIds}
                      onChange={setSelectedSpecIds}
                      accentColor="#6366F1"
                      pageSize={6}
                      onInspect={handleInspect}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'diagnostics',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <ThunderboltOutlined /> 4. Diagnóstico ao Vivo & Dependências
                  {validationResult && !validationResult.can_publish && (
                    <Badge count="!" style={{ backgroundColor: '#E12D39' }} />
                  )}
                </span>
              ),
              children: (
                <div className="space-y-6 pt-2">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      validationResult?.can_publish
                        ? 'bg-[#F2FBF8] border-[#8CE0CC] text-loft-success'
                        : 'bg-[#FDF2F2] border-[#F8B4B4] text-loft-error'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {validationResult?.can_publish ? (
                        <CheckCircleOutlined className="text-2xl text-loft-success" />
                      ) : (
                        <WarningOutlined className="text-2xl text-loft-error" />
                      )}
                      <div>
                        <div className="font-bold text-sm">
                          {validationResult?.can_publish
                            ? 'Blueprint 100% Válido para Produção!'
                            : `Atenção: ${validationResult?.critical_count || 0} erro(s) crítico(s) e ${
                                validationResult?.error_count || 0
                              } aviso(s) detectados.`}
                        </div>
                        <div className="text-xs opacity-90">
                          {validationResult?.can_publish
                            ? 'Todas as restrições arquiteturais, Golden Rules e dependências de pacotes estão satisfeitas.'
                            : 'Resolva os conflitos abaixo ou use o botão de resolução automática antes de publicar.'}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      icon={<ThunderboltOutlined />}
                      loading={resolvingDeps}
                      onClick={handleResolveAllDependencies}
                      className="bg-loft-orange hover:bg-[#D9532B] border-none font-semibold"
                    >
                      Resolver Dependências Automaticamente
                    </Button>
                  </div>

                  {/* Diagnostics List */}
                  {validationResult?.diagnostics && validationResult.diagnostics.length > 0 ? (
                    <div>
                      <h4 className="text-xs font-bold text-loft-dark uppercase tracking-wider mb-3">
                        Diagnósticos & Recomendações do Compilador
                      </h4>
                      <div className="space-y-3">
                        {validationResult.diagnostics.map((diag, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border flex items-start justify-between gap-4 ${
                              diag.severity === 'CRITICAL' || diag.severity === 'ERROR'
                                ? 'bg-[#FFF5F5] border-[#FED7D7]'
                                : 'bg-[#FFFBEB] border-[#FDE68A]'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {diag.severity === 'CRITICAL' || diag.severity === 'ERROR' ? (
                                <CloseCircleOutlined className="text-[#E12D39] text-base mt-0.5" />
                              ) : (
                                <WarningOutlined className="text-[#D97706] text-base mt-0.5" />
                              )}
                              <div>
                                <div className="font-bold text-xs text-loft-dark flex items-center gap-2">
                                  <span>{(diag as any).rule_name || diag.code}</span>
                                  <Tag
                                    color={
                                      diag.severity === 'CRITICAL' || diag.severity === 'ERROR'
                                        ? 'red'
                                        : 'gold'
                                    }
                                    className="text-[10px]"
                                  >
                                    {diag.severity}
                                  </Tag>
                                </div>
                                <div className="text-xs text-[#486581] mt-1">{diag.message}</div>
                              </div>
                            </div>

                            {diag.recommended_action && (
                              <Button
                                size="small"
                                type="primary"
                                onClick={() => handleApplyDiagnosticAction(diag)}
                                className="bg-loft-dark hover:bg-[#242A30] border-none text-xs"
                              >
                                {diag.recommended_action.label || 'Aplicar Correção'}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Alert
                      type="success"
                      showIcon
                      message="Nenhuma violação encontrada"
                      description="Todos os contratos de módulos, Golden Rules e especificações técnicas estão em total conformidade."
                    />
                  )}

                  {/* Selected summary */}
                  <div className="p-4 bg-[#FAFBFD] border border-loft-border rounded-xl space-y-3">
                    <div className="text-xs font-bold text-loft-dark uppercase tracking-wider">
                      Resumo da Composição
                    </div>
                    <Row gutter={16}>
                      <Col span={6}>
                        <div className="text-xs text-loft-muted">Módulos ({selectedModuleIds.length})</div>
                        <div className="font-bold text-sm text-loft-dark">{selectedModuleIds.length} ativos</div>
                      </Col>
                      <Col span={6}>
                        <div className="text-xs text-loft-muted">Componentes ({selectedCompIds.length})</div>
                        <div className="font-bold text-sm text-loft-dark">{selectedCompIds.length} ativos</div>
                      </Col>
                      <Col span={6}>
                        <div className="text-xs text-loft-muted">Templates ({selectedTemplateIds.length})</div>
                        <div className="font-bold text-sm text-loft-dark">{selectedTemplateIds.length} ativos</div>
                      </Col>
                      <Col span={6}>
                        <div className="text-xs text-loft-muted">Regras & SDDs</div>
                        <div className="font-bold text-sm text-loft-dark">
                          {selectedRuleIds.length + selectedSpecIds.length} ativas
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              ),
            },
            {
              key: 'manifest',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <FolderOpenOutlined /> 5. Manifesto & Estrutura
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-loft-dark m-0">
                        Manifesto Determinístico do Blueprint (`blueprint.json`)
                      </h4>
                      <p className="text-xs text-loft-muted m-0">
                        Contrato imutável de montagem gerado para o compilador de código.
                      </p>
                    </div>
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(rawManifestPreview, null, 2));
                        message.success('Manifesto JSON copiado para a área de transferência!');
                      }}
                    >
                      Copiar JSON
                    </Button>
                  </div>

                  <div className="p-4 bg-[#0F172A] rounded-xl overflow-x-auto max-h-[50vh]">
                    <pre className="text-[#38BDF8] font-mono text-xs whitespace-pre leading-relaxed">
                      {JSON.stringify(rawManifestPreview, null, 2)}
                    </pre>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Footer Copan */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-loft-border">
        <Popconfirm
          title="Excluir permanentemente do banco de dados?"
          description={
            <div className="max-w-[280px] text-xs text-loft-muted">
              Esta ação removerá o blueprint <strong>{blueprint.name}</strong> permanentemente da base SQLite e registrará na trilha de auditoria.
            </div>
          }
          okText="Sim, excluir permanentemente"
          cancelText="Cancelar"
          okButtonProps={{ danger: true, loading: submitting, className: 'bg-[#E12D39]' }}
          onConfirm={handleDelete}
        >
          <Button danger icon={<DeleteOutlined />}>
            Excluir Blueprint
          </Button>
        </Popconfirm>

        <div className="flex items-center gap-2">
          <Button
            icon={<ThunderboltOutlined />}
            loading={resolvingDeps}
            onClick={handleResolveAllDependencies}
          >
            Resolver Dependências
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="primary"
            loading={submitting}
            onClick={handleSave}
            className="bg-loft-orange hover:bg-[#D9532B] border-none font-semibold"
          >
            Salvar Alterações no Blueprint
          </Button>
        </div>
      </div>
    </Modal>
  );
};
