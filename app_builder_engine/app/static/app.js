/**
 * App Builder Engine — Frontend Application Controller (Olivelas Copan Portal Standard)
 * Features: Core Catalog, 360° Building Blocks Inspector, Interactive Blueprint Workshop & CRUD
 */

// Application State
const state = {
  currentView: 'dashboard',
  metrics: null,
  projects: [],
  blueprints: [],
  components: [],
  templates: [],
  modules: [],
  rules: [],
  architectures: [],
  specifications: [],
  auditLogs: [],
  selectedBlueprint: null,
  activeBlueprintTab: 'overview',
  active360Tab: 'what_is_it',
  current360Data: null,
  // Blueprint Workshop State
  workshop: {
    name: 'Olivelas Partner Portal',
    description: 'Portal de relacionamento com corretores e imobiliárias parceiras da Olivelas.',
    architectureId: 'arch_loft_standard_fullstack',
    projectId: '',
    selectedModules: ['mod_layout_navigation', 'mod_data_table_filtering'],
    selectedComponents: ['cmp_fe_app_shell', 'cmp_fe_page_header', 'cmp_fe_data_table'],
    selectedTemplates: [],
  }
};

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initKeyboardShortcuts();
  navigateTo('dashboard');
  refreshBadges();
});

// Toast notification helper following Copan semantics
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const styles = {
    success: 'bg-[#E8F5F0] border-[#A2DEC9] text-[#115644]',
    error: 'bg-[#FDECEC] border-[#F7C2C2] text-[#991818]',
    info: 'bg-white border-[#E1E9EF] text-[#121619] shadow-lg',
  };
  toast.className = `p-3.5 rounded-lg border text-xs shadow-md flex items-center gap-2.5 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto ${styles[type] || styles.info}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle-2' : type === 'error' ? 'alert-triangle' : 'info'}" class="w-4 h-4 shrink-0 ${type === 'success' ? 'text-[#20A483]' : type === 'error' ? 'text-[#CE4242]' : 'text-[#F56738]'}"></i>
    <span class="font-medium">${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Router and Navigation
function navigateTo(viewName) {
  state.currentView = viewName;

  // Update sidebar active classes
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.dataset.target === viewName) {
      el.classList.add('active-nav');
    } else {
      el.classList.remove('active-nav');
    }
  });

  // Update Breadcrumb
  const breadcrumbActive = document.getElementById('breadcrumb-active');
  const viewTitles = {
    dashboard: 'Dashboard',
    projects: 'Projetos',
    blueprints: 'Blueprints',
    'workspace-blueprint-builder': 'Workspace de Engenharia / Blueprint Workshop',
    'catalog-components': 'Catálogo / Componentes Copan',
    'catalog-modules': 'Catálogo / Módulos de Negócio',
    'catalog-templates': 'Catálogo / Templates',
    'catalog-integrations': 'Catálogo / Integrações',
    'knowledge-specifications': 'Conhecimento / Especificações (SDDs)',
    'knowledge-rules': 'Conhecimento / Golden Rules',
    'knowledge-architectures': 'Conhecimento / Arquiteturas',
    'ai-composer': 'Agentes de IA / Simulador de Blueprint',
    'ai-api-access': 'Agentes de IA / Contratos de API',
    'admin-audit': 'Governança / Trilha de Auditoria',
  };
  breadcrumbActive.textContent = viewTitles[viewName] || viewName;

  // Render View
  const container = document.getElementById('view-container');
  renderView(viewName, container);
}

// Global Badges Refresh
async function refreshBadges() {
  try {
    const res = await fetch('/api/v1/dashboard/metrics');
    if (res.ok) {
      const data = await res.json();
      state.metrics = data;
      const elProj = document.getElementById('badge-projects');
      const elBp = document.getElementById('badge-blueprints');
      const elComp = document.getElementById('badge-components');
      const elRules = document.getElementById('badge-rules');
      const elSpecs = document.getElementById('badge-specs');
      if (elProj) elProj.textContent = data.projects_count;
      if (elBp) elBp.textContent = data.blueprints_count;
      if (elComp) elComp.textContent = data.components_count;
      if (elRules) elRules.textContent = data.rules_count;
      if (elSpecs) elSpecs.textContent = data.specifications_count;
    }
  } catch (err) {
    console.error('Failed to load metrics:', err);
  }
}

// View Dispatcher
function renderView(viewName, container) {
  switch (viewName) {
    case 'dashboard':
      renderDashboardView(container);
      break;
    case 'projects':
      renderProjectsView(container);
      break;
    case 'blueprints':
      renderBlueprintsView(container);
      break;
    case 'workspace-blueprint-builder':
      renderBlueprintWorkshopView(container);
      break;
    case 'catalog-components':
      renderComponentsView(container);
      break;
    case 'catalog-modules':
      renderModulesView(container);
      break;
    case 'catalog-templates':
      renderTemplatesView(container);
      break;
    case 'catalog-integrations':
      renderComingSoonView(container, viewName);
      break;
    case 'knowledge-specifications':
      renderSpecificationsView(container);
      break;
    case 'knowledge-rules':
      renderRulesView(container);
      break;
    case 'knowledge-architectures':
      renderArchitecturesView(container);
      break;
    case 'ai-composer':
      renderAIComposerView(container);
      break;
    case 'ai-api-access':
      renderAIApiAccessView(container);
      break;
    case 'admin-audit':
      renderAuditLogsView(container);
      break;
    default:
      container.innerHTML = `<div class="p-8 text-center text-[#697077]">Página em construção...</div>`;
  }
  lucide.createIcons();
}

// ---------------------------------------------------------------------------
// 1. DASHBOARD VIEW (COPAN PORTAL STYLE)
// ---------------------------------------------------------------------------
async function renderDashboardView(container) {
  container.innerHTML = `
    <!-- Page Header (Copan Standard) -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Engineering Workspace & Catalog</h1>
        <p class="text-xs text-[#697077] mt-0.5">Central de controle de conhecimento, componentes Copan e blueprints para agentes de IA.</p>
      </div>
      <div class="flex items-center gap-2.5">
        <button onclick="navigateTo('workspace-blueprint-builder')" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm">
          <i data-lucide="hammer" class="w-4 h-4"></i>
          <span>Blueprint Workshop</span>
        </button>
        <button onclick="openCreateProjectModal()" class="btn-copan-secondary px-4 py-2 text-xs flex items-center gap-1.5">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Novo Projeto</span>
        </button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div id="dashboard-metrics-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      ${renderMetricsSkeleton()}
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Quick Actions -->
      <div class="copan-card p-5 space-y-3.5">
        <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-3">
          <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077]">Ações Rápidas</h2>
          <i data-lucide="zap" class="w-4 h-4 text-[#F56738]"></i>
        </div>
        <div class="grid grid-cols-1 gap-2 text-xs">
          <button onclick="navigateTo('workspace-blueprint-builder')" class="p-3 rounded-lg bg-[#FFF2EC] hover:bg-[#FFD9C7]/80 text-left flex items-center justify-between group transition-all border border-[#FFD9C7]">
            <div class="flex items-center gap-2.5">
              <i data-lucide="hammer" class="w-4 h-4 text-[#F56738]"></i>
              <span class="font-bold text-[#121619]">Montar Blueprint no Workshop</span>
            </div>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-[#F56738] group-hover:translate-x-0.5 transition-transform"></i>
          </button>
          <button onclick="openCreateProjectModal()" class="p-3 rounded-lg bg-[#F2F4F8] hover:bg-[#E1E9EF]/60 text-left flex items-center justify-between group transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="folder-plus" class="w-4 h-4 text-[#387BA8]"></i>
              <span class="font-medium text-[#121619]">Criar Novo Projeto</span>
            </div>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-[#878D96] group-hover:translate-x-0.5 transition-transform"></i>
          </button>
          <button onclick="openCommandPalette()" class="p-3 rounded-lg bg-[#F2F4F8] hover:bg-[#E1E9EF]/60 text-left flex items-center justify-between group transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="search" class="w-4 h-4 text-[#20A483]"></i>
              <span class="font-medium text-[#121619]">Buscar na Base Técnica</span>
            </div>
            <kbd class="px-1.5 text-[10px] bg-white text-[#697077] border border-[#E1E9EF] rounded shadow-2xs">⌘K</kbd>
          </button>
          <button onclick="navigateTo('knowledge-rules')" class="p-3 rounded-lg bg-[#F2F4F8] hover:bg-[#E1E9EF]/60 text-left flex items-center justify-between group transition-all">
            <div class="flex items-center gap-2.5">
              <i data-lucide="shield-check" class="w-4 h-4 text-[#BD7B00]"></i>
              <span class="font-medium text-[#121619]">Explorar Golden Rules</span>
            </div>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-[#878D96] group-hover:translate-x-0.5 transition-transform"></i>
          </button>
        </div>
      </div>

      <!-- Recent Platform Activity Feed -->
      <div class="lg:col-span-2 copan-card p-5 space-y-3.5">
        <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077]">Atividades Recentes</h2>
            <span class="badge-status badge-informative">Trilha de Auditoria</span>
          </div>
          <button onclick="navigateTo('admin-audit')" class="text-xs text-[#F56738] font-medium hover:underline flex items-center gap-1">
            <span>Ver tudo</span>
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <div id="dashboard-activity-list" class="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
          <div class="p-4 text-center text-[#697077]">Carregando atividades...</div>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();

  // Load Metrics
  fetch('/api/v1/dashboard/metrics')
    .then(r => r.json())
    .then(d => {
      state.metrics = d;
      const grid = document.getElementById('dashboard-metrics-grid');
      if (grid) {
        grid.innerHTML = `
          ${renderMetricCard('Projetos', d.projects_count, 'folder-kanban', 'text-[#387BA8]', () => navigateTo('projects'))}
          ${renderMetricCard('Blueprints', d.blueprints_count, 'file-code-2', 'text-[#F56738]', () => navigateTo('blueprints'))}
          ${renderMetricCard('Componentes', d.components_count, 'boxes', 'text-[#BD7B00]', () => navigateTo('catalog-components'))}
          ${renderMetricCard('Módulos', d.modules_count || 5, 'package', 'text-[#20A483]', () => navigateTo('catalog-modules'))}
          ${renderMetricCard('Golden Rules', d.rules_count, 'shield-check', 'text-[#991818]', () => navigateTo('knowledge-rules'))}
          ${renderMetricCard('SDDs & Specs', d.specifications_count, 'book-open', 'text-[#387BA8]', () => navigateTo('knowledge-specifications'))}
        `;
        lucide.createIcons();
      }
    });

  // Load Activity
  fetch('/api/v1/dashboard/activity?limit=8')
    .then(r => r.json())
    .then(acts => {
      const list = document.getElementById('dashboard-activity-list');
      if (!list) return;
      if (acts.length === 0) {
        list.innerHTML = `<div class="p-6 text-center text-[#697077]">Nenhuma atividade recente registrada.</div>`;
        return;
      }
      list.innerHTML = acts.map(a => `
        <div class="p-3 rounded-lg bg-[#F2F4F8]/80 border border-[#E1E9EF] flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-md bg-white border border-[#E1E9EF] flex items-center justify-center shrink-0 shadow-2xs">
              <i data-lucide="${getActivityIcon(a.action)}" class="w-4 h-4 text-[#697077]"></i>
            </div>
            <div>
              <div class="font-medium text-[#121619]">${a.summary}</div>
              <div class="text-[11px] text-[#697077]">${a.user_email} • ${formatDate(a.timestamp)}</div>
            </div>
          </div>
          <span class="badge-status ${a.result === 'SUCCESS' ? 'badge-ready' : 'badge-deprecated'}">${a.result}</span>
        </div>
      `).join('');
      lucide.createIcons();
    });
}

function renderMetricsSkeleton() {
  return Array(6).fill(0).map(() => `
    <div class="copan-card p-4 animate-pulse">
      <div class="h-3 bg-[#E1E9EF] rounded w-16 mb-2"></div>
      <div class="h-7 bg-[#E1E9EF] rounded w-12"></div>
    </div>
  `).join('');
}

function renderMetricCard(title, count, icon, iconColor, onClick) {
  return `
    <div onclick="(${onClick.toString()})()" class="copan-card p-4 hover:border-[#CBD5E1] cursor-pointer transition-all">
      <div class="flex items-center justify-between text-[#697077] mb-1.5">
        <span class="text-xs font-medium">${title}</span>
        <i data-lucide="${icon}" class="w-4 h-4 ${iconColor}"></i>
      </div>
      <div class="text-2xl font-bold text-[#121619] tracking-tight">${count}</div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 2. 360° KNOWLEDGE GRAPH INSPECTOR (ANSWERS THE 7 FUNDAMENTAL QUESTIONS)
// ---------------------------------------------------------------------------
async function inspectEntity360(entityType, entityId) {
  try {
    const res = await fetch(`/api/v1/relations/${entityType}/${entityId}`);
    if (!res.ok) throw new Error('Não foi possível carregar as relações da entidade');
    const data = await res.json();
    state.current360Data = data;
    state.active360Tab = 'what_is_it';
    render360Modal(data);
  } catch (err) {
    showToast(`Erro ao carregar detalhes 360° de ${entityId}`, 'error');
  }
}

function render360Modal(data) {
  const modal = document.getElementById('generic-modal');
  const content = document.getElementById('generic-modal-content');

  content.innerHTML = `
    <!-- Modal Header -->
    <div class="flex items-start justify-between border-b border-[#E1E9EF] pb-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-lg bg-[#FFF2EC] text-[#F56738] border border-[#FFD9C7] flex items-center justify-center font-bold">
          <i data-lucide="${getEntityIcon(data.type)}" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-[#121619]">${data.name}</h2>
            <span class="badge-status ${data.status === 'Published' ? 'badge-ready' : data.status === 'Deprecated' ? 'badge-deprecated' : 'badge-draft'}">${data.status}</span>
            <span class="text-[11px] font-mono text-[#878D96]">v${data.version}</span>
          </div>
          <div class="text-[11px] text-[#697077] font-mono mt-0.5">ID: ${data.id} • Tipo: ${data.type} ${data.category ? `• ${data.category}` : ''}</div>
        </div>
      </div>
      <button onclick="closeGenericModal()" class="p-1.5 rounded-lg text-[#878D96] hover:text-[#121619] hover:bg-[#F2F4F8]">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- 7 Questions Tabs Bar -->
    <div class="flex items-center gap-1 border-b border-[#E1E9EF] pb-2 text-xs overflow-x-auto">
      ${[
        { key: 'what_is_it', label: '1. O que é?', icon: 'info' },
        { key: 'what_is_it_for', label: '2. Para que serve?', icon: 'target' },
        { key: 'dependencies', label: `3. Dependências (${data.dependencies.length})`, icon: 'link' },
        { key: 'where_used', label: `4. Onde é utilizado (${data.where_used.length})`, icon: 'network' },
        { key: 'rules', label: `5. Regras (${data.associated_rules.length})`, icon: 'shield-check' },
        { key: 'specs', label: `6. SDDs / Specs (${data.associated_specs.length})`, icon: 'book-open' },
        { key: 'lifecycle', label: '7. Versão & Ciclo', icon: 'history' },
      ].map(t => `
        <button onclick="switch360Tab('${t.key}')" class="px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${state.active360Tab === t.key ? 'bg-[#FFF2EC] text-[#F56738] border border-[#FFD9C7] font-semibold' : 'text-[#697077] hover:text-[#121619] hover:bg-[#F2F4F8]'}">
          <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
          <span>${t.label}</span>
        </button>
      `).join('')}
    </div>

    <!-- Tab Content Body -->
    <div class="mt-4 text-xs min-h-[260px]">
      ${render360TabContent(data, state.active360Tab)}
    </div>

    <!-- Footer Actions -->
    <div class="mt-6 pt-4 border-t border-[#E1E9EF] flex items-center justify-between text-xs">
      <div class="text-[11px] text-[#697077]">Ativo de Engenharia certificado pelo Copan Design System</div>
      <div class="flex items-center gap-2">
        <button onclick="copyEntityReference('${data.type}', '${data.id}')" class="btn-copan-secondary px-3.5 py-1.5 flex items-center gap-1.5 font-medium">
          <i data-lucide="copy" class="w-3.5 h-3.5"></i>
          <span>Copiar Referência</span>
        </button>
        <button onclick="closeGenericModal()" class="btn-copan-primary px-4 py-1.5 font-medium">
          Fechar
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function switch360Tab(tabKey) {
  state.active360Tab = tabKey;
  if (state.current360Data) {
    render360Modal(state.current360Data);
  }
}

function render360TabContent(data, tabKey) {
  switch (tabKey) {
    case 'what_is_it':
      return `
        <div class="space-y-4">
          <div class="bg-[#F2F4F8] p-4 rounded-lg border border-[#E1E9EF] space-y-2">
            <h3 class="font-bold text-[#121619] text-sm">${data.name}</h3>
            <p class="text-[#5A6A75] leading-relaxed">${data.description || 'Sem descrição cadastrada.'}</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-white p-3 rounded-lg border border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block">Tipo</span>
              <span class="font-semibold text-[#121619]">${data.type}</span>
            </div>
            <div class="bg-white p-3 rounded-lg border border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block">Categoria</span>
              <span class="font-semibold text-[#121619]">${data.category || 'Geral'}</span>
            </div>
            <div class="bg-white p-3 rounded-lg border border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block">Status</span>
              <span class="badge-status ${data.status === 'Published' ? 'badge-ready' : 'badge-deprecated'}">${data.status}</span>
            </div>
            <div class="bg-white p-3 rounded-lg border border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block">Versão SemVer</span>
              <span class="font-mono font-semibold text-[#121619]">v${data.version}</span>
            </div>
          </div>
          ${data.tags && data.tags.length > 0 ? `
            <div>
              <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1.5">Tags & Classificação</span>
              <div class="flex flex-wrap gap-1.5">
                ${data.tags.map(t => `<span class="px-2.5 py-1 rounded-full bg-[#F2F4F8] text-[#5A6A75] text-[10px] border border-[#E1E9EF] font-medium">#${t}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

    case 'what_is_it_for':
      return `
        <div class="space-y-4">
          <p class="text-[#5A6A75]">${data.what_is_it_for.description || data.description}</p>
          
          ${data.what_is_it_for.characteristics ? `
            <div class="p-3.5 rounded-lg bg-[#F2F4F8] border border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1.5">Características Arquiteturais</span>
              <ul class="list-disc list-inside text-[#5A6A75] space-y-1">
                ${data.what_is_it_for.characteristics.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${data.what_is_it_for.interface_spec ? `
            <div>
              <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1">Contrato de Interface / Props</span>
              <pre class="p-3 bg-[#121619] border border-[#E1E9EF] rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">${data.what_is_it_for.interface_spec}</pre>
            </div>
          ` : ''}

          ${data.what_is_it_for.example_usage ? `
            <div>
              <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1">Exemplo Canônico de Utilização</span>
              <pre class="p-3 bg-[#121619] border border-[#E1E9EF] rounded-lg text-[#FFA782] font-mono text-[11px] overflow-x-auto">${data.what_is_it_for.example_usage}</pre>
            </div>
          ` : ''}
        </div>
      `;

    case 'dependencies':
      return `
        <div class="space-y-3">
          <div class="text-[#5A6A75]">Recursos e pacotes dos quais este ativo depende para funcionar corretamente:</div>
          ${data.dependencies.length === 0 ? `
            <div class="p-6 text-center text-[#878D96] bg-[#F2F4F8] rounded-lg border border-[#E1E9EF]">Este ativo não possui dependências externas ou de outros módulos.</div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${data.dependencies.map(d => `
                <div class="p-3 rounded-lg bg-[#F2F4F8] border border-[#E1E9EF] flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <i data-lucide="link" class="w-4 h-4 text-[#387BA8]"></i>
                    <div>
                      <div class="font-bold text-[#121619]">${d.name}</div>
                      <div class="text-[10px] text-[#697077] font-mono">${d.type}</div>
                    </div>
                  </div>
                  ${d.id.startsWith('comp-') || d.id.startsWith('mod-') ? `
                    <button onclick="inspectEntity360('${d.id.startsWith('comp-') ? 'component' : 'module'}', '${d.id}')" class="btn-copan-secondary px-2.5 py-1 text-[10px]">
                      Inspecionar
                    </button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

    case 'where_used':
      return `
        <div class="space-y-3">
          <div class="text-[#5A6A75]">Mapeamento de uso reverso (*Reverse Dependencies*) na plataforma:</div>
          ${data.where_used.length === 0 ? `
            <div class="p-6 text-center text-[#878D96] bg-[#F2F4F8] rounded-lg border border-[#E1E9EF]">Nenhum template, blueprint ou módulo ativo está referenciando este ativo no momento.</div>
          ` : `
            <div class="space-y-2">
              ${data.where_used.map(u => `
                <div class="p-3 rounded-lg bg-white border border-[#E1E9EF] flex items-center justify-between hover:border-[#CBD5E1] transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="badge-status badge-informative">${u.type}</span>
                    <div>
                      <div class="font-bold text-[#121619]">${u.name}</div>
                      <div class="text-[11px] text-[#697077]">${u.relationship}</div>
                    </div>
                  </div>
                  <button onclick="handleWhereUsedClick('${u.type}', '${u.id}')" class="btn-copan-secondary px-3 py-1.5 text-xs flex items-center gap-1">
                    <span>Ver</span>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

    case 'rules':
      return `
        <div class="space-y-3">
          <div class="text-[#5A6A75]">Golden Rules e diretrizes mandatórias aplicadas a este ativo:</div>
          ${data.associated_rules.length === 0 ? `
            <div class="p-6 text-center text-[#878D96] bg-[#F2F4F8] rounded-lg border border-[#E1E9EF]">Nenhuma regra específica associada diretamente.</div>
          ` : `
            <div class="space-y-2.5">
              ${data.associated_rules.map(r => `
                <div class="p-3.5 rounded-lg bg-[#F2F4F8] border border-[#E1E9EF] space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="badge-status ${r.priority === 'Required' ? 'badge-required' : 'badge-recommended'}">${r.priority}</span>
                      <span class="font-bold text-[#121619]">${r.name}</span>
                    </div>
                    <span class="text-[10px] font-mono text-[#878D96]">${r.id}</span>
                  </div>
                  ${r.good_example ? `
                    <pre class="p-2.5 bg-[#E8F5F0] border border-[#A2DEC9] rounded text-[#115644] font-mono text-[10px] overflow-x-auto">${r.good_example}</pre>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

    case 'specs':
      return `
        <div class="space-y-3">
          <div class="text-[#5A6A75]">Software Design Documents (SDDs) e especificações canônicas vinculadas:</div>
          ${data.associated_specs.length === 0 ? `
            <div class="p-6 text-center text-[#878D96] bg-[#F2F4F8] rounded-lg border border-[#E1E9EF]">Nenhuma especificação diretamente indexada.</div>
          ` : `
            <div class="space-y-2">
              ${data.associated_specs.map(s => `
                <div class="p-3 rounded-lg bg-white border border-[#E1E9EF] flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <i data-lucide="book-open" class="w-4 h-4 text-[#F56738]"></i>
                    <div>
                      <div class="font-bold text-[#121619]">${s.name}</div>
                      <div class="text-[10px] text-[#697077]">${s.category || 'SDD'}</div>
                    </div>
                  </div>
                  <button onclick="viewSpecContent('${s.id}')" class="btn-copan-secondary px-3 py-1.5 text-xs">
                    Ler Documento
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

    case 'lifecycle':
      return `
        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-[#F2F4F8] border border-[#E1E9EF] flex items-center justify-between">
            <div>
              <div class="text-[10px] text-[#697077] uppercase font-bold">Estado Atual</div>
              <div class="text-base font-bold text-[#121619] mt-0.5">${data.status}</div>
            </div>
            <div class="flex items-center gap-2">
              ${data.status === 'Published' ? `
                <button onclick="deprecateEntityAction('${data.type}', '${data.id}')" class="btn-copan-secondary text-[#991818] px-3.5 py-1.5 font-medium hover:bg-[#FDECEC]">
                  Descontinuar Ativo
                </button>
              ` : `
                <button onclick="publishEntityAction('${data.type}', '${data.id}')" class="btn-copan-primary px-3.5 py-1.5 font-medium">
                  Publicar Ativo
                </button>
              `}
            </div>
          </div>

          <div>
            <span class="text-[10px] text-[#697077] uppercase font-bold block mb-2">Histórico de Versões SemVer</span>
            <div class="space-y-2">
              <div class="p-3 bg-white border border-[#E1E9EF] rounded-lg flex items-center justify-between">
                <div>
                  <div class="font-mono font-bold text-[#121619]">v${data.version} (Versão Ativa)</div>
                  <div class="text-[11px] text-[#697077]">Padrão canônico indexado na base do Copan Design System</div>
                </div>
                <span class="badge-status badge-ready">Ativa</span>
              </div>
            </div>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

function handleWhereUsedClick(type, id) {
  closeGenericModal();
  if (type === 'Blueprint') viewBlueprintById(id);
  else if (type === 'Module') inspectEntity360('module', id);
  else if (type === 'Template') inspectEntity360('template', id);
  else if (type === 'Project') navigateTo('projects');
}

function copyEntityReference(type, id) {
  navigator.clipboard.writeText(`${type}:${id}`);
  showToast(`Referência ${type}:${id} copiada!`, 'info');
}

async function publishEntityAction(type, id) {
  const endpoint = type.toLowerCase() === 'component' ? `/api/v1/components/${id}/publish` : `/api/v1/${type.toLowerCase()}s/${id}`;
  await fetch(endpoint, { method: 'POST' });
  showToast(`${type} publicado com sucesso!`, 'success');
  inspectEntity360(type, id);
  refreshBadges();
}

async function deprecateEntityAction(type, id) {
  const endpoint = type.toLowerCase() === 'component' ? `/api/v1/components/${id}/deprecate` : `/api/v1/${type.toLowerCase()}s/${id}`;
  await fetch(endpoint, { method: 'POST' });
  showToast(`${type} descontinuado.`, 'info');
  inspectEntity360(type, id);
  refreshBadges();
}

// ---------------------------------------------------------------------------
// 3. INTERACTIVE BLUEPRINT WORKSHOP / BUILDER STUDIO
// ---------------------------------------------------------------------------
async function renderBlueprintWorkshopView(container) {
  container.innerHTML = `
    <!-- Workshop Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Blueprint Workshop Studio</h1>
          <span class="badge-status badge-informative font-mono">Building Block Composer</span>
        </div>
        <p class="text-xs text-[#697077] mt-0.5">Monte visualmente especificações de engenharia e blueprints combinando blocos reutilizáveis do Copan.</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="resetWorkshopState()" class="btn-copan-secondary px-3.5 py-2 text-xs">
          Limpar Seleção
        </button>
        <button onclick="executeWorkshopBlueprintBuild()" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          <span>Construir Blueprint</span>
        </button>
      </div>
    </div>

    <!-- Workshop Canvas Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Controls & Block Selectors -->
      <div class="lg:col-span-2 space-y-5">
        
        <!-- Step 1: General Info -->
        <div class="copan-card p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077] flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-[#FFF2EC] text-[#F56738] flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Identificação da Aplicação</span>
            </h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-xs font-semibold text-[#121619] mb-1">Nome da Aplicação *</label>
              <input id="workshop-app-name" type="text" value="${state.workshop.name}" oninput="state.workshop.name = this.value; updateWorkshopLivePreview();" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-xs text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#121619] mb-1">Arquitetura Alvo</label>
              <select id="workshop-app-arch" onchange="state.workshop.architectureId = this.value; updateWorkshopLivePreview();" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-xs text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs">
                <option value="arch-modular-monolith" selected>Modular Monolith (Recomendado Olivelas)</option>
                <option value="arch-layered-api">Layered Architecture (FastAPI + React Copan)</option>
                <option value="arch-event-driven">Event Driven</option>
                <option value="arch-microservices">Microservices</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#121619] mb-1">Descrição & Objetivo de Negócio</label>
            <input id="workshop-app-desc" type="text" value="${state.workshop.description}" oninput="state.workshop.description = this.value; updateWorkshopLivePreview();" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-xs text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
          </div>
        </div>

        <!-- Step 2: Select Business Modules -->
        <div class="copan-card p-5 space-y-3.5">
          <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077] flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-[#FFF2EC] text-[#F56738] flex items-center justify-center text-[11px] font-bold">2</span>
              <span>Módulos de Negócio</span>
            </h2>
            <span class="text-[11px] text-[#697077]">Selecione os módulos necessários</span>
          </div>
          <div id="workshop-modules-selector" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="p-4 text-center text-xs text-[#697077]">Carregando módulos...</div>
          </div>
        </div>

        <!-- Step 3: Select Copan UI Components -->
        <div class="copan-card p-5 space-y-3.5">
          <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077] flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-[#FFF2EC] text-[#F56738] flex items-center justify-center text-[11px] font-bold">3</span>
              <span>Componentes Copan Adicionais</span>
            </h2>
            <span class="text-[11px] text-[#697077]">Interface & Visual</span>
          </div>
          <div id="workshop-components-selector" class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div class="p-4 text-center text-xs text-[#697077]">Carregando componentes...</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Live Resolution & Dependency Graph Preview -->
      <div class="space-y-5">
        <div class="copan-card p-5 space-y-4 sticky top-4">
          <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077]">Grafo Resolvido em Tempo Real</h2>
            <span class="badge-status badge-ready">Ativo</span>
          </div>

          <div id="workshop-live-summary" class="space-y-3 text-xs">
            <!-- Dynamic Preview -->
          </div>

          <div class="pt-3 border-t border-[#E1E9EF] space-y-2">
            <button onclick="executeWorkshopBlueprintBuild()" class="btn-copan-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-sm font-semibold">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Gerar Blueprint & Salvar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();

  // Load available modules & components
  loadWorkshopSelectors();
}

async function loadWorkshopSelectors() {
  const [resMods, resComps] = await Promise.all([
    fetch('/api/v1/modules').then(r => r.json()),
    fetch('/api/v1/components').then(r => r.json()),
  ]);

  state.modules = resMods.data || [];
  state.components = resComps.data || [];

  const modContainer = document.getElementById('workshop-modules-selector');
  const compContainer = document.getElementById('workshop-components-selector');

  if (modContainer) {
    modContainer.innerHTML = state.modules.map(m => {
      const isChecked = state.workshop.selectedModules.includes(m.id);
      return `
        <label class="p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-all ${isChecked ? 'bg-[#FFF2EC]/60 border-[#F56738]' : 'bg-[#F2F4F8] border-[#E1E9EF] hover:border-[#CBD5E1]'}">
          <input type="checkbox" value="${m.id}" ${isChecked ? 'checked' : ''} onchange="toggleWorkshopModule('${m.id}')" class="mt-0.5 rounded text-[#F56738] focus:ring-[#F56738]" />
          <div class="flex-1 min-w-0">
            <div class="font-bold text-[#121619] text-xs truncate">${m.name}</div>
            <div class="text-[11px] text-[#697077] line-clamp-1">${m.description}</div>
          </div>
        </label>
      `;
    }).join('');
  }

  if (compContainer) {
    compContainer.innerHTML = state.components.map(c => {
      const isChecked = state.workshop.selectedComponents.includes(c.id);
      return `
        <label class="p-2.5 rounded-lg border cursor-pointer flex items-start gap-2 transition-all ${isChecked ? 'bg-[#FFF2EC]/60 border-[#F56738]' : 'bg-[#F2F4F8] border-[#E1E9EF] hover:border-[#CBD5E1]'}">
          <input type="checkbox" value="${c.id}" ${isChecked ? 'checked' : ''} onchange="toggleWorkshopComponent('${c.id}')" class="mt-0.5 rounded text-[#F56738] focus:ring-[#F56738]" />
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-[#121619] text-xs truncate">${c.name}</div>
            <div class="text-[10px] text-[#697077]">${c.category}</div>
          </div>
        </label>
      `;
    }).join('');
  }

  updateWorkshopLivePreview();
}

function toggleWorkshopModule(modId) {
  if (state.workshop.selectedModules.includes(modId)) {
    state.workshop.selectedModules = state.workshop.selectedModules.filter(id => id !== modId);
  } else {
    state.workshop.selectedModules.push(modId);
  }
  loadWorkshopSelectors();
}

function toggleWorkshopComponent(compId) {
  if (state.workshop.selectedComponents.includes(compId)) {
    state.workshop.selectedComponents = state.workshop.selectedComponents.filter(id => id !== compId);
  } else {
    state.workshop.selectedComponents.push(compId);
  }
  loadWorkshopSelectors();
}

function updateWorkshopLivePreview() {
  const container = document.getElementById('workshop-live-summary');
  if (!container) return;

  const modCount = state.workshop.selectedModules.length;
  const compCount = state.workshop.selectedComponents.length;

  container.innerHTML = `
    <div class="p-3 bg-[#F2F4F8] rounded-lg border border-[#E1E9EF] space-y-1">
      <div class="font-bold text-[#121619]">${state.workshop.name || 'Nova Aplicação'}</div>
      <div class="text-[11px] text-[#5A6A75]">${state.workshop.architectureId}</div>
    </div>

    <div class="grid grid-cols-2 gap-2 text-center text-xs">
      <div class="p-2.5 bg-[#F2F4F8] border border-[#E1E9EF] rounded-lg">
        <span class="block text-base font-bold text-[#121619]">${modCount}</span>
        <span class="text-[10px] text-[#697077]">Módulos</span>
      </div>
      <div class="p-2.5 bg-[#F2F4F8] border border-[#E1E9EF] rounded-lg">
        <span class="block text-base font-bold text-[#121619]">${compCount}</span>
        <span class="text-[10px] text-[#697077]">Componentes</span>
      </div>
    </div>

    <div>
      <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1">Golden Rules Injetadas</span>
      <div class="space-y-1">
        <div class="p-1.5 rounded bg-[#E8F5F0] text-[#115644] text-[10px] border border-[#A2DEC9] flex items-center gap-1.5 font-medium">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#20A483]"></i>
          <span>Copan Design System (Olivelas UI Inter + #F56738)</span>
        </div>
        <div class="p-1.5 rounded bg-[#E8F5F0] text-[#115644] text-[10px] border border-[#A2DEC9] flex items-center gap-1.5 font-medium">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#20A483]"></i>
          <span>API Security & Zero-Trust Validation</span>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function resetWorkshopState() {
  state.workshop.selectedModules = [];
  state.workshop.selectedComponents = [];
  loadWorkshopSelectors();
  showToast('Seleção limpa', 'info');
}

async function executeWorkshopBlueprintBuild() {
  const appName = document.getElementById('workshop-app-name')?.value || state.workshop.name;
  const appDesc = document.getElementById('workshop-app-desc')?.value || state.workshop.description;
  const archId = document.getElementById('workshop-app-arch')?.value || state.workshop.architectureId;

  if (!appName) {
    showToast('Informe o nome da aplicação', 'error');
    return;
  }

  try {
    const res = await fetch('/api/v1/blueprints/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: appName,
        description: appDesc,
        architecture_id: archId,
        module_ids: state.workshop.selectedModules,
        component_ids: state.workshop.selectedComponents,
        template_ids: state.workshop.selectedTemplates,
      }),
    });

    if (!res.ok) throw new Error('Erro na construção do blueprint');
    const bp = await res.json();
    showToast('Blueprint construído com sucesso!', 'success');
    refreshBadges();
    viewBlueprintById(bp.id);
  } catch (err) {
    showToast('Erro ao construir blueprint', 'error');
  }
}

// ---------------------------------------------------------------------------
// 4. PROJECTS VIEW & CRUD
// ---------------------------------------------------------------------------
async function renderProjectsView(container) {
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Projetos de Aplicações</h1>
        <p class="text-xs text-[#697077] mt-0.5">Aplicações sendo planejadas e arquitetadas com base no padrão Copan.</p>
      </div>
      <button onclick="openCreateProjectModal()" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>Novo Projeto</span>
      </button>
    </div>

    <!-- Filter Bar (Copan Standard) -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div class="relative w-full sm:w-80">
        <i data-lucide="search" class="w-4 h-4 text-[#878D96] absolute left-3 top-1/2 -translate-y-1/2"></i>
        <input id="project-search-input" type="text" placeholder="Filtrar projetos..." oninput="handleProjectSearch(this.value)" class="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] placeholder-[#878D96] focus:outline-none focus:border-[#F56738] shadow-2xs" />
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select id="project-status-filter" onchange="filterProjectsByStatus(this.value)" class="px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#5A6A75] focus:outline-none focus:border-[#F56738] text-xs shadow-2xs">
          <option value="">Todos os Status</option>
          <option value="Draft">Draft</option>
          <option value="Planning">Planning</option>
          <option value="Ready">Ready</option>
          <option value="Archived">Archived</option>
        </select>
      </div>
    </div>

    <!-- Projects Table Container -->
    <div id="projects-table-container" class="copan-card overflow-hidden">
      <div class="p-8 text-center text-[#697077] text-xs">Carregando projetos...</div>
    </div>
  `;
  lucide.createIcons();
  loadProjectsList();
}

async function loadProjectsList(status = '', search = '') {
  const container = document.getElementById('projects-table-container');
  if (!container) return;
  try {
    let url = '/api/v1/projects';
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    const result = await res.json();
    state.projects = result.data || [];

    if (state.projects.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-[#F2F4F8] mx-auto flex items-center justify-center text-[#878D96]">
            <i data-lucide="folder-x" class="w-6 h-6"></i>
          </div>
          <div class="text-sm font-semibold text-[#121619]">Nenhum projeto encontrado</div>
          <p class="text-xs text-[#697077] max-w-sm mx-auto">Crie seu primeiro projeto para iniciar a composição de blueprints e scaffolding.</p>
          <button onclick="openCreateProjectModal()" class="btn-copan-primary px-3.5 py-2 text-xs inline-flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Criar Primeiro Projeto</span>
          </button>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#F2F4F8] border-b border-[#E1E9EF] text-[#697077] uppercase font-bold text-[10px]">
            <tr>
              <th class="p-4">Projeto</th>
              <th class="p-4">Arquitetura</th>
              <th class="p-4">Status</th>
              <th class="p-4">Responsável</th>
              <th class="p-4">Atualizado em</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E1E9EF]">
            ${state.projects.map(p => `
              <tr class="hover:bg-[#F2F4F8]/60 transition-colors">
                <td class="p-4">
                  <div class="font-semibold text-[#121619]">${p.name}</div>
                  <div class="text-[11px] text-[#697077] truncate max-w-xs">${p.description || 'Sem descrição'}</div>
                </td>
                <td class="p-4 text-[#5A6A75] font-medium">${p.architecture}</td>
                <td class="p-4">${renderStatusBadge(p.status)}</td>
                <td class="p-4 text-[#697077] font-mono text-[11px]">${p.owner}</td>
                <td class="p-4 text-[#878D96]">${formatDate(p.updated_at)}</td>
                <td class="p-4 text-right space-x-1.5">
                  ${p.blueprint_id ? `
                    <button onclick="viewBlueprintById('${p.blueprint_id}')" class="px-2.5 py-1.5 rounded-lg bg-[#FFF2EC] text-[#F56738] border border-[#FFD9C7] text-[11px] font-semibold inline-flex items-center gap-1 hover:bg-[#FFD9C7]" title="Visualizar Blueprint">
                      <i data-lucide="file-code-2" class="w-3.5 h-3.5"></i>
                      <span>Blueprint</span>
                    </button>
                  ` : ''}
                  <button onclick="duplicateProject('${p.id}')" class="p-1.5 rounded-lg bg-white hover:bg-[#F2F4F8] text-[#5A6A75] border border-[#E1E9EF]" title="Duplicar">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  </button>
                  <button onclick="archiveProject('${p.id}')" class="p-1.5 rounded-lg bg-white hover:bg-[#FDECEC] text-[#5A6A75] hover:text-[#991818] border border-[#E1E9EF]" title="Arquivar">
                    <i data-lucide="archive" class="w-3.5 h-3.5"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    lucide.createIcons();
  } catch (err) {
    container.innerHTML = `<div class="p-8 text-center text-[#991818] text-xs">Erro ao carregar projetos.</div>`;
  }
}

function handleProjectSearch(val) {
  const status = document.getElementById('project-status-filter')?.value || '';
  loadProjectsList(status, val);
}

function filterProjectsByStatus(status) {
  const search = document.getElementById('project-search-input')?.value || '';
  loadProjectsList(status, search);
}

async function duplicateProject(id) {
  try {
    const res = await fetch(`/api/v1/projects/${id}/duplicate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    if (res.ok) {
      showToast('Projeto duplicado com sucesso!', 'success');
      loadProjectsList();
      refreshBadges();
    }
  } catch (e) {
    showToast('Erro ao duplicar projeto', 'error');
  }
}

async function archiveProject(id) {
  if (!confirm('Deseja realmente arquivar este projeto?')) return;
  try {
    const res = await fetch(`/api/v1/projects/${id}/archive`, { method: 'POST' });
    if (res.ok) {
      showToast('Projeto arquivado.', 'info');
      loadProjectsList();
      refreshBadges();
    }
  } catch (e) {
    showToast('Erro ao arquivar projeto', 'error');
  }
}

// ---------------------------------------------------------------------------
// 5. BLUEPRINTS VIEW & MODAL VIEWER
// ---------------------------------------------------------------------------
async function renderBlueprintsView(container) {
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Blueprints de Aplicação</h1>
        <p class="text-xs text-[#697077] mt-0.5">Especificações técnicas estruturadas prontas para consumo por agentes de IA.</p>
      </div>
      <button onclick="navigateTo('workspace-blueprint-builder')" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
        <i data-lucide="hammer" class="w-4 h-4"></i>
        <span>Montar no Workshop</span>
      </button>
    </div>

    <div id="blueprints-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
      <div class="p-8 text-center text-[#697077] text-xs col-span-full">Carregando blueprints...</div>
    </div>
  `;
  lucide.createIcons();

  fetch('/api/v1/blueprints')
    .then(r => r.json())
    .then(result => {
      const grid = document.getElementById('blueprints-grid');
      if (!grid) return;
      const blueprints = result.data || [];
      if (blueprints.length === 0) {
        grid.innerHTML = `<div class="p-12 text-center text-[#697077] text-xs col-span-full">Nenhum blueprint cadastrado.</div>`;
        return;
      }
      grid.innerHTML = blueprints.map(bp => `
        <div class="copan-card p-5 flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-bold text-[#121619] text-sm">${bp.name}</h3>
              <span class="badge-status badge-informative">${bp.architecture_name}</span>
            </div>
            <p class="text-xs text-[#5A6A75] line-clamp-2">${bp.description || 'Sem descrição'}</p>
            
            <div class="pt-3 border-t border-[#E1E9EF] grid grid-cols-3 gap-2 text-[11px] text-center">
              <div class="bg-[#F2F4F8] p-2 rounded-lg border border-[#E1E9EF]">
                <span class="block text-[#121619] font-bold text-sm">${bp.modules.length}</span>
                <span class="text-[10px] text-[#697077]">Módulos</span>
              </div>
              <div class="bg-[#F2F4F8] p-2 rounded-lg border border-[#E1E9EF]">
                <span class="block text-[#121619] font-bold text-sm">${bp.components.length}</span>
                <span class="text-[10px] text-[#697077]">Componentes</span>
              </div>
              <div class="bg-[#F2F4F8] p-2 rounded-lg border border-[#E1E9EF]">
                <span class="block text-[#121619] font-bold text-sm">${bp.rules.length}</span>
                <span class="text-[10px] text-[#697077]">Regras</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3.5 border-t border-[#E1E9EF] flex items-center justify-between">
            <span class="text-[11px] text-[#878D96]">${formatDate(bp.updated_at)}</span>
            <button onclick="viewBlueprintById('${bp.id}')" class="btn-copan-secondary px-3 py-1.5 text-xs flex items-center gap-1 font-medium">
              <span>Inspecionar</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `).join('');
      lucide.createIcons();
    });
}

async function viewBlueprintById(id) {
  try {
    const res = await fetch(`/api/v1/blueprints/${id}`);
    if (!res.ok) throw new Error('Falha ao carregar blueprint');
    const bp = await res.json();
    state.selectedBlueprint = bp;
    state.activeBlueprintTab = 'overview';
    renderBlueprintModal(bp);
  } catch (e) {
    showToast('Erro ao carregar blueprint', 'error');
  }
}

function renderBlueprintModal(bp) {
  const modal = document.getElementById('generic-modal');
  const content = document.getElementById('generic-modal-content');

  content.innerHTML = `
    <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-[#FFF2EC] text-[#F56738] border border-[#FFD9C7] flex items-center justify-center">
          <i data-lucide="file-code-2" class="w-5 h-5"></i>
        </div>
        <div>
          <h2 class="text-base font-bold text-[#121619]">${bp.name}</h2>
          <div class="text-[11px] text-[#697077] font-mono">${bp.architecture_name} • ID: ${bp.id}</div>
        </div>
      </div>
      <button onclick="closeGenericModal()" class="p-1.5 rounded-lg text-[#878D96] hover:text-[#121619] hover:bg-[#F2F4F8]">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Blueprint Tabs (Copan Standard) -->
    <div class="flex items-center gap-1.5 border-b border-[#E1E9EF] pb-2 text-xs overflow-x-auto">
      ${['overview', 'architecture', 'features', 'components', 'rules', 'json'].map(tab => `
        <button onclick="switchBlueprintTab('${tab}')" class="px-3.5 py-1.5 rounded-lg font-medium transition-all ${state.activeBlueprintTab === tab ? 'bg-[#FFF2EC] text-[#F56738] border border-[#FFD9C7] font-semibold' : 'text-[#697077] hover:text-[#121619]'}">
          ${tab.toUpperCase()}
        </button>
      `).join('')}
    </div>

    <!-- Active Tab Body -->
    <div id="blueprint-tab-body" class="mt-4 text-xs">
      ${renderBlueprintTabContent(bp, state.activeBlueprintTab)}
    </div>

    <!-- Footer Actions -->
    <div class="mt-6 pt-4 border-t border-[#E1E9EF] flex items-center justify-between text-xs">
      <div class="text-[11px] text-[#697077]">Pronto para envio a agentes de IA (Cursor, Claude Code, Antigravity)</div>
      <div class="flex items-center gap-2">
        <button onclick="copyBlueprintJSON()" class="btn-copan-secondary px-3.5 py-2 flex items-center gap-1.5">
          <i data-lucide="copy" class="w-3.5 h-3.5"></i>
          <span>Copiar JSON</span>
        </button>
        <button onclick="downloadBlueprintJSON()" class="btn-copan-primary px-3.5 py-2 flex items-center gap-1.5 font-semibold">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          <span>Baixar JSON</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function switchBlueprintTab(tabName) {
  state.activeBlueprintTab = tabName;
  if (state.selectedBlueprint) {
    renderBlueprintModal(state.selectedBlueprint);
  }
}

function renderBlueprintTabContent(bp, tab) {
  switch (tab) {
    case 'overview':
      return `
        <div class="space-y-4">
          <p class="text-[#5A6A75]">${bp.description || 'Blueprint técnico composto pelo App Builder Engine.'}</p>
          <div class="grid grid-cols-2 gap-3.5">
            <div class="bg-[#F2F4F8] p-3.5 rounded-lg border border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1.5">Módulos Incluídos</span>
              <div class="flex flex-wrap gap-1.5">
                ${bp.modules.map(m => `<span class="px-2 py-0.5 rounded-full bg-white text-[#121619] text-[10px] border border-[#E1E9EF] font-medium">${m}</span>`).join('')}
              </div>
            </div>
            <div class="bg-[#F2F4F8] p-3.5 rounded-lg border border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1.5">Dependências Canônicas</span>
              <div class="flex flex-wrap gap-1.5">
                ${bp.dependencies.slice(0, 4).map(d => `<span class="px-2 py-0.5 rounded-full bg-white text-[#115644] font-mono text-[10px] border border-[#E1E9EF]">${d}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    case 'architecture':
      return `
        <div class="space-y-3">
          <div class="text-[#121619] font-semibold">${bp.architecture_name}</div>
          <pre class="p-3.5 bg-[#121619] border border-[#E1E9EF] rounded-lg text-emerald-400 text-[11px] overflow-x-auto font-mono">${bp.folder_structure || 'Estrutura padrão de monólito modular.'}</pre>
        </div>
      `;
    case 'features':
      return `
        <div class="space-y-2">
          ${(bp.features.length > 0 ? bp.features : bp.modules).map(f => `
            <div class="p-2.5 rounded-lg bg-[#F2F4F8] border border-[#E1E9EF] flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-[#20A483]"></i>
              <span class="font-medium text-[#121619] capitalize">${f}</span>
            </div>
          `).join('')}
        </div>
      `;
    case 'components':
      return `
        <div class="grid grid-cols-2 gap-2.5">
          ${bp.components.map(c => `
            <div class="p-3 rounded-lg bg-[#F2F4F8] border border-[#E1E9EF] flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <i data-lucide="box" class="w-4 h-4 text-[#F56738]"></i>
                <span class="font-semibold text-[#121619]">${c}</span>
              </div>
              <span class="badge-status badge-draft">Copan UI</span>
            </div>
          `).join('')}
        </div>
      `;
    case 'rules':
      return `
        <div class="space-y-2">
          ${bp.rules.map(r => `
            <div class="p-2.5 rounded-lg bg-[#F2F4F8] border border-[#E1E9EF] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="shield-check" class="w-4 h-4 text-[#991818]"></i>
                <span class="font-medium text-[#121619]">${r}</span>
              </div>
              <span class="badge-status badge-required">Obrigatória</span>
            </div>
          `).join('')}
        </div>
      `;
    case 'json':
      return `
        <pre class="p-3.5 bg-[#121619] border border-[#E1E9EF] rounded-lg text-emerald-400 text-[11px] overflow-x-auto font-mono max-h-72">${JSON.stringify(bp.raw_blueprint_json || bp, null, 2)}</pre>
      `;
    default:
      return '';
  }
}

function copyBlueprintJSON() {
  if (!state.selectedBlueprint) return;
  const jsonText = JSON.stringify(state.selectedBlueprint.raw_blueprint_json || state.selectedBlueprint, null, 2);
  navigator.clipboard.writeText(jsonText);
  showToast('Blueprint JSON copiado com sucesso!', 'success');
}

function downloadBlueprintJSON() {
  if (!state.selectedBlueprint) return;
  const jsonText = JSON.stringify(state.selectedBlueprint.raw_blueprint_json || state.selectedBlueprint, null, 2);
  const blob = new Blob([jsonText], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.selectedBlueprint.name.toLowerCase().replace(/\\s+/g, '-')}-blueprint.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Download do Blueprint iniciado!', 'info');
}

// ---------------------------------------------------------------------------
// 6. COMPONENTS VIEW & 360 INTEGRATION
// ---------------------------------------------------------------------------
async function renderComponentsView(container) {
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Catálogo de Componentes Copan</h1>
        <p class="text-xs text-[#697077] mt-0.5">Componentes canônicos certificados com respostas 360° para arquitetura e reuso.</p>
      </div>
      <button onclick="openCreateComponentModal()" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>Novo Componente</span>
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="flex items-center gap-3 text-xs">
      <div class="relative flex-1 max-w-md">
        <i data-lucide="search" class="w-4 h-4 text-[#878D96] absolute left-3 top-1/2 -translate-y-1/2"></i>
        <input type="text" placeholder="Buscar componentes Copan..." oninput="handleComponentSearch(this.value)" class="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] placeholder-[#878D96] focus:outline-none focus:border-[#F56738] shadow-2xs" />
      </div>
    </div>

    <div id="components-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
      <div class="p-8 text-center text-[#697077] text-xs col-span-full">Carregando componentes...</div>
    </div>
  `;
  lucide.createIcons();
  loadComponentsGrid();
}

async function loadComponentsGrid(search = '') {
  const grid = document.getElementById('components-grid');
  if (!grid) return;
  try {
    const url = search ? `/api/v1/components?search=${encodeURIComponent(search)}` : '/api/v1/components';
    const res = await fetch(url);
    const result = await res.json();
    state.components = result.data || [];

    grid.innerHTML = state.components.map(c => `
      <div class="copan-card p-5 flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="font-bold text-[#121619] text-sm">${c.name}</h3>
              <span class="text-[10px] text-[#697077] font-mono">${c.id}</span>
            </div>
            <span class="badge-status ${c.status === 'Published' ? 'badge-published' : c.status === 'Deprecated' ? 'badge-deprecated' : 'badge-draft'}">${c.status}</span>
          </div>
          <p class="text-xs text-[#5A6A75] line-clamp-2">${c.description}</p>
          <div class="flex flex-wrap gap-1.5">
            ${c.tags.map(t => `<span class="px-2 py-0.5 rounded-full bg-[#F2F4F8] text-[#5A6A75] text-[10px] border border-[#E1E9EF]">#${t}</span>`).join('')}
          </div>
        </div>

        <div class="mt-4 pt-3.5 border-t border-[#E1E9EF] flex items-center justify-between text-xs">
          <span class="text-[11px] text-[#878D96] font-mono">v${c.version}</span>
          <button onclick="inspectEntity360('component', '${c.id}')" class="btn-copan-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-[#F56738] bg-[#FFF2EC] border-[#FFD9C7] hover:bg-[#FFD9C7]">
            <i data-lucide="scan-eye" class="w-3.5 h-3.5"></i>
            <span>360° Inspector</span>
          </button>
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  } catch (err) {
    grid.innerHTML = `<div class="p-8 text-center text-[#991818] text-xs col-span-full">Erro ao carregar componentes.</div>`;
  }
}

function handleComponentSearch(val) {
  loadComponentsGrid(val);
}

// ---------------------------------------------------------------------------
// 7. MODULES VIEW & 360 INTEGRATION
// ---------------------------------------------------------------------------
async function renderModulesView(container) {
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Catálogo de Módulos de Negócio</h1>
        <p class="text-xs text-[#697077] mt-0.5">Módulos autônomos com contratos de API, componentes Copan e dependências.</p>
      </div>
      <button onclick="openCreateModuleModal()" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>Novo Módulo</span>
      </button>
    </div>

    <div id="modules-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
      <div class="p-8 text-center text-[#697077] text-xs col-span-full">Carregando módulos...</div>
    </div>
  `;
  lucide.createIcons();

  fetch('/api/v1/modules')
    .then(r => r.json())
    .then(res => {
      const grid = document.getElementById('modules-grid');
      if (!grid) return;
      grid.innerHTML = (res.data || []).map(m => `
        <div class="copan-card p-5 flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-bold text-[#121619] text-sm">${m.name}</h3>
                <span class="text-[10px] text-[#697077] font-mono">${m.id}</span>
              </div>
              <span class="text-[11px] font-mono text-[#878D96]">v${m.version}</span>
            </div>
            <p class="text-xs text-[#5A6A75]">${m.description}</p>
            <div class="pt-3 border-t border-[#E1E9EF] space-y-1 text-xs">
              <div class="text-[#5A6A75] text-[11px]"><span class="text-[#878D96] font-semibold">APIs:</span> ${m.apis.length} endpoints mapeados</div>
              <div class="text-[#5A6A75] text-[11px]"><span class="text-[#878D96] font-semibold">Componentes:</span> ${m.components.length}</div>
            </div>
          </div>

          <div class="mt-4 pt-3.5 border-t border-[#E1E9EF] flex items-center justify-between text-xs">
            <span class="badge-status badge-informative">Módulo</span>
            <button onclick="inspectEntity360('module', '${m.id}')" class="btn-copan-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-[#F56738] bg-[#FFF2EC] border-[#FFD9C7] hover:bg-[#FFD9C7]">
              <i data-lucide="scan-eye" class="w-3.5 h-3.5"></i>
              <span>360° Inspector</span>
            </button>
          </div>
        </div>
      `).join('');
      lucide.createIcons();
    });
}

// ---------------------------------------------------------------------------
// 8. TEMPLATES VIEW & 360 INTEGRATION
// ---------------------------------------------------------------------------
async function renderTemplatesView(container) {
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Catálogo de Templates</h1>
        <p class="text-xs text-[#697077] mt-0.5">Composições arquiteturais reutilizáveis para scaffolding de aplicações Olivelas.</p>
      </div>
      <button onclick="openCreateTemplateModal()" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>Novo Template</span>
      </button>
    </div>

    <div id="templates-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <div class="p-8 text-center text-[#697077] text-xs col-span-full">Carregando templates...</div>
    </div>
  `;
  lucide.createIcons();

  fetch('/api/v1/templates')
    .then(r => r.json())
    .then(res => {
      const grid = document.getElementById('templates-grid');
      if (!grid) return;
      grid.innerHTML = (res.data || []).map(t => `
        <div class="copan-card p-5 space-y-3.5 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-bold text-[#121619] text-sm">${t.name}</h3>
                <span class="text-[10px] text-[#697077] font-mono">${t.id}</span>
              </div>
              <span class="badge-status badge-informative">${t.architecture}</span>
            </div>
            <p class="text-xs text-[#5A6A75]">${t.description}</p>
            <div class="pt-3 border-t border-[#E1E9EF] space-y-1.5 text-xs">
              <div class="text-[#5A6A75] text-[11px]"><span class="text-[#878D96] font-semibold">Componentes:</span> ${t.components.join(', ')}</div>
              <div class="text-[#5A6A75] text-[11px]"><span class="text-[#878D96] font-semibold">Módulos:</span> ${t.modules.join(', ')}</div>
            </div>
          </div>

          <div class="mt-4 pt-3.5 border-t border-[#E1E9EF] flex items-center justify-between text-xs">
            <span class="text-[11px] text-[#878D96] font-mono">v${t.version}</span>
            <button onclick="inspectEntity360('template', '${t.id}')" class="btn-copan-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-[#F56738] bg-[#FFF2EC] border-[#FFD9C7] hover:bg-[#FFD9C7]">
              <i data-lucide="scan-eye" class="w-3.5 h-3.5"></i>
              <span>360° Inspector</span>
            </button>
          </div>
        </div>
      `).join('');
      lucide.createIcons();
    });
}

// ---------------------------------------------------------------------------
// 9. RULES, SPECS & ARCHITECTURES VIEWS
// ---------------------------------------------------------------------------
async function renderRulesView(container) {
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Rules Engine & Golden Rules da Olivelas</h1>
        <p class="text-xs text-[#697077] mt-0.5">Regras mandatórias de arquitetura, Copan Design System e segurança aplicadas aos agentes.</p>
      </div>
      <button onclick="openCreateRuleModal()" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>Nova Regra</span>
      </button>
    </div>

    <div id="rules-list" class="space-y-3.5 mt-2">
      <div class="p-8 text-center text-[#697077] text-xs">Carregando regras...</div>
    </div>
  `;
  lucide.createIcons();

  fetch('/api/v1/rules')
    .then(r => r.json())
    .then(res => {
      const list = document.getElementById('rules-list');
      if (!list) return;
      list.innerHTML = (res.data || []).map(r => `
        <div class="copan-card p-5 space-y-3.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <span class="badge-status ${r.priority === 'Required' ? 'badge-required' : 'badge-recommended'}">${r.priority}</span>
              <span class="badge-status badge-draft">${r.category}</span>
              <h3 class="font-bold text-[#121619] text-sm">${r.name}</h3>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-mono text-[#878D96]">${r.id}</span>
              <button onclick="inspectEntity360('rule', '${r.id}')" class="btn-copan-secondary px-2.5 py-1 text-[11px] font-semibold text-[#F56738] bg-[#FFF2EC] border-[#FFD9C7]">
                360°
              </button>
            </div>
          </div>
          <p class="text-xs text-[#5A6A75] leading-relaxed">${r.description}</p>
          ${r.bad_example || r.good_example ? `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              ${r.bad_example ? `
                <div class="p-3 bg-[#FDECEC] border border-[#F7C2C2] rounded-lg">
                  <div class="text-[10px] font-bold uppercase text-[#991818] mb-1 flex items-center gap-1">
                    <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
                    <span>Exemplo Incorreto</span>
                  </div>
                  <pre class="text-[11px] text-[#991818] font-mono overflow-x-auto">${r.bad_example}</pre>
                </div>
              ` : ''}
              ${r.good_example ? `
                <div class="p-3 bg-[#E8F5F0] border border-[#A2DEC9] rounded-lg">
                  <div class="text-[10px] font-bold uppercase text-[#115644] mb-1 flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                    <span>Padrão Recomendado (Copan)</span>
                  </div>
                  <pre class="text-[11px] text-[#115644] font-mono overflow-x-auto">${r.good_example}</pre>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `).join('');
      lucide.createIcons();
    });
}

async function renderSpecificationsView(container) {
  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Software Design Documents (SDDs)</h1>
        <p class="text-xs text-[#697077] mt-0.5">Especificações canônicas indexadas da Olivelas para consulta e contextualização de IA.</p>
      </div>
      <button onclick="openCreateSpecModal()" class="btn-copan-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm font-semibold">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>Nova Especificação</span>
      </button>
    </div>

    <div id="specs-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <div class="p-8 text-center text-[#697077] text-xs col-span-full">Carregando especificações...</div>
    </div>
  `;
  lucide.createIcons();

  fetch('/api/v1/specifications')
    .then(r => r.json())
    .then(res => {
      const grid = document.getElementById('specs-grid');
      if (!grid) return;
      grid.innerHTML = (res.data || []).map(s => `
        <div class="copan-card p-5 space-y-3.5 flex flex-col justify-between">
          <div class="space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-bold text-[#121619] text-sm">${s.name}</h3>
                <span class="text-[10px] text-[#697077] font-mono">${s.id}</span>
              </div>
              <span class="badge-status badge-informative">${s.category}</span>
            </div>
            <p class="text-xs text-[#5A6A75] line-clamp-3">${s.description}</p>
            <div class="flex flex-wrap gap-1.5">
              ${s.tags.map(t => `<span class="px-2 py-0.5 rounded-full bg-[#F2F4F8] text-[#5A6A75] text-[10px] border border-[#E1E9EF]">#${t}</span>`).join('')}
            </div>
          </div>
          <div class="pt-3.5 border-t border-[#E1E9EF] flex items-center justify-between text-xs">
            <span class="text-[11px] text-[#878D96] font-mono">v${s.version}</span>
            <div class="flex items-center gap-2">
              <button onclick="inspectEntity360('specification', '${s.id}')" class="btn-copan-secondary px-2.5 py-1.5 text-xs text-[#F56738] bg-[#FFF2EC] border-[#FFD9C7]">
                360°
              </button>
              <button onclick="viewSpecContent('${s.id}')" class="btn-copan-secondary px-3 py-1.5 text-xs font-medium">
                Ler Conteúdo
              </button>
            </div>
          </div>
        </div>
      `).join('');
      lucide.createIcons();
    });
}

async function viewSpecContent(id) {
  try {
    const res = await fetch(`/api/v1/specifications/${id}`);
    const spec = await res.json();
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');

    content.innerHTML = `
      <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-4 mb-4">
        <div>
          <h2 class="text-base font-bold text-[#121619]">${spec.name}</h2>
          <div class="text-[11px] text-[#697077] font-mono">${spec.category} • v${spec.version}</div>
        </div>
        <button onclick="closeGenericModal()" class="p-1.5 rounded-lg text-[#878D96] hover:text-[#121619] hover:bg-[#F2F4F8]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <div class="p-4 bg-[#F2F4F8] border border-[#E1E9EF] rounded-lg text-[#121619] text-xs overflow-y-auto max-h-96 whitespace-pre-wrap font-mono">${spec.content}</div>
    `;
    modal.classList.remove('hidden');
    lucide.createIcons();
  } catch (err) {
    showToast('Erro ao carregar especificação', 'error');
  }
}

async function renderArchitecturesView(container) {
  container.innerHTML = `
    <div class="pb-2">
      <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Padrões Arquiteturais Recomendados</h1>
      <p class="text-xs text-[#697077] mt-0.5">Padrões canônicos com diretrizes, estruturas de pastas e restrições de arquitetura.</p>
    </div>
    <div id="archs-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <div class="p-8 text-center text-[#697077] text-xs col-span-full">Carregando arquiteturas...</div>
    </div>
  `;
  lucide.createIcons();

  fetch('/api/v1/architectures')
    .then(r => r.json())
    .then(res => {
      const grid = document.getElementById('archs-grid');
      if (!grid) return;
      grid.innerHTML = (res.data || []).map(a => `
        <div class="copan-card p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-[#121619] text-sm">${a.name}</h3>
            <button onclick="inspectEntity360('architecture', '${a.id}')" class="btn-copan-secondary px-2.5 py-1 text-[11px] text-[#F56738] bg-[#FFF2EC] border-[#FFD9C7]">
              360°
            </button>
          </div>
          <p class="text-xs text-[#5A6A75]">${a.description}</p>
          <div class="space-y-1.5 text-xs">
            <span class="text-[10px] text-[#697077] uppercase font-bold block">Características</span>
            <ul class="list-disc list-inside text-[#5A6A75] space-y-0.5">
              ${a.characteristics.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
          ${a.folder_tree ? `
            <div class="pt-2 border-t border-[#E1E9EF]">
              <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1">Estrutura de Pastas</span>
              <pre class="p-3 bg-[#121619] border border-[#E1E9EF] rounded-lg text-emerald-400 font-mono text-[10px] overflow-x-auto">${a.folder_tree}</pre>
            </div>
          ` : ''}
        </div>
      `).join('');
      lucide.createIcons();
    });
}

// ---------------------------------------------------------------------------
// 10. AI AGENTS VIEW (COMPOSER SIMULATOR & API ACCESS)
// ---------------------------------------------------------------------------
function renderAIComposerView(container) {
  container.innerHTML = `
    <div class="pb-2">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Simulador de Composição de Blueprint por IA</h1>
        <span class="badge-status badge-informative">AI-BAS Determinístico</span>
      </div>
      <p class="text-xs text-[#697077] mt-0.5">Simule a chamada de API que agentes de IA (Cursor, Claude Code, Antigravity) executam para compor um Blueprint técnico.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
      <!-- Input Panel -->
      <div class="copan-card p-5 space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077]">Payload de Requisição</h2>
        
        <div>
          <label class="block text-xs font-medium text-[#121619] mb-1">Nome da Aplicação</label>
          <input id="ai-app-name" type="text" value="Customer Portal" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-xs text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
        </div>

        <div>
          <label class="block text-xs font-medium text-[#121619] mb-1">Requisitos / Funcionalidades (separadas por vírgula)</label>
          <textarea id="ai-app-requirements" rows="4" class="w-full p-3 rounded-lg bg-white border border-[#E1E9EF] text-xs text-[#121619] font-mono focus:outline-none focus:border-[#F56738] shadow-2xs">authentication, users, dashboard, audit, reports</textarea>
          <p class="text-[11px] text-[#697077] mt-1.5">O motor mapeará deterministicamente os módulos, componentes Copan, Golden Rules e arquitetura.</p>
        </div>

        <button onclick="executeAIComposition()" id="btn-execute-ai" class="btn-copan-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 shadow-sm font-semibold">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          <span>Executar Composição Determinística</span>
        </button>
      </div>

      <!-- Result Panel -->
      <div class="copan-card p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#697077]">Resposta da API do Agente</h2>
            <span id="ai-status-indicator" class="text-[11px] text-[#878D96]">Aguardando execução...</span>
          </div>
          <div id="ai-result-content" class="mt-3.5">
            <div class="p-12 text-center text-[#878D96] text-xs">Clique em "Executar Composição Determinística" para testar o retorno.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

async function executeAIComposition() {
  const btn = document.getElementById('btn-execute-ai');
  const indicator = document.getElementById('ai-status-indicator');
  const resultContent = document.getElementById('ai-result-content');
  
  const appName = document.getElementById('ai-app-name').value.trim();
  const reqsRaw = document.getElementById('ai-app-requirements').value;
  const requirements = reqsRaw.split(',').map(r => r.trim()).filter(Boolean);

  if (!appName) {
    showToast('Informe o nome da aplicação', 'error');
    return;
  }

  btn.disabled = true;
  indicator.textContent = 'Processando...';
  resultContent.innerHTML = `<div class="p-8 text-center text-[#697077] text-xs animate-pulse">Consultando catálogos Copan e resolvendo dependências...</div>`;

  try {
    const res = await fetch('/api/v1/ai/blueprints/compose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        application: { name: appName },
        requirements: requirements,
      }),
    });

    const data = await res.json();
    btn.disabled = false;
    indicator.textContent = 'Sucesso (200 OK)';

    resultContent.innerHTML = `
      <div class="space-y-3.5 text-xs">
        <div class="p-3 bg-[#F2F4F8] border border-[#E1E9EF] rounded-lg">
          <div class="font-bold text-[#121619] text-sm mb-1">${data.application_name} Blueprint</div>
          <div class="text-[#5A6A75] text-[11px]">Arquitetura: <span class="text-[#F56738] font-semibold">${data.architecture}</span></div>
          <div class="text-[#5A6A75] text-[11px] mt-0.5">Módulos: <span class="text-[#121619] font-medium">${data.identified_modules.join(', ')}</span></div>
        </div>

        <div>
          <span class="text-[10px] text-[#697077] uppercase font-bold block mb-1">JSON Estruturado retornado ao Agente</span>
          <pre class="p-3.5 bg-[#121619] border border-[#E1E9EF] rounded-lg text-emerald-400 font-mono text-[11px] max-h-56 overflow-y-auto">${JSON.stringify(data, null, 2)}</pre>
        </div>

        <button onclick="viewBlueprintById('${data.blueprint_id}')" class="btn-copan-secondary w-full py-2 text-xs font-medium flex items-center justify-center gap-1.5">
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          <span>Abrir no Visualizador de Blueprints</span>
        </button>
      </div>
    `;
    lucide.createIcons();
    showToast('Blueprint composto e salvo com sucesso!', 'success');
    refreshBadges();
  } catch (err) {
    btn.disabled = false;
    indicator.textContent = 'Erro';
    resultContent.innerHTML = `<div class="p-8 text-center text-[#991818] text-xs">Falha na execução da API.</div>`;
  }
}

function renderAIApiAccessView(container) {
  container.innerHTML = `
    <div class="pb-2">
      <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Contratos de API para Agentes de IA</h1>
      <p class="text-xs text-[#697077] mt-0.5">Endpoints dedicados para consumo por agentes (Cursor, Claude Code, Antigravity).</p>
    </div>

    <div class="space-y-3 mt-2 text-xs">
      ${[
        { method: 'POST', path: '/api/v1/ai/blueprints/compose', desc: 'Composição determinística de Blueprints a partir de requisitos estruturados.' },
        { method: 'POST', path: '/api/v1/blueprints/build', desc: 'Construção direta e personalizada de Blueprint a partir de blocos selecionados.' },
        { method: 'GET', path: '/api/v1/relations/{type}/{id}', desc: 'Grafo 360° de conhecimento e relacionamentos de qualquer building block.' },
        { method: 'GET', path: '/api/v1/components', desc: 'Lista de componentes Copan de UI e Backend com dependências e regras.' },
        { method: 'GET', path: '/api/v1/rules', desc: 'Catálogo de Golden Rules de arquitetura, Copan e segurança da Olivelas.' },
        { method: 'GET', path: '/api/v1/architectures', desc: 'Padrões de arquitetura e estruturas de pastas recomendadas.' },
        { method: 'GET', path: '/api/v1/specifications', desc: 'Resumo e índice de todas as especificações técnicas (SDDs).' },
        { method: 'POST', path: '/api/v1/search', desc: 'Busca unificada em toda a base de conhecimento e catálogos.' },
      ].map(ep => `
        <div class="copan-card p-4 flex items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="badge-status ${ep.method === 'POST' ? 'badge-informative' : 'badge-ready'}">${ep.method}</span>
              <span class="font-mono text-[#121619] font-semibold">${ep.path}</span>
            </div>
            <p class="text-[#5A6A75] text-[11px]">${ep.desc}</p>
          </div>
          <button onclick="navigator.clipboard.writeText('http://localhost:8000${ep.path}'); showToast('URL copiada!', 'info');" class="btn-copan-secondary px-3 py-1.5 text-xs shrink-0">
            Copiar URL
          </button>
        </div>
      `).join('')}
    </div>
  `;
  lucide.createIcons();
}

// ---------------------------------------------------------------------------
// 11. AUDIT LOGS VIEW
// ---------------------------------------------------------------------------
async function renderAuditLogsView(container) {
  container.innerHTML = `
    <div class="pb-2">
      <h1 class="text-2xl font-bold text-[#121619] tracking-tight">Trilha de Auditoria & Governança</h1>
      <p class="text-xs text-[#697077] mt-0.5">Registro imutável de eventos e ações privilegiadas executadas na plataforma.</p>
    </div>

    <div id="audit-table-container" class="copan-card overflow-hidden mt-2">
      <div class="p-8 text-center text-[#697077] text-xs">Carregando trilha de auditoria...</div>
    </div>
  `;
  lucide.createIcons();

  fetch('/api/v1/audit/logs?page_size=30')
    .then(r => r.json())
    .then(res => {
      const table = document.getElementById('audit-table-container');
      if (!table) return;
      const logs = res.data || [];
      if (logs.length === 0) {
        table.innerHTML = `<div class="p-8 text-center text-[#697077] text-xs">Nenhum registro de auditoria.</div>`;
        return;
      }
      table.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#F2F4F8] border-b border-[#E1E9EF] text-[#697077] uppercase font-bold text-[10px]">
              <tr>
                <th class="p-4">Ação</th>
                <th class="p-4">Recurso</th>
                <th class="p-4">ID Recurso</th>
                <th class="p-4">Usuário</th>
                <th class="p-4">Resultado</th>
                <th class="p-4">Data / Hora</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E9EF]">
              ${logs.map(l => `
                <tr class="hover:bg-[#F2F4F8]/60">
                  <td class="p-4 font-semibold text-[#121619] font-mono text-[11px]">${l.action}</td>
                  <td class="p-4 text-[#5A6A75]">${l.resource}</td>
                  <td class="p-4 font-mono text-[#878D96] text-[11px]">${l.resource_id}</td>
                  <td class="p-4 text-[#5A6A75]">${l.user_email}</td>
                  <td class="p-4">
                    <span class="badge-status ${l.result === 'SUCCESS' ? 'badge-ready' : 'badge-deprecated'}">${l.result}</span>
                  </td>
                  <td class="p-4 text-[#878D96] text-[11px]">${formatDate(l.timestamp)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    });
}

function renderComingSoonView(container, viewName) {
  container.innerHTML = `
    <div class="copan-card p-12 text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-[#F2F4F8] mx-auto flex items-center justify-center text-[#878D96]">
        <i data-lucide="construction" class="w-6 h-6 text-[#F56738]"></i>
      </div>
      <div class="text-sm font-bold text-[#121619] capitalize">${viewName.replace('catalog-', '')} — Em Breve</div>
      <p class="text-xs text-[#697077] max-w-sm mx-auto">Este módulo faz parte das próximas iterações do App Builder Engine.</p>
    </div>
  `;
  lucide.createIcons();
}

// ---------------------------------------------------------------------------
// 12. COMMAND PALETTE (CMD + K)
// ---------------------------------------------------------------------------
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
      closeGenericModal();
    }
  });
}

function openCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  const input = document.getElementById('command-input');
  modal.classList.remove('hidden');
  input.value = '';
  input.focus();
}

function closeCommandPalette() {
  document.getElementById('command-palette-modal').classList.add('hidden');
}

function closeGenericModal() {
  document.getElementById('generic-modal').classList.add('hidden');
}

let searchDebounce = null;
function handleCommandSearch(query) {
  clearTimeout(searchDebounce);
  const container = document.getElementById('command-results');
  if (!query.trim()) {
    container.innerHTML = `<div class="p-4 text-center text-xs text-[#697077]">Digite para buscar qualquer recurso da plataforma...</div>`;
    return;
  }

  searchDebounce = setTimeout(async () => {
    try {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
      const results = await res.json();
      if (results.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-xs text-[#697077]">Nenhum resultado encontrado para "${query}".</div>`;
        return;
      }

      container.innerHTML = results.map(r => `
        <div onclick="handleSearchResultClick('${r.type}', '${r.id}')" class="p-3 rounded-lg hover:bg-[#F2F4F8] cursor-pointer flex items-center justify-between text-xs transition-colors">
          <div class="flex items-center gap-3">
            <span class="badge-status badge-informative">${r.type}</span>
            <div>
              <div class="font-semibold text-[#121619]">${r.name}</div>
              <div class="text-[11px] text-[#697077] truncate max-w-sm">${r.description}</div>
            </div>
          </div>
          <i data-lucide="chevron-right" class="w-4 h-4 text-[#878D96]"></i>
        </div>
      `).join('');
      lucide.createIcons();
    } catch (e) {
      container.innerHTML = `<div class="p-4 text-center text-xs text-[#991818]">Erro na busca.</div>`;
    }
  }, 150);
}

function handleSearchResultClick(type, id) {
  closeCommandPalette();
  if (type === 'Project') navigateTo('projects');
  else if (type === 'Blueprint') viewBlueprintById(id);
  else inspectEntity360(type.toLowerCase(), id);
}

// ---------------------------------------------------------------------------
// 13. CRUD MODALS (CREATE COMPONENT, MODULE, TEMPLATE, RULE, SPEC, PROJECT)
// ---------------------------------------------------------------------------
function openCreateProjectModal() {
  const modal = document.getElementById('generic-modal');
  const content = document.getElementById('generic-modal-content');

  content.innerHTML = `
    <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-4 mb-4">
      <h2 class="text-base font-bold text-[#121619]">Criar Novo Projeto</h2>
      <button onclick="closeGenericModal()" class="p-1.5 rounded-lg text-[#878D96] hover:text-[#121619] hover:bg-[#F2F4F8]">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <form onsubmit="handleCreateProjectSubmit(event)" class="space-y-4 text-xs">
      <div>
        <label class="block font-semibold text-[#121619] mb-1">Nome do Projeto *</label>
        <input id="modal-project-name" required placeholder="Ex: Broker Management Portal" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Descrição</label>
        <textarea id="modal-project-desc" rows="3" placeholder="Objetivo e escopo da aplicação..." class="w-full p-3 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs"></textarea>
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Arquitetura Padrão</label>
        <select id="modal-project-arch" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs">
          <option value="Modular Monolith">Modular Monolith</option>
          <option value="Layered Architecture (FastAPI + React)">Layered Architecture (FastAPI + React Copan)</option>
          <option value="Event Driven">Event Driven</option>
          <option value="Microservices">Microservices</option>
        </select>
      </div>

      <div class="pt-4 border-t border-[#E1E9EF] flex justify-end gap-2.5">
        <button type="button" onclick="closeGenericModal()" class="btn-copan-secondary px-4 py-2">Cancelar</button>
        <button type="submit" class="btn-copan-primary px-4 py-2 font-semibold">Criar Projeto</button>
      </div>
    </form>
  `;
  modal.classList.remove('hidden');
  lucide.createIcons();
}

async function handleCreateProjectSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('modal-project-name').value.trim();
  const description = document.getElementById('modal-project-desc').value.trim();
  const architecture = document.getElementById('modal-project-arch').value;

  try {
    const res = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, architecture }),
    });

    if (res.ok) {
      showToast('Projeto criado com sucesso!', 'success');
      closeGenericModal();
      if (state.currentView === 'projects') loadProjectsList();
      refreshBadges();
    }
  } catch (err) {
    showToast('Erro ao criar projeto', 'error');
  }
}

function openCreateComponentModal() {
  const modal = document.getElementById('generic-modal');
  const content = document.getElementById('generic-modal-content');

  content.innerHTML = `
    <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-4 mb-4">
      <h2 class="text-base font-bold text-[#121619]">Cadastrar Novo Componente Copan</h2>
      <button onclick="closeGenericModal()" class="p-1.5 rounded-lg text-[#878D96] hover:text-[#121619] hover:bg-[#F2F4F8]">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <form onsubmit="handleCreateComponentSubmit(event)" class="space-y-3.5 text-xs">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-semibold text-[#121619] mb-1">Nome do Componente *</label>
          <input id="new-comp-name" required placeholder="Ex: MetricCard" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
        </div>
        <div>
          <label class="block font-semibold text-[#121619] mb-1">Categoria</label>
          <select id="new-comp-category" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs">
            <option value="UI Components">UI Components</option>
            <option value="Data Display">Data Display</option>
            <option value="Navigation">Navigation</option>
            <option value="Forms">Forms</option>
            <option value="Feedback">Feedback</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Descrição Técnica *</label>
        <textarea id="new-comp-desc" required rows="2" placeholder="Explicação do propósito do componente..." class="w-full p-3 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs"></textarea>
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Tags (separadas por vírgula)</label>
        <input id="new-comp-tags" placeholder="copan, ui, metrics, kpi" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Interface TypeScript (Props)</label>
        <textarea id="new-comp-props" rows="3" placeholder="interface MetricCardProps { title: string; value: number; }" class="w-full p-3 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] font-mono text-[11px] focus:outline-none focus:border-[#F56738] shadow-2xs"></textarea>
      </div>

      <div class="pt-4 border-t border-[#E1E9EF] flex justify-end gap-2.5">
        <button type="button" onclick="closeGenericModal()" class="btn-copan-secondary px-4 py-2">Cancelar</button>
        <button type="submit" class="btn-copan-primary px-4 py-2 font-semibold">Salvar Componente</button>
      </div>
    </form>
  `;
  modal.classList.remove('hidden');
  lucide.createIcons();
}

async function handleCreateComponentSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('new-comp-name').value.trim();
  const category = document.getElementById('new-comp-category').value;
  const description = document.getElementById('new-comp-desc').value.trim();
  const tagsRaw = document.getElementById('new-comp-tags').value;
  const props = document.getElementById('new-comp-props').value;
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  try {
    const res = await fetch('/api/v1/components', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category,
        description,
        tags,
        interface_spec: props,
        dependencies: ['antd>=5.20.0', 'lucide-react>=1.0.0'],
        status: 'Published',
      }),
    });

    if (res.ok) {
      showToast('Componente cadastrado com sucesso!', 'success');
      closeGenericModal();
      if (state.currentView === 'catalog-components') loadComponentsGrid();
      refreshBadges();
    }
  } catch (err) {
    showToast('Erro ao cadastrar componente', 'error');
  }
}

function openCreateModuleModal() {
  const modal = document.getElementById('generic-modal');
  const content = document.getElementById('generic-modal-content');

  content.innerHTML = `
    <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-4 mb-4">
      <h2 class="text-base font-bold text-[#121619]">Cadastrar Novo Módulo de Negócio</h2>
      <button onclick="closeGenericModal()" class="p-1.5 rounded-lg text-[#878D96] hover:text-[#121619] hover:bg-[#F2F4F8]">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <form onsubmit="handleCreateModuleSubmit(event)" class="space-y-3.5 text-xs">
      <div>
        <label class="block font-semibold text-[#121619] mb-1">Nome do Módulo *</label>
        <input id="new-mod-name" required placeholder="Ex: Billing & Invoicing" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Descrição *</label>
        <textarea id="new-mod-desc" required rows="2" placeholder="Responsabilidade do módulo..." class="w-full p-3 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs"></textarea>
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Endpoints de API (separados por vírgula)</label>
        <input id="new-mod-apis" placeholder="/api/v1/billing/invoices, /api/v1/billing/subscriptions" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] font-mono focus:outline-none focus:border-[#F56738] shadow-2xs" />
      </div>

      <div class="pt-4 border-t border-[#E1E9EF] flex justify-end gap-2.5">
        <button type="button" onclick="closeGenericModal()" class="btn-copan-secondary px-4 py-2">Cancelar</button>
        <button type="submit" class="btn-copan-primary px-4 py-2 font-semibold">Salvar Módulo</button>
      </div>
    </form>
  `;
  modal.classList.remove('hidden');
  lucide.createIcons();
}

async function handleCreateModuleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('new-mod-name').value.trim();
  const description = document.getElementById('new-mod-desc').value.trim();
  const apisRaw = document.getElementById('new-mod-apis').value;
  const apis = apisRaw.split(',').map(a => a.trim()).filter(Boolean);

  try {
    const res = await fetch('/api/v1/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        apis,
        components: ['comp-data-table', 'comp-filter-bar'],
        rules: ['rule-api-security', 'rule-copan-design-system'],
      }),
    });

    if (res.ok) {
      showToast('Módulo cadastrado com sucesso!', 'success');
      closeGenericModal();
      if (state.currentView === 'catalog-modules') renderModulesView(document.getElementById('view-container'));
      refreshBadges();
    }
  } catch (err) {
    showToast('Erro ao cadastrar módulo', 'error');
  }
}

function openCreateRuleModal() {
  const modal = document.getElementById('generic-modal');
  const content = document.getElementById('generic-modal-content');

  content.innerHTML = `
    <div class="flex items-center justify-between border-b border-[#E1E9EF] pb-4 mb-4">
      <h2 class="text-base font-bold text-[#121619]">Cadastrar Golden Rule</h2>
      <button onclick="closeGenericModal()" class="p-1.5 rounded-lg text-[#878D96] hover:text-[#121619] hover:bg-[#F2F4F8]">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <form onsubmit="handleCreateRuleSubmit(event)" class="space-y-3.5 text-xs">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-semibold text-[#121619] mb-1">Título da Regra *</label>
          <input id="new-rule-name" required placeholder="Ex: Zero-Trust Input Validation" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs" />
        </div>
        <div>
          <label class="block font-semibold text-[#121619] mb-1">Prioridade</label>
          <select id="new-rule-priority" class="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs">
            <option value="Required">Required (Mandatória)</option>
            <option value="Recommended">Recommended</option>
            <option value="Optional">Optional</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block font-semibold text-[#121619] mb-1">Diretriz da Regra *</label>
        <textarea id="new-rule-desc" required rows="2" placeholder="O que é proibido e qual padrão deve ser seguido..." class="w-full p-3 rounded-lg bg-white border border-[#E1E9EF] text-[#121619] focus:outline-none focus:border-[#F56738] shadow-2xs"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-semibold text-[#991818] mb-1">Exemplo Incorreto (Anti-pattern)</label>
          <textarea id="new-rule-bad" rows="3" placeholder="// Exemplo incorreto..." class="w-full p-2.5 rounded-lg bg-[#FDECEC] border border-[#F7C2C2] text-[#991818] font-mono text-[11px] focus:outline-none"></textarea>
        </div>
        <div>
          <label class="block font-semibold text-[#115644] mb-1">Padrão Recomendado (Copan)</label>
          <textarea id="new-rule-good" rows="3" placeholder="// Padrão correto..." class="w-full p-2.5 rounded-lg bg-[#E8F5F0] border border-[#A2DEC9] text-[#115644] font-mono text-[11px] focus:outline-none"></textarea>
        </div>
      </div>

      <div class="pt-4 border-t border-[#E1E9EF] flex justify-end gap-2.5">
        <button type="button" onclick="closeGenericModal()" class="btn-copan-secondary px-4 py-2">Cancelar</button>
        <button type="submit" class="btn-copan-primary px-4 py-2 font-semibold">Salvar Regra</button>
      </div>
    </form>
  `;
  modal.classList.remove('hidden');
  lucide.createIcons();
}

async function handleCreateRuleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('new-rule-name').value.trim();
  const priority = document.getElementById('new-rule-priority').value;
  const description = document.getElementById('new-rule-desc').value.trim();
  const bad_example = document.getElementById('new-rule-bad').value;
  const good_example = document.getElementById('new-rule-good').value;

  try {
    const res = await fetch('/api/v1/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        priority,
        description,
        bad_example,
        good_example,
        category: 'Architecture',
      }),
    });

    if (res.ok) {
      showToast('Golden Rule cadastrada!', 'success');
      closeGenericModal();
      if (state.currentView === 'knowledge-rules') renderRulesView(document.getElementById('view-container'));
      refreshBadges();
    }
  } catch (err) {
    showToast('Erro ao cadastrar regra', 'error');
  }
}

function openCreateTemplateModal() {
  openCreateProjectModal(); // Similar flow
}

function openCreateSpecModal() {
  showToast('Especificações são sincronizadas automaticamente a partir dos arquivos SDD da Olivelas.', 'info');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderStatusBadge(status) {
  const map = {
    Draft: 'badge-draft',
    Planning: 'badge-planning',
    Ready: 'badge-ready',
    Archived: 'badge-archived',
    Published: 'badge-published',
    Deprecated: 'badge-deprecated',
  };
  return `<span class="badge-status ${map[status] || 'badge-draft'}">${status}</span>`;
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getEntityIcon(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('comp')) return 'boxes';
  if (t.includes('mod')) return 'package';
  if (t.includes('tpl') || t.includes('template')) return 'layout-template';
  if (t.includes('rule')) return 'shield-check';
  if (t.includes('spec')) return 'book-open';
  if (t.includes('arch')) return 'network';
  if (t.includes('proj')) return 'folder-kanban';
  if (t.includes('blue')) return 'file-code-2';
  return 'box';
}

function getActivityIcon(action) {
  if (action.includes('PROJECT')) return 'folder-kanban';
  if (action.includes('BLUEPRINT')) return 'file-code-2';
  if (action.includes('COMPONENT')) return 'boxes';
  if (action.includes('RULE')) return 'shield-check';
  return 'activity';
}
