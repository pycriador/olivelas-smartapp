import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Tag,
  Button,
  Spin,
  Alert,
  Descriptions,
  List,
  Card,
  Space,
  Select,
  message,
  Popconfirm,
} from 'antd';
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  LinkOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  StopOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useUIStore } from '@/stores/uiStore';
import { catalogService } from '@/services/catalog.service';
import { projectsService } from '@/services/projects.service';
import { blueprintsService } from '@/services/blueprints.service';
import { ComponentVisualPreview } from '@/features/catalog/components/ComponentVisualPreview';
import type { Entity360Response } from '@/types/domain.types';

export const Entity360Drawer: React.FC = () => {
  const {
    inspectorDrawerOpen,
    activeEntity360,
    closeInspector360,
    openInspector360,
  } = useUIStore();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Entity360Response | null>(null);
  const [activeTab, setActiveTab] = useState('what_is_it');

  useEffect(() => {
    if (!inspectorDrawerOpen || !activeEntity360) {
      setData(null);
      return;
    }

    const fetch360 = async () => {
      setLoading(true);
      try {
        const res = await catalogService.getEntity360(
          activeEntity360.type,
          activeEntity360.id
        );
        setData(res);
      } catch (err: any) {
        message.error(`Erro ao carregar dados 360°: ${err.message || 'Falha na requisição'}`);
      } finally {
        setLoading(false);
      }
    };

    fetch360();
  }, [inspectorDrawerOpen, activeEntity360]);

  const handlePublish = async () => {
    if (!activeEntity360) return;
    try {
      if (activeEntity360.type === 'component') {
        await catalogService.publishComponent(activeEntity360.id);
      } else if (activeEntity360.type === 'module') {
        await catalogService.publishModule(activeEntity360.id);
      }
      message.success('Ativo publicado com sucesso!');
      // reload
      const res = await catalogService.getEntity360(activeEntity360.type, activeEntity360.id);
      setData(res);
    } catch (err: any) {
      message.error(`Erro ao publicar: ${err.message}`);
    }
  };

  const handleDeprecate = async () => {
    if (!activeEntity360) return;
    try {
      if (activeEntity360.type === 'component') {
        await catalogService.deprecateComponent(activeEntity360.id);
      } else if (activeEntity360.type === 'module') {
        await catalogService.deprecateModule(activeEntity360.id);
      }
      message.warning('Ativo marcado como descontinuado!');
      // reload
      const res = await catalogService.getEntity360(activeEntity360.type, activeEntity360.id);
      setData(res);
    } catch (err: any) {
      message.error(`Erro ao descontinuar: ${err.message}`);
    }
  };

  const [deleting, setDeleting] = useState(false);

  const handleDeleteEntity = async () => {
    if (!activeEntity360) return;
    setDeleting(true);
    try {
      const { type, id } = activeEntity360;
      if (type === 'component') await catalogService.deleteComponent(id);
      else if (type === 'module') await catalogService.deleteModule(id);
      else if (type === 'template') await catalogService.deleteTemplate(id);
      else if (type === 'rule') await catalogService.deleteRule(id);
      else if (type === 'specification') await catalogService.deleteSpecification(id);
      else if (type === 'architecture') await catalogService.deleteArchitecture(id);
      else if (type === 'blueprint') await blueprintsService.deleteBlueprint(id);
      else if (type === 'project') await projectsService.deleteProject(id);

      message.success(`Ativo '${id}' excluído com sucesso do banco de dados!`);
      closeInspector360();
      window.dispatchEvent(new CustomEvent('catalog-entity-deleted', { detail: { type, id } }));
    } catch (err: any) {
      message.error(`Erro ao excluir ativo: ${err.message || 'Falha na requisição'}`);
    } finally {
      setDeleting(false);
    }
  };

  if (!inspectorDrawerOpen) return null;

  const titleHeader = (
    <div className="flex items-center justify-between pr-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-base text-loft-dark">
          {data?.what_is_it?.name || activeEntity360?.id}
        </span>
        <Tag color="orange">{activeEntity360?.type.toUpperCase()}</Tag>
        {data?.what_is_it?.status && (
          <Tag color={data.what_is_it.status === 'Published' ? 'green' : 'gold'}>
            {data.what_is_it.status}
          </Tag>
        )}
      </div>
      <span className="text-xs font-mono text-loft-muted">
        v{data?.what_is_it?.version || '1.0.0'}
      </span>
    </div>
  );

  const sections = [
    {
      key: 'what_is_it',
      label: 'O que é?',
      icon: <InfoCircleOutlined className="text-[#0066CC]" />,
    },
    {
      key: 'what_is_it_for',
      label: 'Para que serve?',
      icon: <QuestionCircleOutlined className="text-loft-success" />,
    },
    {
      key: 'dependencies',
      label: 'Do que depende?',
      icon: <LinkOutlined className="text-[#805AD5]" />,
    },
    {
      key: 'where_used',
      label: 'Onde é utilizado?',
      icon: <ApartmentOutlined className="text-loft-orange" />,
    },
    {
      key: 'rules',
      label: `Regras Associadas (${(data?.associated_rules || []).length})`,
      icon: <SafetyCertificateOutlined className="text-[#E12D39]" />,
    },
    {
      key: 'specs',
      label: `Especificações SDD (${(data?.associated_specs || []).length})`,
      icon: <FileTextOutlined className="text-[#D97706]" />,
    },
    {
      key: 'lifecycle',
      label: 'Ciclo de Vida',
      icon: <HistoryOutlined className="text-loft-muted" />,
    },
  ];

  const currentSectionIndex = sections.findIndex((s) => s.key === activeTab);

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setActiveTab(sections[currentSectionIndex - 1].key);
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setActiveTab(sections[currentSectionIndex + 1].key);
    }
  };

  return (
    <Drawer
      title={titleHeader}
      placement="right"
      width={740}
      onClose={closeInspector360}
      open={inspectorDrawerOpen}
      destroyOnHidden
      styles={{ body: { padding: '16px 24px' } }}
    >
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Spin size="large" />
          <span className="text-xs text-loft-muted font-medium">Calculando grafo de conhecimento 360°...</span>
        </div>
      )}

      {!loading && data && (
        <div className="flex flex-col h-full space-y-4">
          {/* Dropdown Navigation Menu */}
          <div className="flex items-center gap-2 bg-[#FAFBFD] p-2.5 rounded-lg border border-loft-border">
            <div className="flex-1">
              <Select
                value={activeTab}
                onChange={setActiveTab}
                className="w-full"
                size="middle"
                suffixIcon={<DownOutlined className="text-loft-orange" />}
                options={sections.map((sec) => ({
                  value: sec.key,
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{sec.icon}</span>
                      <span className="font-semibold text-xs text-loft-dark">{sec.label}</span>
                    </div>
                  ),
                }))}
              />
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1">
              <Button
                size="middle"
                icon={<LeftOutlined />}
                onClick={handlePrev}
                disabled={currentSectionIndex <= 0}
                title="Seção anterior"
              />
              <span className="text-xs font-semibold text-loft-muted px-1 font-mono">
                {currentSectionIndex + 1} / {sections.length}
              </span>
              <Button
                size="middle"
                icon={<RightOutlined />}
                onClick={handleNext}
                disabled={currentSectionIndex >= sections.length - 1}
                title="Próxima seção"
              />
            </div>
          </div>

          {/* Section Content Area */}
          <div className="flex-1 overflow-y-auto pr-1">
            {activeTab === 'what_is_it' && (
              <div className="space-y-4 pt-1">
                <Descriptions bordered size="small" column={1} className="bg-white rounded-lg overflow-hidden">
                  <Descriptions.Item label="Identificador Único">
                    <code className="font-mono text-xs bg-loft-bg px-2 py-0.5 rounded-sm font-bold text-[#0066CC]">
                      {data.what_is_it.id}
                    </code>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nome Canônico">
                    <b className="text-sm text-loft-dark">{data.what_is_it.name}</b>
                  </Descriptions.Item>
                  <Descriptions.Item label="Categoria">
                    <Tag color="blue">{data.what_is_it.category}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status de Ciclo de Vida">
                    <Tag color={data.what_is_it.status === 'Published' ? 'success' : 'warning'}>
                      {data.what_is_it.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Versão SemVer">
                    <span className="font-mono text-xs font-semibold">
                      v{data.what_is_it.version}
                    </span>
                  </Descriptions.Item>
                </Descriptions>

                <div>
                  <div className="text-xs font-semibold text-loft-muted mb-2 uppercase tracking-wide">
                    Tags & Metadados
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(data.what_is_it?.tags || []).length === 0 ? (
                      <span className="text-xs text-loft-muted italic">Sem tags adicionais.</span>
                    ) : (
                      (data.what_is_it?.tags || []).map((t) => (
                        <Tag key={t} color="default" className="text-xs font-medium">
                          #{t}
                        </Tag>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'what_is_it_for' && (
              <div className="space-y-4 pt-1">
                <div className="p-4 bg-[#FAFBFD] border border-loft-border rounded-lg shadow-2xs">
                  <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-1.5">
                    Descrição Funcional & Propósito
                  </div>
                  <p className="text-sm text-loft-dark leading-relaxed">
                    {data.what_is_it_for?.description || 'Nenhuma descrição detalhada informada.'}
                  </p>
                </div>

                {data.what_is_it_for?.characteristics && data.what_is_it_for.characteristics.length > 0 && (
                  <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                    <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                      Principais Características
                    </div>
                    <ul className="list-disc list-inside text-sm text-[#334E68] space-y-1.5">
                      {data.what_is_it_for.characteristics.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Live Visual Showcase / Cara do Elemento + Code + Contract */}
                <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                  <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-3">
                    Demonstração Visual & Execução do Ativo
                  </div>
                  <ComponentVisualPreview
                    component={{
                      id: activeEntity360?.id || data.what_is_it?.id || '',
                      name: data.what_is_it?.name || activeEntity360?.id || '',
                      category: data.what_is_it?.category,
                      type:
                        activeEntity360?.type === 'component'
                          ? data.what_is_it?.tags?.includes('frontend') || (data.what_is_it?.category || '').includes('UI')
                            ? 'frontend'
                            : 'backend'
                          : activeEntity360?.type,
                      description: data.what_is_it_for?.description,
                      preview_code: data.what_is_it_for?.preview_code,
                      interface_spec:
                        typeof data.what_is_it_for?.contract === 'string'
                          ? data.what_is_it_for.contract
                          : data.what_is_it_for?.contract
                          ? JSON.stringify(data.what_is_it_for.contract, null, 2)
                          : '',
                      props_contract: data.what_is_it_for?.contract,
                      version: data.what_is_it?.version,
                      tags: data.what_is_it?.tags,
                    }}
                    defaultTab="preview"
                  />
                </div>
              </div>
            )}

            {activeTab === 'dependencies' && (
              <div className="space-y-4 pt-1">
                {Array.isArray(data.dependencies) ? (
                  <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                    <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                      Dependências & Blocos Vinculados ({data.dependencies.length})
                    </div>
                    {data.dependencies.length === 0 ? (
                      <div className="text-sm text-loft-muted italic">
                        Nenhuma dependência necessária (Building block base).
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {data.dependencies.map((dep: any, idx: number) => {
                          const isObj = typeof dep === 'object' && dep !== null;
                          const depName = isObj ? dep.name || dep.id : String(dep);
                          const depType = isObj ? dep.type : 'Dependency';
                          return (
                            <Tag key={idx} color="blue" className="px-2.5 py-1 text-xs">
                              <span className="text-[10px] uppercase font-bold text-loft-muted mr-1">[{depType}]</span>
                              {depName}
                            </Tag>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                      <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                        Dependências Internas do Sistema
                      </div>
                      {(data.dependencies?.internal_dependencies || []).length === 0 ? (
                        <div className="text-sm text-loft-muted italic">
                          Nenhuma dependência interna necessária (Building block base).
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(data.dependencies?.internal_dependencies || []).map((dep) => (
                            <Button
                              key={dep}
                              size="small"
                              icon={<LinkOutlined />}
                              onClick={() => openInspector360('component', dep)}
                            >
                              {dep}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                      <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                        Pacotes NPM / Bibliotecas de Terceiros
                      </div>
                      {(data.dependencies?.package_dependencies || []).length === 0 ? (
                        <div className="text-sm text-loft-muted italic">
                          Nenhum pacote externo requerido.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {(data.dependencies?.package_dependencies || []).map((pkg) => (
                            <Tag key={pkg} color="purple">
                              {pkg}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'where_used' && (
              <div className="space-y-4 pt-1">
                <Alert
                  message="Reverse Dependency Lookup"
                  description="Calculado deterministicamente varrendo todos os Módulos, Templates, Blueprints e Projetos que referenciam este elemento."
                  type="info"
                  showIcon
                  className="text-xs"
                />

                {Array.isArray(data.where_used) ? (
                  <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                    <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                      Elementos Vinculados ({data.where_used.length})
                    </div>
                    {data.where_used.length === 0 ? (
                      <div className="text-sm text-loft-muted italic">Nenhum uso reverso encontrado.</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {data.where_used.map((item: any, idx: number) => {
                          const isObj = typeof item === 'object' && item !== null;
                          const itemName = isObj ? item.name || item.id : String(item);
                          const itemType = isObj ? item.type || 'Entity' : 'Entity';
                          const rel = isObj && item.relationship ? ` (${item.relationship})` : '';
                          return (
                            <Tag key={idx} color="geekblue" className="px-2.5 py-1 text-xs">
                              <span className="text-[10px] uppercase font-bold text-[#334E68] mr-1">[{itemType}]</span>
                              {itemName}{rel}
                            </Tag>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                      <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                        Módulos que Utilizam ({(data.where_used?.modules || []).length})
                      </div>
                      {(data.where_used?.modules || []).length === 0 ? (
                        <div className="text-sm text-loft-muted italic">Nenhum módulo vinculado.</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(data.where_used?.modules || []).map((m) => (
                            <Button
                              key={m.id}
                              size="small"
                              onClick={() => openInspector360('module', m.id)}
                            >
                              📦 {m.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                      <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                        Templates de Aplicação ({(data.where_used?.templates || []).length})
                      </div>
                      {(data.where_used?.templates || []).length === 0 ? (
                        <div className="text-sm text-loft-muted italic">Nenhum template vinculado.</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(data.where_used?.templates || []).map((t) => (
                            <Tag key={t.id} color="cyan">
                              📋 {t.name}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                      <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                        Blueprints Ativos ({(data.where_used?.blueprints || []).length})
                      </div>
                      {(data.where_used?.blueprints || []).length === 0 ? (
                        <div className="text-sm text-loft-muted italic">Nenhum blueprint gerado.</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(data.where_used?.blueprints || []).map((b) => (
                            <Tag key={b.id} color="geekblue">
                              📐 {b.name}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                      <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                        Projetos em Produção ({(data.where_used?.projects || []).length})
                      </div>
                      {(data.where_used?.projects || []).length === 0 ? (
                        <div className="text-sm text-loft-muted italic">Nenhum projeto vinculado.</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(data.where_used?.projects || []).map((p) => (
                            <Tag key={p.id} color="magenta">
                              🚀 {p.name}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4 pt-1">
                {(data.associated_rules || []).length === 0 ? (
                  <div className="p-6 bg-[#FAFBFD] border border-loft-border rounded-lg text-center text-sm text-loft-muted italic">
                    Nenhuma regra específica associada. Segue diretrizes globais da Olivelas.
                  </div>
                ) : (
                  <List
                    dataSource={data.associated_rules || []}
                    renderItem={(rule: any) => (
                      <Card size="small" className="mb-3 border-loft-border shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-loft-dark">{rule.name}</span>
                          <Tag color={rule.severity === 'MANDATORY' || rule.priority === 'CRITICAL' ? 'error' : 'warning'}>
                            {rule.severity || rule.priority || 'REQUIRED'}
                          </Tag>
                        </div>
                        {rule.description && <p className="text-xs text-loft-muted mb-3">{rule.description}</p>}
                        {rule.good_example && (
                          <div className="mb-2">
                            <div className="text-[11px] font-semibold text-loft-success mb-1">
                              ✓ Correto (Copan Standard)
                            </div>
                            <pre className="p-2.5 bg-[#F2FBF8] text-loft-success border border-[#8CE0CC] rounded-sm text-[11px] font-mono overflow-x-auto">
                              {rule.good_example}
                            </pre>
                          </div>
                        )}
                        {rule.bad_example && (
                          <div>
                            <div className="text-[11px] font-semibold text-loft-error mb-1">
                              ✕ Incorreto (Anti-pattern)
                            </div>
                            <pre className="p-2.5 bg-[#FDF2F2] text-loft-error border border-[#F8B4B4] rounded-sm text-[11px] font-mono overflow-x-auto">
                              {rule.bad_example}
                            </pre>
                          </div>
                        )}
                      </Card>
                    )}
                  />
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3 pt-1">
                {(data.associated_specs || []).length === 0 ? (
                  <div className="p-6 bg-[#FAFBFD] border border-loft-border rounded-lg text-center text-sm text-loft-muted italic">
                    Nenhum SDD diretamente referenciado.
                  </div>
                ) : (
                  <List
                    dataSource={data.associated_specs || []}
                    renderItem={(spec: any) => (
                      <Card size="small" className="mb-2.5 border-loft-border shadow-2xs">
                        <div className="font-semibold text-sm text-loft-dark mb-1">
                          📄 {spec.title || spec.name}
                        </div>
                        <p className="text-xs text-loft-muted">{spec.summary || spec.description || spec.category}</p>
                      </Card>
                    )}
                  />
                )}
              </div>
            )}

            {activeTab === 'lifecycle' && (
              <div className="space-y-4 pt-1">
                <Descriptions bordered size="small" column={1} className="bg-white rounded-lg overflow-hidden">
                  <Descriptions.Item label="Versão Ativa">
                    <span className="font-mono font-bold">
                      v{data.version_lifecycle?.active_version || (data.version_lifecycle as any)?.version || data.version || '1.0.0'}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status Atual">
                    <Tag color={data.version_lifecycle?.status === 'Published' || data.version_lifecycle?.status === 'Ready' ? 'success' : 'warning'}>
                      {data.version_lifecycle?.status || data.status || 'Planning'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

                <div className="p-4 bg-white border border-loft-border rounded-lg shadow-2xs">
                  <div className="text-xs font-semibold text-loft-muted uppercase tracking-wide mb-2">
                    Ações de Transição de Ciclo de Vida
                  </div>
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={handlePublish}
                      disabled={data.version_lifecycle?.status === 'Published'}
                      style={{ backgroundColor: '#20A483' }}
                    >
                      Publicar Versão
                    </Button>
                    <Button
                      danger
                      icon={<StopOutlined />}
                      onClick={handleDeprecate}
                      disabled={data.version_lifecycle?.status === 'Deprecated'}
                    >
                      Descontinuar Ativo
                    </Button>
                  </Space>
                </div>

                <div className="p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-lg shadow-2xs">
                  <div className="text-xs font-bold text-loft-error uppercase tracking-wide mb-1">
                    Zona de Perigo • Exclusão Permanente
                  </div>
                  <p className="text-xs text-loft-muted mb-3">
                    Excluir este ativo removerá o registro permanentemente do banco de dados SQLite e registrará o evento na trilha de auditoria.
                  </p>
                  <Popconfirm
                    title="Excluir permanentemente do banco de dados?"
                    description={
                      <div className="max-w-[280px] text-xs text-loft-muted">
                        Tem certeza que deseja excluir <strong>{data?.what_is_it?.name || activeEntity360?.id}</strong>? Esta ação não pode ser desfeita.
                      </div>
                    }
                    okText="Sim, excluir permanentemente"
                    cancelText="Cancelar"
                    okButtonProps={{ danger: true, loading: deleting, className: 'bg-[#E12D39]' }}
                    onConfirm={handleDeleteEntity}
                  >
                    <Button danger type="primary" icon={<DeleteOutlined />} loading={deleting} className="bg-[#E12D39]">
                      Excluir Ativo Permanentemente
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};
