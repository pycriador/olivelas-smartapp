/**
 * App Builder Engine Router & Navigation Utility
 * Synchronizes HTML5 Browser History URL with UI Store and provides deep-linking support.
 */
import { useUIStore, type ActiveView } from '@/stores/uiStore';

export interface RouteConfig {
  path: string;
  view: ActiveView;
  title: string;
}

export const ROUTES: RouteConfig[] = [
  { path: '/', view: 'landing', title: 'Loft App Builder' },
  { path: '/landing', view: 'landing', title: 'Loft App Builder' },
  { path: '/login', view: 'login', title: 'Login — Loft App Builder' },
  { path: '/dashboard', view: 'dashboard', title: 'Dashboard' },
  { path: '/workshop', view: 'workshop', title: 'Blueprint Studio' },
  { path: '/projects', view: 'projects', title: 'Projetos' },
  { path: '/blueprints', view: 'blueprints', title: 'Blueprints' },
  { path: '/catalog', view: 'catalog-hub', title: 'Catálogo de Engenharia' },
  { path: '/catalog/components', view: 'components', title: 'Componentes Copan' },
  { path: '/catalog/templates', view: 'templates', title: 'Templates de Aplicação' },
  { path: '/catalog/modules', view: 'modules', title: 'Módulos de Domínio' },
  { path: '/knowledge/rules', view: 'rules', title: 'Golden Rules' },
  { path: '/knowledge/specifications', view: 'specifications', title: 'Especificações SDD' },
  { path: '/knowledge/architectures', view: 'architectures', title: 'Arquiteturas Padrão' },
  { path: '/knowledge/docs', view: 'documentation', title: 'Documentação' },
  { path: '/ai/composer', view: 'ai-composer', title: 'AI Composer' },
  { path: '/ai/contracts', view: 'ai-contracts', title: 'Contratos OpenAPI de IA' },
  { path: '/ai/gateway', view: 'ai-gateway', title: 'AI Gateway' },
  { path: '/ai/agents', view: 'ai-agents', title: 'AI Agents' },
  { path: '/ai/providers', view: 'ai-providers', title: 'AI Providers' },
  { path: '/iam/dashboard', view: 'iam-dashboard', title: 'Painel IAM' },
  { path: '/iam/users', view: 'iam-users', title: 'Gestão de Usuários' },
  { path: '/iam/groups', view: 'iam-groups', title: 'Grupos de Acesso' },
  { path: '/iam/roles', view: 'settings', title: 'Papéis & Privilégios — Configurações' },
  { path: '/iam/matrix', view: 'settings', title: 'Matriz de Permissões — Configurações' },
  { path: '/iam/sessions', view: 'iam-sessions', title: 'Sessões Ativas' },
  { path: '/iam/invitations', view: 'iam-invitations', title: 'Convites de Acesso' },
  { path: '/iam/shares', view: 'iam-shares', title: 'Compartilhamento de Recursos' },
  { path: '/profile', view: 'profile', title: 'Meu Perfil' },
  { path: '/settings', view: 'settings', title: 'Configurações do Sistema' },
  { path: '/settings/ai', view: 'ai-providers', title: 'Provedores de IA & Modelos' },
  { path: '/settings/categories', view: 'settings', title: 'Categorias de Ativos — Configurações' },
  { path: '/settings/roles', view: 'settings', title: 'Papéis & Privilégios — Configurações' },
  { path: '/settings/matrix', view: 'settings', title: 'Matriz RBAC — Configurações' },
  { path: '/settings/permissions-matrix', view: 'settings', title: 'Matriz RBAC — Configurações' },
  { path: '/settings/system', view: 'settings', title: 'Parâmetros do Sistema — Configurações' },
  { path: '/admin/settings', view: 'settings', title: 'Configurações do Sistema' },
  { path: '/admin/users', view: 'iam-users', title: 'Usuários & RBAC' },
  { path: '/admin/roles', view: 'settings', title: 'Papéis & Permissões' },
  { path: '/admin/audit', view: 'audit', title: 'Trilha de Auditoria' },
  { path: '/platform/library-updates', view: 'library-updates', title: 'Central de Atualizações de Bibliotecas' },
];

export const VIEW_TO_PATH: Record<ActiveView, string> = {
  'landing': '/',
  'login': '/login',
  'dashboard': '/dashboard',
  'workshop': '/workshop',
  'projects': '/projects',
  'blueprints': '/blueprints',
  'catalog-hub': '/catalog',
  'components': '/catalog/components',
  'modules': '/catalog/modules',
  'templates': '/catalog/templates',
  'rules': '/knowledge/rules',
  'specifications': '/knowledge/specifications',
  'architectures': '/knowledge/architectures',
  'documentation': '/knowledge/docs',
  'ai-gateway': '/ai/gateway',
  'ai-agents': '/ai/agents',
  'ai-providers': '/ai/providers',
  'ai-composer': '/ai/composer',
  'ai-contracts': '/ai/contracts',
  'iam-dashboard': '/iam/dashboard',
  'iam-users': '/iam/users',
  'iam-groups': '/iam/groups',
  'iam-roles': '/settings/roles',
  'iam-matrix': '/settings/matrix',
  'iam-sessions': '/iam/sessions',
  'iam-invitations': '/iam/invitations',
  'iam-shares': '/iam/shares',
  'profile': '/profile',
  'rbac-users': '/iam/users',
  'rbac-roles': '/settings/roles',
  'audit': '/admin/audit',
  'settings': '/settings',
  'library-updates': '/platform/library-updates',
};


export interface ParsedRoute {
  pathname: string;
  view: ActiveView;
  query: Record<string, string>;
  entityId?: string;
  entityType?: string;
}

const BASE_PREFIX = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

function stripBasePrefix(urlPath: string): string {
  if (BASE_PREFIX && urlPath.startsWith(BASE_PREFIX)) {
    return urlPath.slice(BASE_PREFIX.length) || '/';
  }
  if (urlPath.startsWith('/olivelas-smartapp')) {
    return urlPath.slice('/olivelas-smartapp'.length) || '/';
  }
  return urlPath;
}

function withBasePrefix(routePath: string): string {
  if (!BASE_PREFIX) return routePath;
  if (routePath === '/') return `${BASE_PREFIX}/`;
  return `${BASE_PREFIX}${routePath}`;
}

export function parseRoute(urlPath: string = window.location.pathname, search: string = window.location.search): ParsedRoute {
  const stripped = stripBasePrefix(urlPath);
  const cleanPath = stripped.replace(/\/$/, '') || '/';
  const searchParams = new URLSearchParams(search);
  const query: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    query[key] = val;
  });

  // Direct match
  const found = ROUTES.find((r) => r.path === cleanPath);
  if (found) {
    return {
      pathname: cleanPath,
      view: found.view,
      query,
      entityId: query.id,
      entityType: query.type,
    };
  }

  // Check subpaths e.g. /catalog/components/comp-header
  if (cleanPath.startsWith('/catalog/components/')) {
    const id = cleanPath.replace('/catalog/components/', '');
    return { pathname: '/catalog/components', view: 'components', query: { ...query, id }, entityId: id, entityType: 'component' };
  }
  if (cleanPath.startsWith('/catalog/modules/')) {
    const id = cleanPath.replace('/catalog/modules/', '');
    return { pathname: '/catalog/modules', view: 'modules', query: { ...query, id }, entityId: id, entityType: 'module' };
  }
  if (cleanPath.startsWith('/catalog/templates/')) {
    const id = cleanPath.replace('/catalog/templates/', '');
    return { pathname: '/catalog/templates', view: 'templates', query: { ...query, id }, entityId: id, entityType: 'template' };
  }
  if (cleanPath.startsWith('/knowledge/rules/')) {
    const id = cleanPath.replace('/knowledge/rules/', '');
    return { pathname: '/knowledge/rules', view: 'rules', query: { ...query, id }, entityId: id, entityType: 'rule' };
  }
  if (cleanPath.startsWith('/knowledge/specifications/')) {
    const id = cleanPath.replace('/knowledge/specifications/', '');
    return { pathname: '/knowledge/specifications', view: 'specifications', query: { ...query, id }, entityId: id, entityType: 'specification' };
  }
  if (cleanPath.startsWith('/knowledge/architectures/')) {
    const id = cleanPath.replace('/knowledge/architectures/', '');
    return { pathname: '/knowledge/architectures', view: 'architectures', query: { ...query, id }, entityId: id, entityType: 'architecture' };
  }
  if (cleanPath.startsWith('/knowledge/docs/')) {
    const id = cleanPath.replace('/knowledge/docs/', '');
    return { pathname: '/knowledge/docs', view: 'documentation', query: { ...query, id }, entityId: id, entityType: 'document' };
  }
  if (cleanPath.startsWith('/projects/')) {
    const id = cleanPath.replace('/projects/', '');
    return { pathname: '/projects', view: 'projects', query: { ...query, id }, entityId: id, entityType: 'project' };
  }
  if (cleanPath.startsWith('/blueprints/')) {
    const id = cleanPath.replace('/blueprints/', '');
    return { pathname: '/blueprints', view: 'blueprints', query: { ...query, id }, entityId: id, entityType: 'blueprint' };
  }
  if (cleanPath.startsWith('/settings/')) {
    const tab = cleanPath.replace('/settings/', '');
    return { pathname: cleanPath, view: 'settings', query: { ...query, tab } };
  }

  // Fallback
  return {
    pathname: '/dashboard',
    view: 'dashboard',
    query,
  };
}

/**
 * Navigate to a specific view or URL path, updating browser history and UI state.
 */
export function navigateTo(target: ActiveView | string, queryParams?: Record<string, string>, replace: boolean = false) {
  let targetPath = target;
  let viewName: ActiveView = 'dashboard';

  if (target in VIEW_TO_PATH) {
    viewName = target as ActiveView;
    targetPath = VIEW_TO_PATH[viewName];
  } else {
    const matched = ROUTES.find((r) => r.path === target);
    if (matched) {
      viewName = matched.view;
      targetPath = matched.path;
    } else {
      const parsed = parseRoute(target);
      viewName = parsed.view;
      targetPath = parsed.pathname;
    }
  }

  let finalUrl = withBasePrefix(targetPath);
  if (queryParams && Object.keys(queryParams).length > 0) {
    const sp = new URLSearchParams(queryParams);
    finalUrl += `?${sp.toString()}`;
  }

  if (window.location.pathname + window.location.search !== finalUrl) {
    if (replace) {
      window.history.replaceState({ view: viewName }, '', finalUrl);
    } else {
      window.history.pushState({ view: viewName }, '', finalUrl);
    }
  }

  // Update UI store
  const store = useUIStore.getState();
  store.setActiveView(viewName);

  if (queryParams?.id && queryParams?.type) {
    store.openInspector360(queryParams.type, queryParams.id);
  }

  // Dispatch custom route change event for components
  window.dispatchEvent(new CustomEvent('app-route-change', { detail: { view: viewName, url: finalUrl } }));
}
