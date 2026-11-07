import React, { useState, useEffect } from 'react';
import { Modal, Input, List, Tag, Typography } from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  BlockOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  FolderOpenOutlined,
  BuildOutlined,
  CompassOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useUIStore, ActiveView } from '@/stores/uiStore';
import { apiClient } from '@/services/api-client';

const { Text } = Typography;

interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveView,
    openInspector360,
  } = useUIStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Global shortcut listener ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Search API effect
  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    if (!query.trim()) {
      setResults([
        { id: 'view:dashboard', type: 'navigation', title: 'Dashboard Geral', description: 'Visão executiva e métricas de engenharia' },
        { id: 'view:workshop', type: 'navigation', title: 'Blueprint Workshop Studio', description: 'Compositor interativo de arquitetura e dependências' },
        { id: 'view:projects', type: 'navigation', title: 'Projetos', description: 'Aplicações cadastradas e geradas' },
        { id: 'view:blueprints', type: 'navigation', title: 'Blueprints', description: 'Plantas baixas prontas para geração' },
        { id: 'view:components', type: 'navigation', title: 'Catálogo de Componentes Copan', description: 'Building blocks certificados de interface' },
        { id: 'view:modules', type: 'navigation', title: 'Catálogo de Módulos', description: 'Blocos funcionais de domínio e negócio' },
        { id: 'view:rules', type: 'navigation', title: 'Golden Rules de Engenharia', description: 'Diretrizes arquiteturais e boas práticas' },
        { id: 'view:specifications', type: 'navigation', title: 'Especificações Técnicas (SDDs)', description: 'Documentação canônica de referência' },
        { id: 'view:ai-composer', type: 'navigation', title: 'AI Blueprint Composer', description: 'Gerador inteligente orientado a prompts' },
      ]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<any>(`/api/v1/search?q=${encodeURIComponent(query)}`);
        const items: SearchResultItem[] = (res.results || []).map((r: any) => ({
          id: r.id,
          type: r.type,
          title: r.name || r.title || r.id,
          description: r.description || r.summary || '',
          category: r.category,
          tags: r.tags || [],
        }));
        setResults(items);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, commandPaletteOpen]);

  const handleSelect = (item: SearchResultItem) => {
    setCommandPaletteOpen(false);
    if (item.type === 'navigation') {
      const view = item.id.replace('view:', '') as ActiveView;
      setActiveView(view);
    } else {
      openInspector360(item.type, item.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'component':
        return <AppstoreOutlined className="text-loft-orange" />;
      case 'module':
        return <BlockOutlined className="text-loft-success" />;
      case 'rule':
        return <SafetyCertificateOutlined className="text-loft-warning" />;
      case 'specification':
        return <FileTextOutlined className="text-loft-info" />;
      case 'project':
        return <FolderOpenOutlined className="text-loft-muted" />;
      case 'blueprint':
        return <BuildOutlined className="text-[#805AD5]" />;
      case 'navigation':
        return <CompassOutlined className="text-loft-orange" />;
      default:
        return <RobotOutlined className="text-loft-muted" />;
    }
  };

  return (
    <Modal
      open={commandPaletteOpen}
      onCancel={() => setCommandPaletteOpen(false)}
      footer={null}
      closable={false}
      width={640}
      styles={{ body: { padding: '16px' } }}
      centered
    >
      <div className="flex flex-col gap-3">
        <Input
          prefix={<SearchOutlined className="text-lg text-loft-muted mr-2" />}
          placeholder="Busque componentes, módulos, regras, projetos ou navegue... (ESC para fechar)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          variant="filled"
          className="text-base py-2.5 rounded-lg bg-loft-bg"
        />

        <div className="max-h-[380px] overflow-y-auto mt-2">
          <List
            loading={loading}
            dataSource={results}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleSelect(item)}
                className="hover:bg-[#FFF2EC] cursor-pointer rounded-lg px-3 py-2.5 transition-colors duration-150 border-b-0"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="text-lg flex items-center justify-center w-8 h-8 rounded-md bg-loft-bg">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-loft-dark truncate">{item.title}</span>
                      <Tag className="text-xs">{item.type.toUpperCase()}</Tag>
                      {item.category && <Tag color="blue" className="text-xs">{item.category}</Tag>}
                    </div>
                    <Text type="secondary" className="text-xs block truncate mt-0.5">
                      {item.description}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-loft-border text-xs text-loft-muted">
          <span>Use <b>↑ ↓</b> para navegar e <b>ENTER</b> para selecionar</span>
          <span>Pressione <b>ESC</b> para sair</span>
        </div>
      </div>
    </Modal>
  );
};
