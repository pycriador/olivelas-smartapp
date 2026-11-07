import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Tag,
  Alert,
  Input,
  message,
  Modal,
  Tabs,
  Badge,
} from 'antd';
import {
  RocketOutlined,
  CopyOutlined,
  DownloadOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/FeedbackStates';
import { catalogService } from '@/services/catalog.service';
import { projectsService } from '@/services/projects.service';
import { blueprintsService } from '@/services/blueprints.service';
import { useUIStore } from '@/stores/uiStore';
import { WorkshopEntitySelector } from './components/WorkshopEntitySelector';
import type {
  Architecture,
  Module,
  Component,
  Template,
  Rule,
  Specification,
  Project,
  Blueprint,
  BlueprintValidationResult,
  BlueprintValidationDiagnostic,
} from '@/types/domain.types';

export const BlueprintWorkshopPage: React.FC = () => {
  const { setActiveView, openInspector360 } = useUIStore();

  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allBlueprints, setAllBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State - Default empty to allow live diagnostic feedback on missing mandatory rules
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintDesc, setBlueprintDesc] = useState('');
  const [selectedArchId, setSelectedArchId] = useState('');
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [selectedCompIds, setSelectedCompIds] = useState<string[]>([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [selectedSpecIds, setSelectedSpecIds] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [selectedPreloadBpId, setSelectedPreloadBpId] = useState<string | undefined>(undefined);
  const [selectedPreloadTplId, setSelectedPreloadTplId] = useState<string | undefined>(undefined);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Validation & Dependency State
  const [validationResult, setValidationResult] = useState<BlueprintValidationResult | null>(null);
  const [resolvingDeps, setResolvingDeps] = useState(false);
  const [validating, setValidating] = useState(false);

  // Result state
  const [building, setBuilding] = useState(false);
  const [builtBlueprint, setBuiltBlueprint] = useState<Blueprint | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const extractIds = (items: any[] | undefined): string[] => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item) => (typeof item === 'string' ? item : item.id)).filter(Boolean);
  };

  const applyTemplate = (tpl: Template, archList: Architecture[]) => {
    setSelectedPreloadTplId(tpl.id);
    setSelectedPreloadBpId(undefined);
    setBlueprintName(tpl.name);
    setBlueprintDesc(tpl.description || '');

    const tplArch = tpl.architecture_id || (tpl as any).architecture?.id || (tpl as any).architecture;
    if (tplArch) {
      setSelectedArchId(typeof tplArch === 'string' ? tplArch : tplArch.id);
    } else if (archList.length > 0) {
      setSelectedArchId(archList[0].id);
    }

    setSelectedTemplateIds([tpl.id]);
    setSelectedModuleIds(extractIds(tpl.modules));
    setSelectedCompIds(extractIds(tpl.components));
    setSelectedRuleIds(extractIds(tpl.rules));
    setSelectedSpecIds(extractIds(tpl.specifications));
  };

  const applyBlueprint = (bp: Blueprint) => {
    setSelectedPreloadBpId(bp.id);
    setSelectedPreloadTplId(undefined);
    setBlueprintName(bp.name);
    setBlueprintDesc(bp.description || '');
    setSelectedProjectId(bp.project_id || undefined);

    const bpArch = bp.architecture_id || (bp as any).architecture?.id || (bp as any).architecture;
    if (bpArch) {
      setSelectedArchId(typeof bpArch === 'string' ? bpArch : bpArch.id);
    }

    setSelectedModuleIds(extractIds(bp.modules));
    setSelectedCompIds(extractIds(bp.components));
    setSelectedTemplateIds(extractIds(bp.templates));
    setSelectedRuleIds(extractIds(bp.rules));
    setSelectedSpecIds(extractIds(bp.specifications));
  };

  const applyArchitecture = (
    arch: Architecture,
    modData?: Module[]
  ) => {
    setSelectedArchId(arch.id);
    setSelectedPreloadTplId(undefined);
    setSelectedPreloadBpId(undefined);
    setBlueprintName(`Blueprint - ${arch.name}`);
    setBlueprintDesc(arch.description || '');

    const archModules = extractIds(arch.recommended_modules || arch.modules);
    if (archModules.length > 0) {
      setSelectedModuleIds(archModules);
    } else {
      setSelectedModuleIds([]);
    }

    const archComponents = extractIds(arch.components);
    if (archComponents.length > 0) {
      setSelectedCompIds(archComponents);
    } else if (modData && archModules.length > 0) {
      const relatedComps: string[] = [];
      archModules.forEach((mId) => {
        const mod = modData.find((m) => m.id === mId);
        if (mod && mod.components) {
          relatedComps.push(...extractIds(mod.components));
        }
      });
      if (relatedComps.length > 0) {
        setSelectedCompIds(Array.from(new Set(relatedComps)));
      } else {
        setSelectedCompIds([]);
      }
    } else {
      setSelectedCompIds([]);
    }

    const archRules = extractIds(arch.rules);
    if (archRules.length > 0) {
      setSelectedRuleIds(archRules);
    } else {
      setSelectedRuleIds([]);
    }

    const archSpecs = extractIds(arch.specifications);
    if (archSpecs.length > 0) {
      setSelectedSpecIds(archSpecs);
    } else {
      setSelectedSpecIds([]);
    }
  };

  const resetToBlank = (archList: Architecture[]) => {
    setSelectedPreloadTplId(undefined);
    setSelectedPreloadBpId(undefined);
    setSelectedModuleIds([]);
    setSelectedCompIds([]);
    setSelectedTemplateIds([]);
    setSelectedRuleIds([]);
    setSelectedSpecIds([]);
    setBlueprintName('');
    setBlueprintDesc('');
    setSelectedProjectId(undefined);
    if (archList.length > 0) {
      setSelectedArchId(archList[0].id);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [archList, modData, compData, tplData, rList, specData, projData, bpList] = await Promise.all([
          catalogService.getArchitectures(),
          catalogService.getModules(),
          catalogService.getComponents(),
          catalogService.getTemplates(),
          catalogService.getRules(),
          catalogService.getSpecifications(),
          projectsService.getProjects(),
          blueprintsService.getBlueprints(),
        ]);
        setArchitectures(archList);
        setModules(modData);
        setComponents(compData);
        setTemplates(tplData);
        setRules(rList);
        setSpecifications(specData || []);
        setProjects(projData);
        setAllBlueprints(bpList || []);

        // Check query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const qTemplateId = urlParams.get('templateId');
        const qBlueprintId = urlParams.get('blueprintId');
        const qArchId = urlParams.get('architectureId');

        if (qTemplateId) {
          const tpl = tplData.find((t) => t.id === qTemplateId);
          if (tpl) {
            applyTemplate(tpl, archList);
            message.success(`Template canônico '${tpl.name}' carregado no Blueprint Studio com suas opções e regras!`);
            return;
          }
        }

        if (qBlueprintId) {
          const bp = (bpList || []).find((b) => b.id === qBlueprintId);
          if (bp) {
            applyBlueprint(bp);
            message.success(`Blueprint '${bp.name}' carregado no Blueprint Studio!`);
            return;
          }
        }

        if (qArchId) {
          const arch = archList.find((a) => a.id === qArchId);
          if (arch) {
            applyArchitecture(arch, modData);
            message.success(`Arquitetura '${arch.name}' carregada no Blueprint Studio com seus módulos e regras recomendadas!`);
            return;
          }
        }

        // Por padrão: carregar o workshop sem nenhuma caixa selecionada
        resetToBlank(archList);
      } catch (err: any) {
        message.error(`Falha ao carregar dados do workshop: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Listen for navigation changes with query parameters while in the same component
  useEffect(() => {
    const handleUrlChange = () => {
      if (architectures.length === 0) return;
      const urlParams = new URLSearchParams(window.location.search);
      const qTemplateId = urlParams.get('templateId');
      const qBlueprintId = urlParams.get('blueprintId');
      const qArchId = urlParams.get('architectureId');

      if (qTemplateId && qTemplateId !== selectedPreloadTplId) {
        const tpl = templates.find((t) => t.id === qTemplateId);
        if (tpl) {
          applyTemplate(tpl, architectures);
          message.success(`Template '${tpl.name}' carregado no Blueprint Studio!`);
        }
      } else if (qBlueprintId && qBlueprintId !== selectedPreloadBpId) {
        const bp = allBlueprints.find((b) => b.id === qBlueprintId);
        if (bp) {
          applyBlueprint(bp);
          message.success(`Blueprint '${bp.name}' carregado no Blueprint Studio!`);
        }
      } else if (qArchId && qArchId !== selectedArchId) {
        const arch = architectures.find((a) => a.id === qArchId);
        if (arch) {
          applyArchitecture(arch, modules);
          message.success(`Arquitetura '${arch.name}' carregada no Blueprint Studio!`);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('routechange' as any, handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('routechange' as any, handleUrlChange);
    };
  }, [templates, allBlueprints, architectures, modules, selectedPreloadTplId, selectedPreloadBpId, selectedArchId]);

  // Run live validation whenever selection changes
  useEffect(() => {
    if (loading) return;
    const runValidation = async () => {
      setValidating(true);
      try {
        const result = await blueprintsService.validateConfig({
          architecture_id: selectedArchId,
          module_ids: selectedModuleIds,
          component_ids: selectedCompIds,
          template_ids: selectedTemplateIds,
          rule_ids: selectedRuleIds,
          specification_ids: selectedSpecIds,
        });
        setValidationResult(result);
      } catch {
        // ignore
      } finally {
        setValidating(false);
      }
    };

    const timer = setTimeout(runValidation, 300);
    return () => clearTimeout(timer);
  }, [
    selectedArchId,
    selectedModuleIds,
    selectedCompIds,
    selectedTemplateIds,
    selectedRuleIds,
    selectedSpecIds,
    loading,
  ]);

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
      message.success(`Arquitetura atualizada para ${payload.architecture_id}.`);
    }
  };

  const handlePreloadTemplate = (tplId: string | undefined) => {
    if (!tplId) {
      resetToBlank(architectures);
      message.info('Workshop reiniciado para composição em branco.');
      return;
    }

    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;

    applyTemplate(tpl, architectures);
    message.success(`Template '${tpl.name}' carregado no Workshop! Modifique os módulos e regras necessários.`);
  };

  const handlePreloadBlueprint = (bpId: string | undefined) => {
    if (!bpId) {
      resetToBlank(architectures);
      message.info('Workshop reiniciado para composição em branco.');
      return;
    }

    const bp = allBlueprints.find((b) => b.id === bpId);
    if (!bp) return;

    applyBlueprint(bp);
    message.success(`Blueprint '${bp.name}' pré-carregado no Workshop! Modifique os módulos e regras necessários.`);
  };

  const handleBuild = async () => {
    setAttemptedSubmit(true);
    if (!blueprintName.trim()) {
      message.error('O campo "Nome do Blueprint" é obrigatório.');
      return;
    }
    if (!blueprintDesc.trim()) {
      message.error('O campo "Descrição & Propósito" é obrigatório.');
      return;
    }
    setBuilding(true);
    try {
      const res = await blueprintsService.buildBlueprint({
        name: blueprintName.trim(),
        description: blueprintDesc.trim(),
        architecture_id: selectedArchId,
        module_ids: selectedModuleIds,
        component_ids: selectedCompIds,
        template_ids: selectedTemplateIds,
        project_id: selectedProjectId,
      });
      setBuiltBlueprint(res);
      setResultModalOpen(true);
      message.success('Blueprint construído, validado e salvo com sucesso!');
    } catch (err: any) {
      message.error(`Erro ao construir Blueprint: ${err.message}`);
    } finally {
      setBuilding(false);
    }
  };

  const handlePublishCurrent = async () => {
    if (!builtBlueprint) return;
    try {
      const pub = await blueprintsService.publishBlueprint(builtBlueprint.id);
      setBuiltBlueprint(pub);
      message.success('Blueprint publicado com sucesso!');
    } catch (err: any) {
      message.error(`Erro ao publicar: ${err.message}`);
    }
  };

  if (loading) return <LoadingState tip="Inicializando estúdio do Blueprint Workshop..." />;

  const currentArch = architectures.find((a) => a.id === selectedArchId);

  // Generate live preview JSON
  const liveBlueprintPreview = {
    blueprint: {
      name: blueprintName || 'Novo Blueprint',
      version: '1.0.0',
      status: validationResult?.can_publish ? 'READY' : 'DRAFT',
      architecture: {
        id: selectedArchId,
        name: currentArch?.name || selectedArchId,
      },
      templates: selectedTemplateIds,
      modules: selectedModuleIds,
      components: selectedCompIds,
      rules: selectedRuleIds,
      specifications: selectedSpecIds,
      validation: {
        status: validationResult?.status || 'validating',
        can_publish: validationResult?.can_publish || false,
        critical_count: validationResult?.critical_count || 0,
        error_count: validationResult?.error_count || 0,
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Blueprint Studio & Composition Engine"
        subtitle="Compositor visual de arquitetura, módulos e componentes Copan com resolução determinística de dependências e regras"
        breadcrumbs={[
          { title: 'Engineering Workspace' },
          { title: 'Workspace' },
          { title: 'Blueprint Studio' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              icon={<ThunderboltOutlined />}
              onClick={handleResolveAllDependencies}
              loading={resolvingDeps}
            >
              Resolver Todas as Dependências
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: '#F56738' }}
              icon={<RocketOutlined />}
              loading={building}
              onClick={handleBuild}
            >
              Construir & Validar Blueprint
            </Button>
          </div>
        }
      />

      {/* Top Status & Health Bar */}
      <Card className="border border-loft-border shadow-2xs rounded-xl bg-white p-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-loft-muted uppercase">Diagnóstico do Blueprint:</span>
            {validating ? (
              <Tag color="processing">Validando...</Tag>
            ) : validationResult?.can_publish ? (
              <Tag color="success" className="font-bold text-xs px-2.5 py-0.5 flex items-center gap-1">
                <CheckCircleOutlined /> PRONTO PARA PUBLICAÇÃO (0 ERROS)
              </Tag>
            ) : (
              <Tag color="error" className="font-bold text-xs px-2.5 py-0.5 flex items-center gap-1">
                <CloseCircleOutlined /> REQUER ATENÇÃO ({validationResult?.critical_count || 0} CRÍTICOS, {validationResult?.error_count || 0} DEPENDÊNCIAS)
              </Tag>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-loft-muted">
            <span><b>{selectedModuleIds.length}</b> Módulos</span>
            <span><b>{selectedCompIds.length}</b> Componentes</span>
            <span><b>{selectedRuleIds.length}</b> Regras Mandatórias</span>
            <span><b>{selectedSpecIds.length}</b> SDDs</span>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left Column: Form Configuration */}
        <Col xs={24} lg={14}>
          {/* Pre-load Template / Blueprint Selector */}
          <Card className="mb-6 shadow-2xs border-loft-orange/30 bg-linear-to-r from-[#FFF8F5] via-white to-white">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThunderboltOutlined className="text-loft-orange text-base" />
                  <span className="font-bold text-loft-dark text-sm">
                    Pré-carregar Composição (Templates Canônicos ou Blueprints)
                  </span>
                </div>
                {(selectedPreloadTplId || selectedPreloadBpId) ? (
                  <Tag color="orange" className="font-medium text-[11px]">Personalizado</Tag>
                ) : (
                  <Tag color="default" className="font-medium text-[11px]">Composição em Branco</Tag>
                )}
              </div>
              <p className="text-xs text-loft-muted leading-relaxed">
                Acelere o desenvolvimento pré-carregando um <b>Template Canônico da Loft</b> ou um <b>Blueprint Existente</b>. O Workshop preencherá automaticamente a arquitetura, módulos, componentes Copan e Golden Rules associadas para você editar somente o que for necessário.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-loft-dark uppercase mb-1 flex items-center justify-between">
                    <span>1. Template Canônico de Produção</span>
                    <span className="text-loft-orange font-normal text-[10px] lowercase">Recomendado</span>
                  </label>
                  <Select
                    showSearch
                    allowClear
                    placeholder="Selecione um Template Loft..."
                    className="w-full"
                    value={selectedPreloadTplId}
                    onChange={handlePreloadTemplate}
                    filterOption={(input, option) =>
                      ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={templates.map((tpl) => ({
                      value: tpl.id,
                      label: `${tpl.name} • ${tpl.category}`,
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-loft-dark uppercase mb-1">
                    2. Clonar de Blueprint Existente
                  </label>
                  <Select
                    showSearch
                    allowClear
                    placeholder="Selecione um Blueprint existente..."
                    className="w-full"
                    value={selectedPreloadBpId}
                    onChange={handlePreloadBlueprint}
                    filterOption={(input, option) =>
                      ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={allBlueprints.map((bp) => ({
                      value: bp.id,
                      label: `${bp.name} (v${bp.version || '1.0.0'}) • ${bp.architecture_id || 'Arquitetura Base'}`,
                    }))}
                  />
                </div>
              </div>

              {(selectedPreloadTplId || selectedPreloadBpId) && (
                <div className="mt-2 p-2.5 bg-[#FFF8F5] border border-loft-orange/20 rounded-lg flex items-center justify-between">
                  <div className="text-xs text-loft-dark">
                    <span className="font-bold text-loft-orange">
                      {selectedPreloadTplId ? '✨ Template Ativo: ' : '📋 Blueprint Ativo: '}
                    </span>
                    <span className="font-medium">
                      {selectedPreloadTplId
                        ? templates.find((t) => t.id === selectedPreloadTplId)?.name
                        : allBlueprints.find((b) => b.id === selectedPreloadBpId)?.name}
                    </span>
                    <span className="text-loft-muted ml-2 text-[11px]">
                      ({selectedModuleIds.length} módulos, {selectedCompIds.length} componentes, {selectedRuleIds.length} regras carregadas)
                    </span>
                  </div>
                  <Button
                    size="small"
                    onClick={() => {
                      resetToBlank(architectures);
                      message.info('Workshop reiniciado para composição em branco.');
                    }}
                  >
                    Limpar / Em Branco
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Step 1: Identification */}
          <Card title="1. Identificação do Blueprint" className="mb-6 shadow-2xs border-loft-border">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-loft-dark uppercase mb-1">
                  Nome do Blueprint <span className="text-[#E12D39] font-bold">*</span>
                </label>
                <Input
                  value={blueprintName}
                  onChange={(e) => setBlueprintName(e.target.value)}
                  placeholder="Ex: Portal de Renegociação Imobiliária"
                  status={attemptedSubmit && !blueprintName.trim() ? 'error' : undefined}
                />
                {attemptedSubmit && !blueprintName.trim() && (
                  <div className="text-[11px] text-[#E12D39] mt-1 font-semibold flex items-center gap-1">
                    <WarningOutlined /> O nome do Blueprint é obrigatório.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-loft-dark uppercase mb-1">
                  Descrição & Propósito <span className="text-[#E12D39] font-bold">*</span>
                </label>
                <Input.TextArea
                  rows={2}
                  value={blueprintDesc}
                  onChange={(e) => setBlueprintDesc(e.target.value)}
                  placeholder="Descreva o propósito da aplicação, escopo do projeto e objetivos..."
                  status={attemptedSubmit && !blueprintDesc.trim() ? 'error' : undefined}
                />
                {attemptedSubmit && !blueprintDesc.trim() && (
                  <div className="text-[11px] text-[#E12D39] mt-1 font-semibold flex items-center gap-1">
                    <WarningOutlined /> A descrição do Blueprint é obrigatória.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-loft-muted uppercase mb-1">
                  Vincular a um Projeto Existente (Opcional)
                </label>
                <Select
                  allowClear
                  placeholder="Selecione um projeto cadastrado..."
                  className="w-full"
                  value={selectedProjectId}
                  onChange={setSelectedProjectId}
                  options={projects.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${p.domain})`,
                  }))}
                />
              </div>
            </div>
          </Card>

          {/* Step 2: Architecture Selection */}
          <Card title="2. Arquitetura Alvo" className="mb-6 shadow-2xs border-loft-border">
            <div className="space-y-3">
              <Select
                value={selectedArchId}
                onChange={setSelectedArchId}
                className="w-full"
                options={architectures.map((arch) => ({
                  value: arch.id,
                  label: `${arch.name} — (${arch.category})`,
                }))}
              />
              {currentArch && (
                <div className="p-3 bg-[#FAFBFD] border border-loft-border rounded-lg text-xs text-loft-muted">
                  <p className="text-loft-dark font-medium mb-2">{currentArch.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentArch.layers.map((layer) => (
                      <Tag key={layer} color="blue">
                        Camada: {layer}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Step 3: Template Base */}
          <WorkshopEntitySelector
            stepNumber={3}
            title="Templates / Arquétipos Base"
            subtitle="Estrutura e scaffolding inicial da aplicação"
            entityType="template"
            items={templates}
            selectedIds={selectedTemplateIds}
            onChange={setSelectedTemplateIds}
            accentColor="#0066CC"
            pageSize={10}
            onInspect={(type, id) => openInspector360(type as any, id)}
          />

          {/* Step 4: Modules */}
          <WorkshopEntitySelector
            stepNumber={4}
            title="Módulos de Domínio e Negócio"
            subtitle="Módulos funcionais de backend, regras de domínio e APIs"
            entityType="module"
            items={modules}
            selectedIds={selectedModuleIds}
            onChange={setSelectedModuleIds}
            accentColor="#0284C7"
            pageSize={10}
            onInspect={(type, id) => openInspector360(type as any, id)}
          />

          {/* Step 5: UI Components */}
          <WorkshopEntitySelector
            stepNumber={5}
            title="Componentes Visuais Copan"
            subtitle="Design System, blocos visuais e componentes desacoplados de interface"
            entityType="component"
            items={components}
            selectedIds={selectedCompIds}
            onChange={setSelectedCompIds}
            accentColor="#F56738"
            pageSize={10}
            onInspect={(type, id) => openInspector360(type as any, id)}
          />

          {/* Step 6: Golden Rules */}
          <WorkshopEntitySelector
            stepNumber={6}
            title="Golden Rules Mandatórias"
            subtitle="Diretrizes arquiteturais, linters e padrões de código obrigatórios"
            entityType="rule"
            items={rules}
            selectedIds={selectedRuleIds}
            onChange={setSelectedRuleIds}
            accentColor="#805AD5"
            pageSize={10}
            onInspect={(type, id) => openInspector360(type as any, id)}
          />

          {/* Step 7: Specifications (SDD) */}
          <WorkshopEntitySelector
            stepNumber={7}
            title="Especificações Técnicas (SDD)"
            subtitle="Software Design Documents de referência para o agente de IA"
            entityType="specification"
            items={specifications}
            selectedIds={selectedSpecIds}
            onChange={setSelectedSpecIds}
            accentColor="#D97706"
            pageSize={10}
            onInspect={(type, id) => openInspector360(type as any, id)}
          />
        </Col>

        {/* Right Column: Diagnostics, Live Resolution & Graph Preview */}
        <Col xs={24} lg={10}>
          <div className="sticky top-20 space-y-6">
            {/* Live Diagnostics & Actionable Fixes Panel */}
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-loft-dark">Diagnósticos de Validação</span>
                  {validationResult && (
                    <Badge
                      count={validationResult.diagnostics.length}
                      style={{ backgroundColor: validationResult.can_publish ? '#20A483' : '#E12D39' }}
                    />
                  )}
                </div>
              }
              className="shadow-xs border-loft-border"
            >
              <div className="space-y-3">
                {validationResult?.diagnostics && validationResult.diagnostics.length > 0 ? (
                  validationResult.diagnostics.map((diag, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs ${
                        diag.severity === 'CRITICAL'
                          ? 'bg-[#FFF5F5] border-[#FEB2B2] text-[#9B2C2C]'
                          : diag.severity === 'ERROR'
                          ? 'bg-[#FFF5F5] border-[#FED7D7] text-[#C53030]'
                          : diag.severity === 'WARNING'
                          ? 'bg-[#FFFAF0] border-[#FEEBC8] text-[#C05621]'
                          : 'bg-[#EBF8FF] border-[#BEE3F8] text-loft-info'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          {diag.severity === 'CRITICAL' && <CloseCircleOutlined className="text-[#E12D39]" />}
                          {diag.severity === 'ERROR' && <CloseCircleOutlined className="text-[#E12D39]" />}
                          {diag.severity === 'WARNING' && <WarningOutlined className="text-[#D69E2E]" />}
                          {diag.severity === 'INFO' && <InfoCircleOutlined className="text-[#3182CE]" />}
                          <span>[{diag.severity}] {diag.code}</span>
                        </div>
                        <Tag className="text-[10px] m-0 font-mono">{diag.category}</Tag>
                      </div>

                      <p className="mt-1 leading-relaxed">{diag.message}</p>

                      {diag.recommended_action && (
                        <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-between">
                          <span className="text-[11px] font-medium opacity-90">
                            {diag.recommended_action.description || 'Ação sugerida:'}
                          </span>
                          <Button
                            size="small"
                            type="primary"
                            icon={<PlusOutlined />}
                            style={{ backgroundColor: '#F56738', fontSize: '11px', height: '24px' }}
                            onClick={() => handleApplyDiagnosticAction(diag)}
                          >
                            {diag.recommended_action.label}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-[#F0FFF4] border border-[#C6F6D5] rounded-lg text-xs text-[#22543D] text-center">
                    <CheckCircleOutlined className="text-lg mb-1 block" />
                    <b>Nenhuma violação encontrada!</b>
                    <p className="mt-0.5 text-[11px] opacity-80">
                      O blueprint atende a todos os critérios de consistência de dependências, arquitetura e Golden Rules.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Composition Tree / JSON Inspector Preview */}
            <Card
              title="Composição & Contrato JSON"
              className="shadow-xs border-loft-border"
              extra={
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(liveBlueprintPreview, null, 2));
                    message.success('JSON copiado!');
                  }}
                >
                  Copiar JSON
                </Button>
              }
            >
              <pre className="p-3 bg-loft-dark text-loft-success rounded-lg text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed">
                {JSON.stringify(liveBlueprintPreview, null, 2)}
              </pre>

              <div className="pt-4 mt-4 border-t border-loft-border">
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<RocketOutlined />}
                  style={{ backgroundColor: '#F56738' }}
                  loading={building}
                  onClick={handleBuild}
                >
                  Construir Blueprint
                </Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Built Blueprint Result Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-loft-success text-xl" />
            <span>Blueprint Construído & Validado!</span>
          </div>
        }
        open={resultModalOpen}
        onCancel={() => setResultModalOpen(false)}
        width={850}
        footer={[
          <Button key="close" onClick={() => setResultModalOpen(false)}>
            Fechar
          </Button>,
          <Button
            key="download"
            icon={<DownloadOutlined />}
            href={`/api/v1/blueprints/${builtBlueprint?.id}/download`}
            target="_blank"
          >
            Download JSON
          </Button>,
          <Button
            key="publish"
            type="primary"
            style={{ backgroundColor: '#20A483' }}
            disabled={!builtBlueprint?.validation?.can_publish}
            onClick={handlePublishCurrent}
          >
            Publicar Blueprint
          </Button>,
          <Button
            key="view"
            type="primary"
            style={{ backgroundColor: '#F56738' }}
            onClick={() => {
              setResultModalOpen(false);
              setActiveView('blueprints');
            }}
          >
            Ver em Blueprints
          </Button>,
        ]}
      >
        {builtBlueprint && (
          <div className="space-y-4 pt-2">
            <Alert
              message={`Blueprint ID: ${builtBlueprint.id}`}
              description={`Status: ${builtBlueprint.status} — Planta baixa técnica determinística gerada com sucesso.`}
              type={builtBlueprint.validation?.can_publish ? 'success' : 'warning'}
              showIcon
            />

            <Tabs
              items={[
                {
                  key: 'overview',
                  label: 'Resumo da Composição',
                  children: (
                    <div className="space-y-3 text-xs">
                      <div><b>Nome:</b> {builtBlueprint.name}</div>
                      <div><b>Descrição:</b> {builtBlueprint.description}</div>
                      <div><b>Arquitetura:</b> <Tag color="blue">{builtBlueprint.architecture_name || builtBlueprint.architecture_id}</Tag></div>
                      <div><b>Módulos ({builtBlueprint.modules.length}):</b> {builtBlueprint.modules.join(', ')}</div>
                      <div><b>Componentes Copan ({builtBlueprint.components.length}):</b> {builtBlueprint.components.join(', ')}</div>
                      <div><b>Golden Rules ({builtBlueprint.rules.length}):</b> {builtBlueprint.rules.join(', ')}</div>
                    </div>
                  ),
                },
                {
                  key: 'contract',
                  label: 'Contrato JSON Determinístico',
                  children: (
                    <pre className="p-3 bg-loft-dark text-loft-success rounded-lg text-xs font-mono overflow-x-auto max-h-64">
                      {JSON.stringify(builtBlueprint.raw_blueprint_json || builtBlueprint, null, 2)}
                    </pre>
                  ),
                },
                {
                  key: 'ai-prompt',
                  label: 'Prompt para Agente IA',
                  children: (
                    <div className="space-y-2">
                      <textarea
                        readOnly
                        rows={6}
                        className="w-full p-3 font-mono text-xs bg-[#FAFBFD] border border-loft-border rounded-lg"
                        value={`Você é o agente de engenharia da Loft. Construa a aplicação "${builtBlueprint.name}" com arquitetura "${builtBlueprint.architecture_id}".\n\nMódulos:\n- ${builtBlueprint.modules.join('\n- ')}\n\nComponentes Copan:\n- ${builtBlueprint.components.join('\n- ')}\n\nRegras Mandatórias:\n- ${builtBlueprint.rules.join('\n- ')}`}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
