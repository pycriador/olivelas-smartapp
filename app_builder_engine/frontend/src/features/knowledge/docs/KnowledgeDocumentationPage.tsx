import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Input,
  Button,
  Tag,
  Typography,
  Space,
  Empty,
  Spin,
  Badge,
  Tooltip,
  message,
  Breadcrumb,
  Collapse,
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  ShareAltOutlined,
  CopyOutlined,
  CloudDownloadOutlined,
  ApiOutlined,
  CodeOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  FolderOpenOutlined,
  StarFilled,
  StarOutlined,
  SyncOutlined,
  GithubOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  FilterOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import type {
  KnowledgeCategory,
  KnowledgeDocumentSummary,
  KnowledgeDocumentDetail,
} from '@/types/knowledge.types';
import { knowledgeService } from '@/services/knowledge.service';
import { MarkdownViewer } from './MarkdownViewer';
import { ShareDocModal } from './ShareDocModal';
import { ImportDocModal } from './ImportDocModal';
import { ApiClientDrawer } from './ApiClientDrawer';

const { Title, Text } = Typography;

interface NavGroup {
  key: string;
  groupTitle: string;
  subtitle: string;
  categories: KnowledgeCategory[];
  icon: React.ReactNode;
  badgeColor: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    key: 'essentials_ai',
    groupTitle: 'Padrões de Engenharia & Governança de IA',
    subtitle: 'Cursor Rules (.mdc), Claude Skills, CLAUDE.md & AGENTS.md',
    categories: ['master_guide', 'ai_skills_prompts'],
    icon: <StarFilled style={{ color: '#FF774A' }} />,
    badgeColor: '#FF774A',
  },
  {
    key: 'architecture',
    groupTitle: 'Arquitetura de Sistemas & Decisões (ADRs)',
    subtitle: 'System Boundaries, Modelos de Dados & Contextos',
    categories: ['architecture_adr'],
    icon: <BranchesOutlined style={{ color: '#0066CC' }} />,
    badgeColor: '#0066CC',
  },
  {
    key: 'frontend_design',
    groupTitle: 'Frontend & Design System Copan',
    subtitle: 'SDD Volumes I-IV, Tokens Visuais & Componentes UI',
    categories: ['frontend_spec', 'design_system'],
    icon: <CodeOutlined style={{ color: '#F59E0B' }} />,
    badgeColor: '#F59E0B',
  },
  {
    key: 'backend_api',
    groupTitle: 'Backend FastAPI & Contratos de API',
    subtitle: 'SDD Volumes I-IV, Contratos Semânticos & Idempotência',
    categories: ['backend_spec', 'api_integrations'],
    icon: <ApartmentOutlined style={{ color: '#10B981' }} />,
    badgeColor: '#10B981',
  },
  {
    key: 'security_iam',
    groupTitle: 'Segurança da Informação & Zero-Trust',
    subtitle: 'Modelagem de Ameaças, Gestão de Segredos & Privilégios',
    categories: ['security_iam'],
    icon: <SafetyCertificateOutlined style={{ color: '#EF4444' }} />,
    badgeColor: '#EF4444',
  },
  {
    key: 'devops_sre',
    groupTitle: 'DevOps, Observabilidade & SRE',
    subtitle: 'Olivelas Observability (Datadog Pack), Health Checks & Runbooks',
    categories: ['devops_sre'],
    icon: <ThunderboltOutlined style={{ color: '#8B5CF6' }} />,
    badgeColor: '#8B5CF6',
  },
  {
    key: 'external_sources',
    groupTitle: 'Fontes Externas & Integrações',
    subtitle: 'Confluence Cloud, Repositórios GitHub & HTTP Client Specs',
    categories: ['external_confluence', 'external_github'],
    icon: <CloudDownloadOutlined style={{ color: '#0284C7' }} />,
    badgeColor: '#0284C7',
  },
];

const ALL_CATEGORY_OPTIONS: Array<{ key: string; label: string; shortLabel: string; color: string }> = [
  { key: 'all', label: 'Todos os Documentos', shortLabel: 'Todos', color: 'blue' },
  { key: 'ai_skills_prompts', label: 'AI Skills & Cursor Rules', shortLabel: 'AI Skills', color: 'purple' },
  { key: 'master_guide', label: 'Guias Mestres & Governança', shortLabel: 'Guias Mestres', color: 'volcano' },
  { key: 'architecture_adr', label: 'Arquitetura & Decisões (ADRs)', shortLabel: 'ADRs', color: 'cyan' },
  { key: 'security_iam', label: 'Segurança da Informação & IAM', shortLabel: 'Segurança', color: 'red' },
  { key: 'devops_sre', label: 'DevOps, Observabilidade & SRE', shortLabel: 'DevOps / SRE', color: 'green' },
  { key: 'backend_spec', label: 'Backend FastAPI & Contratos', shortLabel: 'Backend SDD', color: 'geekblue' },
  { key: 'frontend_spec', label: 'Frontend & Design System Copan', shortLabel: 'Frontend SDD', color: 'gold' },
  { key: 'design_system', label: 'Design System & UI Specs', shortLabel: 'Design System', color: 'orange' },
  { key: 'api_integrations', label: 'Integrações de API & Protocolos', shortLabel: 'APIs', color: 'lime' },
  { key: 'external_confluence', label: 'Confluence Cloud', shortLabel: 'Confluence', color: 'processing' },
  { key: 'external_github', label: 'Repositórios GitHub', shortLabel: 'GitHub Docs', color: 'default' },
];

const getInitialDocId = (): string => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) return hash;
  }
  return 'claude-master-guide';
};

export const KnowledgeDocumentationPage: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeDocumentSummary[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>(getInitialDocId);
  const [selectedDocDetail, setSelectedDocDetail] = useState<KnowledgeDocumentDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);
  const [isSidebarWide, setIsSidebarWide] = useState<boolean>(false);
  const [activeAccordionKeys, setActiveAccordionKeys] = useState<string[]>([
    'essentials_ai',
    'architecture',
    'frontend_design',
    'backend_api',
    'security_iam',
    'devops_sre',
    'external_sources',
  ]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingDoc, setLoadingDoc] = useState<boolean>(false);
  const [syncingDocs, setSyncingDocs] = useState<boolean>(false);
  const [favoriteDocIds, setFavoriteDocIds] = useState<string[]>([]);

  // Modals & Drawers
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [apiClientVisible, setApiClientVisible] = useState<boolean>(false);

  useEffect(() => {
    loadDocuments();
    loadFavorites();
  }, []);

  // Listen to browser hash changes directly
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && hash !== selectedDocId) {
        setSelectedDocId(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [selectedDocId]);

  useEffect(() => {
    if (selectedDocId) {
      loadDocumentDetail(selectedDocId);
    }
  }, [selectedDocId]);

  // Auto-expand the accordion panel containing the selected doc
  useEffect(() => {
    if (!selectedDocId || documents.length === 0) return;
    const doc = documents.find((d) => d.id === selectedDocId);
    if (doc) {
      const matchingGroup = NAV_GROUPS.find((g) => g.categories.includes(doc.category));
      if (matchingGroup && !activeAccordionKeys.includes(matchingGroup.key)) {
        setActiveAccordionKeys((prev) => [...prev, matchingGroup.key]);
      }
    }
  }, [selectedDocId, documents]);

  const loadFavorites = async () => {
    try {
      const favs = await knowledgeService.getUserFavorites();
      setFavoriteDocIds(favs);
    } catch {
      // silent fallback
    }
  };

  const handleToggleFavorite = async (docId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    try {
      const res = await knowledgeService.toggleFavorite(docId);
      if (res.is_favorite) {
        setFavoriteDocIds((prev) => Array.from(new Set([...prev, docId])));
        message.success('Documento adicionado aos seus favoritos!');
      } else {
        setFavoriteDocIds((prev) => prev.filter((id) => id !== docId));
        message.info('Documento removido dos seus favoritos.');
      }
    } catch {
      message.error('Falha ao atualizar favorito no banco de dados.');
    }
  };

  const loadDocuments = async () => {
    try {
      setLoadingList(true);
      const docs = await knowledgeService.getDocuments();
      setDocuments(docs);

      const currentHash = window.location.hash.replace('#', '').trim();
      if (currentHash) {
        const matchingDoc = docs.find((d) => d.id === currentHash);
        if (matchingDoc) {
          setSelectedDocId(matchingDoc.id);
        } else if (!selectedDocId) {
          setSelectedDocId(docs[0]?.id || 'claude-master-guide');
        }
      } else if (!selectedDocId && docs.length > 0) {
        setSelectedDocId(docs[0].id);
      }
    } catch (err: any) {
      message.error('Falha ao carregar catálogo de documentos do banco de dados.');
    } finally {
      setLoadingList(false);
    }
  };

  const loadDocumentDetail = async (docId: string) => {
    try {
      setLoadingDoc(true);
      const detail = await knowledgeService.getDocumentById(docId);
      setSelectedDocDetail(detail);
      if (window.location.hash.replace('#', '') !== docId) {
        window.history.replaceState(null, '', `#${docId}`);
      }
    } catch (err: any) {
      message.error('Falha ao carregar detalhes do documento.');
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleSyncRepo = async () => {
    try {
      setSyncingDocs(true);
      const res = await knowledgeService.syncAIOpsDocumentation();
      message.success(`Banco sincronizado com sucesso! ${res.total_documents} documentos persistidos no banco de dados.`);
      await loadDocuments();
      await loadFavorites();
      if (selectedDocId) {
        await loadDocumentDetail(selectedDocId);
      }
    } catch (err: any) {
      message.error('Falha ao sincronizar documentações com o banco de dados.');
    } finally {
      setSyncingDocs(false);
    }
  };

  // Filtered documents calculation
  const filteredDocs = useMemo(() => {
    let list = documents;

    if (selectedCategoryFilter === 'favorites') {
      list = list.filter((d) => favoriteDocIds.includes(d.id));
    } else if (selectedCategoryFilter !== 'all') {
      list = list.filter((d) => d.category === selectedCategoryFilter);
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q)
    );
  }, [documents, searchQuery, selectedCategoryFilter, favoriteDocIds]);

  // When search query is entered, auto expand all groups with matches
  useEffect(() => {
    if (searchQuery.trim()) {
      setActiveAccordionKeys(NAV_GROUPS.map((g) => g.key));
    }
  }, [searchQuery]);

  // Extract Table of Contents from doc content
  const tableOfContents = useMemo(() => {
    if (!selectedDocDetail?.content) return [];
    const lines = selectedDocDetail.content.split('\n');
    const toc: Array<{ level: number; title: string; id: string }> = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        toc.push({ level, title: text, id });
      }
    });

    return toc;
  }, [selectedDocDetail?.content]);

  const handleCopyDirectLink = () => {
    const url = `${window.location.origin}/knowledge/docs#${selectedDocId}`;
    navigator.clipboard.writeText(url);
    message.success('Link direto copiado para a área de transferência!');
  };

  const handleCopyFullMarkdown = () => {
    if (selectedDocDetail?.content) {
      navigator.clipboard.writeText(selectedDocDetail.content);
      message.success('Markdown completo copiado!');
    }
  };

  const handleImportDocSuccess = (doc: KnowledgeDocumentDetail) => {
    loadDocuments();
    setSelectedDocId(doc.id);
  };

  const handleToggleExpandAll = () => {
    if (activeAccordionKeys.length === NAV_GROUPS.length) {
      setActiveAccordionKeys([]);
    } else {
      setActiveAccordionKeys(NAV_GROUPS.map((g) => g.key));
    }
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          background: '#fff',
          padding: '12px 18px',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          width: '100%',
          boxSizing: 'border-box',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: '#FFF7ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOutlined style={{ color: '#FF774A', fontSize: 20 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Title level={4} style={{ margin: 0, color: '#0F172A', fontWeight: 700, fontSize: 16 }}>
                Central de Conhecimento & Documentação Técnica
              </Title>
              <Tag
                color="volcano"
                icon={<DatabaseOutlined />}
                style={{ margin: 0, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}
              >
                {documents.length} DOCUMENTOS NO BANCO
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Persistido em banco de dados SQLite/PostgreSQL & sincronizado com{' '}
              <a
                href="https://github.com/pycriador/olivelas-smartapp"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#0066CC', fontWeight: 500 }}
              >
                pycriador/olivelas-smartapp
              </a>
            </Text>
          </div>
        </div>

        <Space size="small" wrap>
          <Button
            icon={<SyncOutlined spin={syncingDocs} />}
            onClick={handleSyncRepo}
            loading={syncingDocs}
            style={{ fontWeight: 500 }}
          >
            Sincronizar Banco de Dados
          </Button>

          <Button
            icon={<ApiOutlined />}
            onClick={() => setApiClientVisible(true)}
            style={{ borderColor: '#0066CC', color: '#0066CC', fontWeight: 500 }}
          >
            HTTP Client
          </Button>

          <Button
            type="primary"
            icon={<CloudDownloadOutlined />}
            onClick={() => setImportModalVisible(true)}
            style={{ backgroundColor: '#121619', fontWeight: 500 }}
          >
            Importar Documento
          </Button>
        </Space>
      </div>

      {/* Main 3-Column Fluid Grid Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isSidebarWide
            ? '450px minmax(0, 1fr) 230px'
            : '340px minmax(0, 1fr) 230px',
          gap: 16,
          alignItems: 'start',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'grid-template-columns 0.25s ease-in-out',
        }}
      >
        {/* Left Column: Interactive Collapsible Menu with Search & Category Filters */}
        <Card
          size="small"
          style={{
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            height: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box',
          }}
          styles={{
            body: {
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            },
          }}
        >
          {/* Header with Title & Sidebar Width Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FolderOpenOutlined style={{ color: '#FF774A', fontSize: 14 }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>
                Documentos & Guias
              </span>
              <Tag color="volcano" style={{ margin: 0, fontSize: 10, borderRadius: 10, padding: '0 6px' }}>
                {filteredDocs.length}
              </Tag>
            </div>
            <Tooltip title={isSidebarWide ? "Restaurar largura padrão do menu (340px)" : "Expandir largura do menu (450px)"}>
              <Button
                size="small"
                type="text"
                icon={isSidebarWide ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                onClick={() => setIsSidebarWide(!isSidebarWide)}
                style={{ fontSize: 11, color: '#0066CC', padding: '0 4px', height: 24, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {isSidebarWide ? 'Compactar' : 'Expandir Menu'}
              </Button>
            </Tooltip>
          </div>

          {/* Functional Search Input */}
          <div style={{ marginBottom: 10 }}>
            <Input
              placeholder={`Pesquisar títulos, tags ou conteúdo...`}
              prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ borderRadius: 6, fontSize: 12.5 }}
            />
            {searchQuery.trim() && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 4,
                  padding: '0 4px',
                }}
              >
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Encontrados: <strong style={{ color: '#FF774A' }}>{filteredDocs.length}</strong> de {documents.length}
                </Text>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setSearchQuery('')}
                  style={{ padding: 0, fontSize: 11 }}
                >
                  Limpar
                </Button>
              </div>
            )}
          </div>

          {/* Expandable Category Filter Section */}
          <div
            style={{
              marginBottom: 10,
              padding: '8px 8px',
              backgroundColor: '#F8FAFC',
              borderRadius: 6,
              border: '1px solid #E2E8F0',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FilterOutlined style={{ color: selectedCategoryFilter !== 'all' ? '#FF774A' : '#64748B', fontSize: 11 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  Filtro por Categoria
                </span>
                {selectedCategoryFilter !== 'all' && (
                  <Tag
                    color={selectedCategoryFilter === 'favorites' ? 'gold' : 'volcano'}
                    closable
                    onClose={() => setSelectedCategoryFilter('all')}
                    style={{ margin: 0, fontSize: 10, cursor: 'pointer', padding: '0 4px', fontWeight: 600 }}
                  >
                    {selectedCategoryFilter === 'favorites' ? '★ Favoritos' : 'Ativo'}
                  </Tag>
                )}
              </div>
              <Button
                type="link"
                size="small"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                style={{
                  padding: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#0066CC',
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                {isFiltersExpanded ? (
                  <>
                    Menos opções <UpOutlined style={{ fontSize: 9 }} />
                  </>
                ) : (
                  <>
                    Todas ({ALL_CATEGORY_OPTIONS.length}) <DownOutlined style={{ fontSize: 9 }} />
                  </>
                )}
              </Button>
            </div>

            {/* Filter Tags Container (Scrollable/Expandable) */}
            <div
              style={{
                display: 'flex',
                gap: 5,
                flexWrap: 'wrap',
                maxHeight: isFiltersExpanded ? '200px' : '58px',
                overflowY: isFiltersExpanded ? 'auto' : 'hidden',
                transition: 'max-height 0.25s ease-in-out',
                paddingTop: 2,
              }}
            >
              {/* Favorites Quick Pill */}
              <Tag
                onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'favorites' ? 'all' : 'favorites')}
                color={selectedCategoryFilter === 'favorites' ? '#F59E0B' : 'default'}
                style={{
                  cursor: 'pointer',
                  margin: 0,
                  fontSize: 10.5,
                  borderRadius: 4,
                  padding: '2px 7px',
                  fontWeight: selectedCategoryFilter === 'favorites' ? 700 : 500,
                  border: selectedCategoryFilter === 'favorites' ? '1px solid #D97706' : '1px solid #CBD5E1',
                  backgroundColor: selectedCategoryFilter === 'favorites' ? '#FEF3C7' : '#FFFFFF',
                  color: selectedCategoryFilter === 'favorites' ? '#92400E' : '#334155',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <StarFilled style={{ color: selectedCategoryFilter === 'favorites' ? '#D97706' : '#F59E0B', fontSize: 11 }} />
                <span>Favoritos</span>
                <span
                  style={{
                    fontSize: 9.5,
                    opacity: 0.95,
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: '0 3px',
                  }}
                >
                  ({favoriteDocIds.length})
                </span>
              </Tag>

              {(isFiltersExpanded ? ALL_CATEGORY_OPTIONS : ALL_CATEGORY_OPTIONS.slice(0, 5)).map((cat) => {
                const count = cat.key === 'all'
                  ? documents.length
                  : documents.filter((d) => d.category === cat.key).length;
                const isSelected = selectedCategoryFilter === cat.key;

                return (
                  <Tag
                    key={cat.key}
                    onClick={() => setSelectedCategoryFilter(cat.key)}
                    color={isSelected ? cat.color : 'default'}
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                      fontSize: 10.5,
                      borderRadius: 4,
                      padding: '2px 7px',
                      fontWeight: isSelected ? 600 : 400,
                      border: isSelected ? undefined : '1px solid #CBD5E1',
                      backgroundColor: isSelected ? undefined : '#FFFFFF',
                      color: isSelected ? undefined : '#334155',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{cat.shortLabel}</span>
                    <span
                      style={{
                        fontSize: 9.5,
                        opacity: 0.85,
                        fontWeight: 600,
                        borderRadius: 8,
                        padding: '0 3px',
                      }}
                    >
                      ({count})
                    </span>
                  </Tag>
                );
              })}
            </div>
          </div>

          {/* Expand/Collapse Control Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
              padding: '0 4px',
            }}
          >
            <Text strong style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Categorias & Especificações
            </Text>
            <Button
              type="text"
              size="small"
              onClick={handleToggleExpandAll}
              style={{ fontSize: 10.5, color: '#0066CC', padding: 0, height: 'auto' }}
            >
              {activeAccordionKeys.length === NAV_GROUPS.length ? 'Recolher Todos' : 'Expandir Todos'}
            </Button>
          </div>

          {/* Interactive Collapsible Navigation Tree */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
            {loadingList ? (
              <div style={{ textAlign: 'center', padding: 32 }} className="flex flex-col items-center justify-center gap-2">
                <Spin size="small" />
                <span className="text-xs text-loft-muted">Carregando do banco de dados...</span>
              </div>
            ) : filteredDocs.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  selectedCategoryFilter === 'favorites'
                    ? 'Nenhum documento favoritado ainda. Clique na estrela ⭐ de qualquer especificação para favoritá-la.'
                    : 'Nenhum documento encontrado no banco.'
                }
                style={{ margin: '32px 0' }}
              />
            ) : (
              <Collapse
                activeKey={activeAccordionKeys}
                onChange={(keys) => setActiveAccordionKeys(typeof keys === 'string' ? [keys] : (keys as string[]))}
                bordered={false}
                style={{ background: 'transparent' }}
                items={NAV_GROUPS.map((group) => {
                  const groupDocs = filteredDocs.filter((d) => group.categories.includes(d.category));
                  const totalInGroup = documents.filter((d) => group.categories.includes(d.category)).length;

                  if (groupDocs.length === 0 && (searchQuery.trim() || selectedCategoryFilter !== 'all')) {
                    return null;
                  }

                  return {
                    key: group.key,
                    label: (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          paddingRight: 6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, paddingRight: 6 }}>
                          {group.icon}
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#1E293B',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={group.groupTitle}
                          >
                            {group.groupTitle}
                          </span>
                        </div>
                        <Badge
                          count={searchQuery.trim() || selectedCategoryFilter !== 'all' ? `${groupDocs.length}/${totalInGroup}` : totalInGroup}
                          style={{
                            backgroundColor: groupDocs.some((d) => d.id === selectedDocId) ? '#FF774A' : '#E2E8F0',
                            color: groupDocs.some((d) => d.id === selectedDocId) ? '#fff' : '#475569',
                            fontSize: 9.5,
                            fontWeight: 600,
                          }}
                        />
                      </div>
                    ),
                    children: (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4 }}>
                        {groupDocs.map((doc) => {
                          const isSelected = selectedDocId === doc.id;
                          const isFav = favoriteDocIds.includes(doc.id);
                          return (
                            <div
                              key={doc.id}
                              onClick={() => setSelectedDocId(doc.id)}
                              style={{
                                padding: '6px 8px',
                                borderRadius: 5,
                                cursor: 'pointer',
                                fontSize: 11.5,
                                fontWeight: isSelected ? 600 : 400,
                                backgroundColor: isSelected ? '#FFF7ED' : 'transparent',
                                color: isSelected ? '#9A3412' : '#334155',
                                borderLeft: isSelected ? '3px solid #FF774A' : '3px solid transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                                gap: 4,
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1,
                                  minWidth: 0,
                                }}
                                title={doc.title}
                              >
                                {doc.title}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                                {doc.shares_count > 0 && (
                                  <Tag
                                    color="orange"
                                    style={{ margin: 0, fontSize: 8.5, lineHeight: '13px', padding: '0 3px' }}
                                  >
                                    <TeamOutlined style={{ marginRight: 2 }} /> {doc.shares_count}
                                  </Tag>
                                )}
                                <Tooltip title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
                                  <span
                                    onClick={(e) => handleToggleFavorite(doc.id, e)}
                                    style={{
                                      cursor: 'pointer',
                                      padding: '1px 2px',
                                      borderRadius: 3,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      opacity: isFav ? 1 : 0.45,
                                      transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = isFav ? '1' : '0.45')}
                                  >
                                    {isFav ? (
                                      <StarFilled style={{ color: '#F59E0B', fontSize: 13 }} />
                                    ) : (
                                      <StarOutlined style={{ color: '#64748B', fontSize: 13 }} />
                                    )}
                                  </span>
                                </Tooltip>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ),
                    style: {
                      marginBottom: 4,
                      background: '#fff',
                      border: '1px solid #F1F5F9',
                      borderRadius: 6,
                      overflow: 'hidden',
                    },
                  };
                }).filter(Boolean) as any}
              />
            )}
          </div>
        </Card>

        {/* Center Column: Clean Document Content Reader */}
        <Card
          size="small"
          style={{
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            minHeight: 'calc(100vh - 160px)',
            background: '#fff',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
          styles={{ body: { padding: '20px 24px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' } }}
        >
          {loadingDoc ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }} className="flex flex-col items-center justify-center gap-3">
              <Spin size="large" />
              <span className="text-sm text-loft-muted">Carregando especificação do banco de dados...</span>
            </div>
          ) : selectedDocDetail ? (
            <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
              {/* Document Header & Breadcrumb */}
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 16 }}>
                <Breadcrumb
                  style={{ fontSize: 11, marginBottom: 6, color: '#64748B' }}
                  items={[
                    { title: 'Base de Conhecimento (DB)' },
                    { title: selectedDocDetail.category.toUpperCase() },
                    { title: selectedDocDetail.title },
                  ]}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <div>
                    <Space size={6} style={{ marginBottom: 4, flexWrap: 'wrap' }}>
                      <Tag color="volcano" style={{ fontWeight: 600 }}>
                        {selectedDocDetail.category.toUpperCase()}
                      </Tag>
                      {selectedDocDetail.volume && <Tag color="blue">{selectedDocDetail.volume}</Tag>}
                      {selectedDocDetail.source_url && (
                        <Tag color="purple" icon={<GithubOutlined />}>
                          Sincronizado via GitHub
                        </Tag>
                      )}
                      {selectedDocDetail.is_custom && <Tag color="green">Custom DB</Tag>}
                    </Space>
                    <Title level={2} style={{ margin: '4px 0', color: '#0F172A', fontWeight: 700, fontSize: 20 }}>
                      {selectedDocDetail.title}
                    </Title>
                  </div>

                  {/* Action Buttons */}
                  <Space size="small">
                    <Tooltip title={favoriteDocIds.includes(selectedDocDetail.id) ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}>
                      <Button
                        size="middle"
                        icon={
                          favoriteDocIds.includes(selectedDocDetail.id) ? (
                            <StarFilled style={{ color: '#F59E0B' }} />
                          ) : (
                            <StarOutlined style={{ color: '#64748B' }} />
                          )
                        }
                        onClick={() => handleToggleFavorite(selectedDocDetail.id)}
                        style={{
                          borderColor: favoriteDocIds.includes(selectedDocDetail.id) ? '#F59E0B' : undefined,
                          color: favoriteDocIds.includes(selectedDocDetail.id) ? '#B45309' : undefined,
                          backgroundColor: favoriteDocIds.includes(selectedDocDetail.id) ? '#FFFBEB' : undefined,
                          fontWeight: 600,
                        }}
                      >
                        {favoriteDocIds.includes(selectedDocDetail.id) ? 'Favoritado' : 'Favoritar'}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Copiar Link Direto com Hash">
                      <Button size="middle" icon={<LinkOutlined />} onClick={handleCopyDirectLink}>
                        Link
                      </Button>
                    </Tooltip>
                    <Tooltip title="Copiar Markdown Completo">
                      <Button size="middle" icon={<CopyOutlined />} onClick={handleCopyFullMarkdown}>
                        Copiar MD
                      </Button>
                    </Tooltip>
                    <Button
                      size="middle"
                      type="primary"
                      icon={<ShareAltOutlined />}
                      onClick={() => setShareModalVisible(true)}
                      style={{ backgroundColor: '#FF774A' }}
                    >
                      Compartilhar ({selectedDocDetail.shares?.length || 0})
                    </Button>
                  </Space>
                </div>

                {/* Metadata Details */}
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    fontSize: 11.5,
                    color: '#64748B',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>
                    <UserOutlined style={{ marginRight: 4 }} /> Autor:{' '}
                    <strong>{selectedDocDetail.author || 'Olivelas Engineering'}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    <ClockCircleOutlined style={{ marginRight: 4 }} /> Versão:{' '}
                    <strong>v{selectedDocDetail.version || '1.0.0'}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    <DatabaseOutlined style={{ marginRight: 4, color: '#10B981' }} /> Armazenamento:{' '}
                    <strong>Tabela `knowledge_documents`</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Atualizado em:{' '}
                    <strong>
                      {new Date(selectedDocDetail.updated_at || Date.now()).toLocaleDateString('pt-BR')}
                    </strong>
                  </span>
                  {selectedDocDetail.source_url && (
                    <>
                      <span>•</span>
                      <a
                        href={selectedDocDetail.source_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#0066CC', fontWeight: 500 }}
                      >
                        Ver no GitHub ↗
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Key Points Callout */}
              {selectedDocDetail.key_points && selectedDocDetail.key_points.length > 0 && (
                <div
                  style={{
                    background: '#FFF7ED',
                    borderLeft: '4px solid #FF774A',
                    padding: '10px 14px',
                    borderRadius: '0 6px 6px 0',
                    marginBottom: 16,
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: 12,
                      color: '#9A3412',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: 3,
                    }}
                  >
                    <CheckCircleOutlined style={{ marginRight: 5 }} /> Pontos-Chave da Especificação
                  </Text>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#7C2D12', fontSize: 12 }}>
                    {selectedDocDetail.key_points.map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: 2 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatted Markdown Content */}
              <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                <MarkdownViewer content={selectedDocDetail.content || ''} />
              </div>
            </div>
          ) : (
            <Empty description="Selecione um documento no painel lateral" />
          )}
        </Card>

        {/* Right Column: Floating Table of Contents (TOC) */}
        <div
          style={{
            position: 'sticky',
            top: 10,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Card
            size="small"
            title={
              <Space>
                <FolderOpenOutlined style={{ color: '#FF774A' }} />
                <span style={{ fontSize: 11.5, fontWeight: 600 }}>Nesta Página (TOC)</span>
              </Space>
            }
            style={{
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              maxHeight: 'calc(100vh - 160px)',
              overflowY: 'auto',
              width: '100%',
              boxSizing: 'border-box',
            }}
            styles={{ body: { padding: '8px 10px' } }}
          >
            {tableOfContents.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 11 }}>
                Sem seções identificadas.
              </Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tableOfContents.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    style={{
                      fontSize: item.level === 1 ? 11.5 : 10.5,
                      fontWeight: item.level === 1 ? 600 : 400,
                      color: item.level === 1 ? '#0F172A' : '#64748B',
                      paddingLeft: (item.level - 1) * 6,
                      textDecoration: 'none',
                      lineHeight: 1.3,
                      borderLeft: item.level === 1 ? '2px solid #FF774A' : 'none',
                      paddingTop: 1,
                      paddingBottom: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Share Document Modal */}
      <ShareDocModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        document={selectedDocDetail}
        onShareUpdated={() => {
          if (selectedDocId) {
            loadDocumentDetail(selectedDocId);
            loadDocuments();
          }
        }}
      />

      {/* Import Document Modal */}
      <ImportDocModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onImportSuccess={handleImportDocSuccess}
      />

      {/* HTTP Client Drawer */}
      <ApiClientDrawer
        visible={apiClientVisible}
        onClose={() => setApiClientVisible(false)}
        onImportToDocs={async (title, category, content, sourceUrl) => {
          const doc = await knowledgeService.createDocument({
            title,
            category,
            summary: `Especificação de API capturada via HTTP Client para ${sourceUrl || title}`,
            content,
            source_url: sourceUrl,
          });
          handleImportDocSuccess(doc);
        }}
      />
    </div>
  );
};
