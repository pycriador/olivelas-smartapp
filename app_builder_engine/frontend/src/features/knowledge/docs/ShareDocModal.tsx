import React, { useState } from 'react';
import {
  Modal,
  Input,
  Button,
  Select,
  List,
  Avatar,
  Tag,
  Typography,
  Space,
  message,
  Divider,
} from 'antd';
import {
  ShareAltOutlined,
  CopyOutlined,
  LinkOutlined,
  UserOutlined,
  TeamOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { KnowledgeDocumentDetail } from '@/types/knowledge.types';
import { knowledgeService } from '@/services/knowledge.service';

const { Text } = Typography;
const { Option } = Select;

interface ShareDocModalProps {
  visible: boolean;
  onClose: () => void;
  document: KnowledgeDocumentDetail | null;
  onShareUpdated: () => void;
}

const PRESET_GROUPS = [
  { id: 'tech-leads', name: 'Tech Leads Guild' },
  { id: 'ai-chapter', name: 'AI Engineering Chapter' },
  { id: 'frontend-guild', name: 'Frontend Copan Guild' },
  { id: 'backend-chapter', name: 'Backend FastAPI Chapter' },
  { id: 'sre-team', name: 'SRE & Observability Team' },
  { id: 'infosec-guild', name: 'InfoSec & Security Guild' },
];

export const ShareDocModal: React.FC<ShareDocModalProps> = ({
  visible,
  onClose,
  document,
  onShareUpdated,
}) => {
  const [targetType, setTargetType] = useState<'user' | 'group'>('group');
  const [targetId, setTargetId] = useState<string>('tech-leads');
  const [targetName, setTargetName] = useState<string>('Tech Leads Guild');
  const [userEmailInput, setUserEmailInput] = useState<string>('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [submitting, setSubmitting] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  if (!document) return null;

  const directUrl = `${window.location.origin}/knowledge/docs#${document.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl);
    message.success('Link do documento copiado para a área de transferência!');
  };

  const handleAddShare = async () => {
    try {
      setSubmitting(true);
      const finalId = targetType === 'group' ? targetId : userEmailInput.trim();
      const finalName =
        targetType === 'group'
          ? targetName
          : userEmailInput.trim().split('@')[0] || userEmailInput.trim();

      if (!finalId) {
        message.warning('Por favor, informe o e-mail do usuário.');
        return;
      }

      await knowledgeService.addShare(document.id, {
        target_type: targetType,
        target_id: finalId,
        target_name: finalName,
        role,
      });

      message.success(`Compartilhado com sucesso com ${finalName}!`);
      setUserEmailInput('');
      onShareUpdated();
    } catch (err: any) {
      message.error(err.message || 'Falha ao compartilhar documento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      setRevokingId(shareId);
      await knowledgeService.removeShare(document.id, shareId);
      message.success('Compartilhamento revogado com sucesso.');
      onShareUpdated();
    } catch (err: any) {
      message.error(err.message || 'Falha ao revogar compartilhamento.');
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ShareAltOutlined style={{ color: '#FF774A' }} />
          <span>Compartilhar: {document.title}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} style={{ backgroundColor: '#121619' }}>
          Concluído
        </Button>,
      ]}
      width={640}
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Compartilhe este documento com colegas de equipe, grupos de engenharia ou copie o link direto.
        </Text>
      </div>

      {/* Link Sharing Section */}
      <div
        style={{
          background: '#F8FAFC',
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          marginBottom: 20,
        }}
      >
        <Text strong style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 6 }}>
          <LinkOutlined style={{ marginRight: 6 }} /> Link Direto do Documento
        </Text>
        <Space.Compact style={{ width: '100%' }}>
          <Input value={directUrl} readOnly style={{ backgroundColor: '#fff', fontSize: 13 }} />
          <Button icon={<CopyOutlined />} type="primary" onClick={handleCopyLink} style={{ backgroundColor: '#FF774A' }}>
            Copiar Link
          </Button>
        </Space.Compact>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Internal Sharing Form */}
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ fontSize: 14, color: '#1E293B', display: 'block', marginBottom: 10 }}>
          <TeamOutlined style={{ marginRight: 6, color: '#0066CC' }} /> Compartilhar com Usuários ou Grupos da Loft
        </Text>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Select
            value={targetType}
            onChange={(val) => {
              setTargetType(val);
              if (val === 'group') {
                setTargetId('tech-leads');
                setTargetName('Tech Leads Guild');
              }
            }}
            style={{ width: 140 }}
          >
            <Option value="group">
              <Space>
                <TeamOutlined /> Grupo
              </Space>
            </Option>
            <Option value="user">
              <Space>
                <UserOutlined /> Usuário
              </Space>
            </Option>
          </Select>

          {targetType === 'group' ? (
            <Select
              value={targetId}
              onChange={(val) => {
                setTargetId(val);
                const g = PRESET_GROUPS.find((group) => group.id === val);
                if (g) setTargetName(g.name);
              }}
              style={{ flex: 1 }}
            >
              {PRESET_GROUPS.map((g) => (
                <Option key={g.id} value={g.id}>
                  {g.name}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              placeholder="e.g. willian.jesus@loft.com.br"
              value={userEmailInput}
              onChange={(e) => setUserEmailInput(e.target.value)}
              style={{ flex: 1 }}
            />
          )}

          <Select value={role} onChange={(val) => setRole(val)} style={{ width: 130 }}>
            <Option value="viewer">Visualizador</Option>
            <Option value="editor">Editor</Option>
          </Select>

          <Button
            type="primary"
            onClick={handleAddShare}
            loading={submitting}
            style={{ backgroundColor: '#0066CC' }}
          >
            Adicionar
          </Button>
        </div>
      </div>

      {/* Active Shares List */}
      <Text strong style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 8 }}>
        Acessos Concedidos ({document.shares?.length || 0})
      </Text>

      <List
        size="small"
        bordered
        dataSource={document.shares || []}
        locale={{
          emptyText: (
            <div style={{ padding: 12, textAlign: 'center', color: '#94A3B8' }}>
              <GlobalOutlined style={{ fontSize: 20, marginBottom: 4 }} />
              <div>Documento disponível publicamente na base de conhecimento interna da Loft.</div>
            </div>
          ),
        }}
        renderItem={(share) => (
          <List.Item
            actions={[
              <Tag color={share.role === 'editor' ? 'orange' : 'blue'} key="role">
                {share.role === 'editor' ? 'Editor' : 'Visualizador'}
              </Tag>,
              <Button
                key="delete"
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={revokingId === share.id}
                onClick={() => handleRemoveShare(share.id)}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={share.target_type === 'group' ? <TeamOutlined /> : <UserOutlined />}
                  style={{
                    backgroundColor: share.target_type === 'group' ? '#EFF6FF' : '#FFF7ED',
                    color: share.target_type === 'group' ? '#0066CC' : '#FF774A',
                  }}
                />
              }
              title={<span style={{ fontWeight: 500, fontSize: 13 }}>{share.target_name}</span>}
              description={
                <span style={{ fontSize: 11, color: '#94A3B8' }}>
                  {share.target_type === 'group' ? 'Grupo de Engenharia' : share.target_id} • Por {share.created_by}
                </span>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};
