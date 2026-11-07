import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Input,
  Radio,
  Button,
  Tag,
  Popconfirm,
  message,
  Collapse,
  Select,
  Tooltip,
} from 'antd';
import {
  HistoryOutlined,
  PlusCircleOutlined,
  RollbackOutlined,
  BranchesOutlined,
  DownloadOutlined,
  DiffOutlined,
  EyeOutlined,
  TagOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { catalogService } from '@/services/catalog.service';
import { projectsService } from '@/services/projects.service';
import type { VersionSnapshot } from '@/types/domain.types';

interface EntityVersionModalProps {
  open: boolean;
  onClose: () => void;
  entityType:
    | 'specification'
    | 'rule'
    | 'architecture'
    | 'component'
    | 'module'
    | 'template'
    | 'blueprint'
    | 'project';
  entityId: string;
  entityName: string;
  currentVersion: string;
  versions?: VersionSnapshot[];
  onSuccess?: () => void;
}

export const EntityVersionModal: React.FC<EntityVersionModalProps> = ({
  open,
  onClose,
  entityType,
  entityId,
  entityName,
  currentVersion,
  versions = [],
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState('history');
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [bumpType, setBumpType] = useState<'patch' | 'minor' | 'major' | 'custom'>('patch');

  // Internal reactive state to ensure immediate UI feedback
  const [curVer, setCurVer] = useState<string>(currentVersion || '1.0.0');
  const [history, setHistory] = useState<VersionSnapshot[]>(versions || []);

  // Diff comparison states
  const [diffVerA, setDiffVerA] = useState<string>('');
  const [diffVerB, setDiffVerB] = useState<string>('');

  // Helper to compute next semver
  const computeNextVersion = (type: 'patch' | 'minor' | 'major', ver: string) => {
    const clean = (ver || '1.0.0').replace(/^v/, '');
    const parts = clean.split('.').map((p) => parseInt(p, 10) || 0);
    while (parts.length < 3) parts.push(0);

    if (type === 'major') return `${parts[0] + 1}.0.0`;
    if (type === 'minor') return `${parts[0]}.${parts[1] + 1}.0`;
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  };

  // Sync state when modal opens or props change
  useEffect(() => {
    if (open) {
      const activeV = (currentVersion || '1.0.0').replace(/^v/, '');
      setCurVer(activeV);
      const rawList =
        versions && versions.length > 0
          ? versions
          : [
              {
                version: activeV,
                changelog: 'Versão canônica ativa',
                created_at: new Date().toISOString(),
                created_by: 'willian.jesus@olivelas.com.br',
                snapshot_data: {},
              },
            ];
      setHistory(rawList);
      setBumpType('patch');
      setActiveTab('history');
      if (rawList.length >= 2) {
        setDiffVerA(rawList[0].version);
        setDiffVerB(rawList[1].version);
      } else if (rawList.length === 1) {
        setDiffVerA(rawList[0].version);
        setDiffVerB(rawList[0].version);
      }
      form.setFieldsValue({
        version: computeNextVersion('patch', activeV),
        changelog: '',
      });
    }
  }, [open, currentVersion, versions, form]);

  const handleCreateSnapshot = async (values: { version: string; changelog: string }) => {
    setSubmitting(true);
    try {
      const isProject = entityType === 'project';
      const cleanVer = values.version.replace(/^v/, '');
      let newSnap: VersionSnapshot;

      if (isProject) {
        const res = await projectsService.createVersion(entityId, {
          version: cleanVer,
          changelog: values.changelog,
        });
        newSnap = res?.data || {
          version: cleanVer,
          changelog: values.changelog,
          created_at: new Date().toISOString(),
          created_by: 'willian.jesus@olivelas.com.br',
        };
      } else {
        const res = await catalogService.createVersion(entityType, entityId, {
          version: cleanVer,
          changelog: values.changelog,
        });
        newSnap = res?.data || {
          version: cleanVer,
          changelog: values.changelog,
          created_at: new Date().toISOString(),
          created_by: 'willian.jesus@olivelas.com.br',
        };
      }

      setHistory((prev) => [newSnap, ...prev.filter((item) => item.version !== cleanVer)]);
      setCurVer(cleanVer);

      message.success(`Release v${cleanVer} criada com sucesso!`);
      form.resetFields();
      setBumpType('patch');
      form.setFieldsValue({
        version: computeNextVersion('patch', cleanVer),
        changelog: '',
      });
      setActiveTab('history');
      onSuccess?.();
    } catch (err: any) {
      message.error(err.message || 'Falha ao criar snapshot de versão');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestoreVersion = async (targetVersion: string) => {
    setSubmitting(true);
    try {
      const isProject = entityType === 'project';
      if (isProject) {
        await projectsService.restoreVersion(entityId, { version: targetVersion });
      } else {
        await catalogService.restoreVersion(entityType, entityId, { version: targetVersion });
      }
      setCurVer(targetVersion);
      message.success(
        `Rollback realizado com sucesso! O ${entityName} foi restaurado para a versão v${targetVersion}.`
      );
      onSuccess?.();
    } catch (err: any) {
      message.error(err.message || 'Falha ao reverter versão');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportSnapshot = (snap: VersionSnapshot) => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${entityType}-${entityId}-v${snap.version}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    message.info(`Snapshot v${snap.version} baixado como JSON`);
  };

  const snapA = history.find((h) => h.version === diffVerA);
  const snapB = history.find((h) => h.version === diffVerB);

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-2">
            <BranchesOutlined className="text-loft-orange text-lg" />
            <div>
              <div className="font-bold text-loft-dark text-base leading-tight">
                Controle de Versões & Releases
              </div>
              <div className="text-xs text-loft-muted font-normal mt-0.5">
                {entityName} ({entityType})
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag color="green" className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
              ● Ativa: v{curVer}
            </Tag>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={780}
      centered
      destroyOnClose
      styles={{
        body: {
          maxHeight: 'calc(85vh - 100px)',
          overflowY: 'auto',
          padding: '16px 24px',
        },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'history',
            label: (
              <span className="font-medium text-xs">
                <HistoryOutlined /> Releases & Histórico ({history.length || 1})
              </span>
            ),
            children: (
              <div className="py-2 space-y-3">
                <div className="bg-[#FAFBFD] p-3 rounded-lg border border-loft-border text-xs text-[#486581] flex items-center justify-between">
                  <span>
                    Todas as versões anteriores ficam congeladas em snapshots completos. Caso
                    encontre bugs ou regressões, você pode executar o <b>Rollback imediato</b>.
                  </span>
                  <Button
                    size="small"
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    className="bg-loft-orange hover:bg-[#D9532B] border-none text-xs ml-3 whitespace-nowrap"
                    onClick={() => setActiveTab('new-version')}
                  >
                    Criar Release
                  </Button>
                </div>

                <div className="space-y-3">
                  {history.map((v, idx) => {
                    const cleanItemVer = (v.version || '1.0.0').replace(/^v/, '');
                    const cleanCur = (curVer || '1.0.0').replace(/^v/, '');
                    const isCurrent =
                      cleanItemVer === cleanCur ||
                      (idx === 0 &&
                        !history.some((h) => (h.version || '').replace(/^v/, '') === cleanCur));
                    const snapshot = v.snapshot_data || {};

                    return (
                      <div
                        key={v.version || idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-linear-to-r from-emerald-50/50 to-white border-emerald-300 shadow-xs ring-1 ring-emerald-200'
                            : 'bg-white border-loft-border hover:border-[#CBD2D9]'
                        }`}
                      >
                        {/* Header da Release */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Tag
                              color={isCurrent ? 'green' : 'blue'}
                              className="font-mono font-bold text-sm px-2.5 py-0.5 rounded-md"
                            >
                              <TagOutlined className="mr-1" />
                              v{cleanItemVer}
                            </Tag>
                            {isCurrent && (
                              <Tag color="success" className="font-semibold text-xs">
                                ● Versão Atual em Produção
                              </Tag>
                            )}
                            <span className="text-xs text-[#829AB1] font-mono">
                              #sha-{(cleanItemVer + (v.created_at || '')).slice(0, 7) || 'latest'}
                            </span>
                          </div>

                          {/* Ações da Release */}
                          <div className="flex items-center gap-1.5">
                            <Tooltip title="Exportar snapshot JSON">
                              <Button
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => handleExportSnapshot(v)}
                                className="text-xs text-loft-muted"
                              />
                            </Tooltip>

                            {!isCurrent && (
                              <Popconfirm
                                title={`Restaurar versão v${cleanItemVer}?`}
                                description={
                                  <div className="max-w-[320px] text-xs">
                                    Esta ação substituirá o estado ativo de <b>{entityName}</b> pelo
                                    snapshot gravado nesta release.
                                  </div>
                                }
                                onConfirm={() => handleRestoreVersion(cleanItemVer)}
                                okText="Confirmar Rollback"
                                cancelText="Cancelar"
                                okButtonProps={{ danger: true }}
                              >
                                <Button
                                  size="small"
                                  type="primary"
                                  icon={<RollbackOutlined />}
                                  className="text-xs bg-amber-600 hover:bg-amber-700 border-none font-semibold text-white"
                                >
                                  Reverter para v{cleanItemVer}
                                </Button>
                              </Popconfirm>
                            )}
                          </div>
                        </div>

                        {/* Changelog / Release Notes */}
                        <div className="mt-2.5 bg-[#FAFBFD] p-3 rounded-lg border border-loft-border">
                          <div className="text-[11px] font-semibold text-loft-muted uppercase tracking-wider mb-1">
                            Notas de Lançamento / Changelog
                          </div>
                          <p className="text-xs text-loft-dark leading-relaxed whitespace-pre-line mb-0">
                            {v.changelog || (v as any).note || 'Snapshot inicial de versionamento.'}
                          </p>
                        </div>

                        {/* Metadata Footer & Snapshot Drawer */}
                        <div className="mt-3 flex items-center justify-between text-xs text-[#829AB1]">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <UserOutlined />{' '}
                              {v.created_by ||
                                (v as any).author ||
                                'willian.jesus@olivelas.com.br'}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarOutlined /> {v.created_at || (v as any).date || 'Recente'}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible Snapshot Details */}
                        {Object.keys(snapshot).length > 0 && (
                          <div className="mt-2 pt-2 border-t border-[#F0F4F8]">
                            <Collapse
                              ghost
                              size="small"
                              items={[
                                {
                                  key: 'snapshot_data',
                                  label: (
                                    <span className="text-xs text-loft-muted font-medium flex items-center gap-1">
                                      <EyeOutlined /> Inspecionar Snapshot Gravado (
                                      {Object.keys(snapshot).length} campos)
                                    </span>
                                  ),
                                  children: (
                                    <div className="bg-[#0b1015] text-[#d1d5db] p-3 rounded-lg text-xs font-mono max-h-48 overflow-y-auto">
                                      <pre className="m-0 text-[11px]">
                                        {JSON.stringify(snapshot, null, 2)}
                                      </pre>
                                    </div>
                                  ),
                                },
                              ]}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          },
          {
            key: 'new-version',
            label: (
              <span className="font-medium text-xs">
                <PlusCircleOutlined /> Criar Nova Release
              </span>
            ),
            children: (
              <div className="py-2">
                <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 mb-4">
                  💡 <b>Controle SemVer GitHub-like:</b> Ao criar uma nova release, um snapshot
                  congelado do estado atual de <b>{entityName}</b> será persistido no banco de
                  dados com autor, carimbo de data/hora e trilha de auditoria.
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    version: computeNextVersion('patch', curVer),
                    changelog: '',
                  }}
                  onFinish={handleCreateSnapshot}
                >
                  <Form.Item label="Tipo de Incremento SemVer">
                    <Radio.Group
                      value={bumpType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBumpType(val);
                        if (val !== 'custom') {
                          form.setFieldsValue({
                            version: computeNextVersion(val, curVer),
                          });
                        }
                      }}
                      className="w-full grid grid-cols-4 gap-2"
                    >
                      <Radio.Button value="patch" className="text-center font-mono">
                        Patch (+0.0.1) → v{computeNextVersion('patch', curVer)}
                      </Radio.Button>
                      <Radio.Button value="minor" className="text-center font-mono">
                        Minor (+0.1.0) → v{computeNextVersion('minor', curVer)}
                      </Radio.Button>
                      <Radio.Button value="major" className="text-center font-mono">
                        Major (+1.0.0) → v{computeNextVersion('major', curVer)}
                      </Radio.Button>
                      <Radio.Button value="custom" className="text-center">
                        Customizado
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="version"
                    label="Número da Versão (SemVer)"
                    rules={[{ required: true, message: 'Informe a versão' }]}
                  >
                    <Input placeholder="Ex: 1.1.0" className="font-mono font-bold text-base" />
                  </Form.Item>

                  <Form.Item
                    name="changelog"
                    label="Notas de Lançamento / Changelog (Markdown)"
                    rules={[{ required: true, message: 'Descreva as alterações desta versão' }]}
                  >
                    <Input.TextArea
                      rows={5}
                      placeholder={`### Novidades\n- Adicionado suporte a múltiplos provedores LLM\n- Nova tela de parametrização de tokens\n\n### Correções\n- Corrigido alinhamento de layout no Live Preview`}
                    />
                  </Form.Item>

                  <div className="flex justify-end gap-2 pt-2 border-t border-loft-border">
                    <Button onClick={() => setActiveTab('history')}>Cancelar</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      className="bg-loft-orange hover:bg-[#D9532B] border-none font-semibold text-white px-5"
                    >
                      Publicar Release v{form.getFieldValue('version') || '1.x'}
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
          {
            key: 'diff',
            label: (
              <span className="font-medium text-xs">
                <DiffOutlined /> Comparador de Versões (Diff)
              </span>
            ),
            children: (
              <div className="py-2 space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-[#FAFBFD] p-3 rounded-xl border border-loft-border">
                  <div>
                    <label className="text-xs font-semibold text-[#486581] block mb-1">
                      Versão Base (A):
                    </label>
                    <Select
                      value={diffVerA}
                      onChange={setDiffVerA}
                      className="w-full font-mono font-bold"
                      options={history.map((h) => ({
                        label: `v${h.version} ${h.version === curVer ? '(Ativa)' : ''}`,
                        value: h.version,
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#486581] block mb-1">
                      Versão de Comparação (B):
                    </label>
                    <Select
                      value={diffVerB}
                      onChange={setDiffVerB}
                      className="w-full font-mono font-bold"
                      options={history.map((h) => ({
                        label: `v${h.version} ${h.version === curVer ? '(Ativa)' : ''}`,
                        value: h.version,
                      }))}
                    />
                  </div>
                </div>

                {snapA && snapB ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Lado A */}
                      <div className="p-3 bg-white rounded-lg border border-loft-border">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-loft-border">
                          <Tag color="blue" className="font-mono font-bold">
                            v{snapA.version}
                          </Tag>
                          <span className="text-[11px] text-[#829AB1]">
                            {snapA.created_at || 'Recente'}
                          </span>
                        </div>
                        <p className="text-xs text-[#486581] mb-2">
                          {snapA.changelog || 'Sem changelog'}
                        </p>
                        <div className="bg-[#0b1015] text-[#a7f3d0] p-2.5 rounded-sm text-[11px] font-mono max-h-56 overflow-y-auto">
                          <pre className="m-0">
                            {JSON.stringify(snapA.snapshot_data || {}, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Lado B */}
                      <div className="p-3 bg-white rounded-lg border border-loft-border">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-loft-border">
                          <Tag color="purple" className="font-mono font-bold">
                            v{snapB.version}
                          </Tag>
                          <span className="text-[11px] text-[#829AB1]">
                            {snapB.created_at || 'Recente'}
                          </span>
                        </div>
                        <p className="text-xs text-[#486581] mb-2">
                          {snapB.changelog || 'Sem changelog'}
                        </p>
                        <div className="bg-[#0b1015] text-[#bfdbfe] p-2.5 rounded-sm text-[11px] font-mono max-h-56 overflow-y-auto">
                          <pre className="m-0">
                            {JSON.stringify(snapB.snapshot_data || {}, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-[#829AB1]">
                    Selecione duas versões para comparar as alterações de snapshot.
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};
