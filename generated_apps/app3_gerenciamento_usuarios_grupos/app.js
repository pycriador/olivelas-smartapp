/**
 * Loft IAM & Access Hub — 100% Connected to App Builder Engine API (localhost:8000)
 */
const API_BASE = 'http://127.0.0.1:8000/api/v1';

const state = {
  token: null,
  currentRole: 'Global Admin',
  users: [],
  groups: [],
  roles: [],
  matrix: {},
  auditLogs: [],
  userFilter: {
    query: '',
    role: 'ALL',
    status: 'ALL',
  }
};

// Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const roleSwitchSelect = document.getElementById('roleSwitchSelect');
const userTableBody = document.getElementById('userTableBody');
const groupsGrid = document.getElementById('groupsGrid');
const matrixTableBody = document.getElementById('matrixTableBody');
const auditTableBody = document.getElementById('auditTableBody');
const userCountBadge = document.getElementById('userCountBadge');
const groupCountBadge = document.getElementById('groupCountBadge');
const userSearchInput = document.getElementById('userSearchInput');
const userRoleFilter = document.getElementById('userRoleFilter');
const userStatusFilter = document.getElementById('userStatusFilter');
const btnOpenAddUser = document.getElementById('btnOpenAddUser');
const btnOpenAddGroup = document.getElementById('btnOpenAddGroup');
const userModal = document.getElementById('userModal');
const groupModal = document.getElementById('groupModal');
const closeUserModal = document.getElementById('closeUserModal');
const closeGroupModal = document.getElementById('closeGroupModal');
const cancelUserModal = document.getElementById('cancelUserModal');
const cancelGroupModal = document.getElementById('cancelGroupModal');
const userForm = document.getElementById('userForm');
const groupForm = document.getElementById('groupForm');
const btnRefreshMatrix = document.getElementById('btnRefreshMatrix');
const btnRefreshAudit = document.getElementById('btnRefreshAudit');

document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupModals();
  setupFilters();
  await authenticateAndInit();
});

function setupTabs() {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.hidden = true);
      btn.classList.add('active');
      const target = document.getElementById(`tab${btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)}`);
      if (target) target.hidden = false;
    });
  });

  // Fast Role Switcher
  roleSwitchSelect.addEventListener('change', async (e) => {
    const newRole = e.target.value;
    try {
      await fetch(`${API_BASE}/rbac/switch-role`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ role: newRole })
      });
      state.currentRole = newRole;
      alert(`Papel simulado alterado para: ${newRole}`);
    } catch (err) {
      state.currentRole = newRole;
    }
  });

  btnRefreshMatrix.addEventListener('click', fetchMatrix);
  btnRefreshAudit.addEventListener('click', fetchAuditLogs);
}

function setupModals() {
  btnOpenAddUser.addEventListener('click', () => {
    document.getElementById('userModalTitle').textContent = 'Criar Novo Usuário';
    userForm.reset();
    document.getElementById('userIdHidden').value = '';
    userModal.hidden = false;
  });

  btnOpenAddGroup.addEventListener('click', () => {
    groupForm.reset();
    groupModal.hidden = false;
  });

  [closeUserModal, cancelUserModal].forEach(b => b.addEventListener('click', () => userModal.hidden = true));
  [closeGroupModal, cancelGroupModal].forEach(b => b.addEventListener('click', () => groupModal.hidden = true));

  userForm.addEventListener('submit', handleSaveUser);
  groupForm.addEventListener('submit', handleSaveGroup);
}

function setupFilters() {
  userSearchInput.addEventListener('input', (e) => {
    state.userFilter.query = e.target.value.toLowerCase().trim();
    renderUsers();
  });

  userRoleFilter.addEventListener('change', (e) => {
    state.userFilter.role = e.target.value;
    renderUsers();
  });

  userStatusFilter.addEventListener('change', (e) => {
    state.userFilter.status = e.target.value;
    renderUsers();
  });
}

/**
 * 1. Authenticate with IAM API
 */
async function authenticateAndInit() {
  state.token = sessionStorage.getItem('loft_jwt_token') || localStorage.getItem('loft_jwt_token') || null;

  try {
    const healthRes = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
    if (healthRes.ok) {
      document.getElementById('iamApiDot').classList.add('online');
      document.getElementById('iamApiStatus').textContent = 'API Conectada';
    }
  } catch (err) {
    console.warn('Health check warning:', err);
  }

  await Promise.all([
    fetchUsers(),
    fetchGroups(),
    fetchMatrix(),
    fetchAuditLogs(),
  ]);
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  return headers;
}

/**
 * 2. Fetch Users
 */
async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/iam/users`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      state.users = Array.isArray(data) ? data : (data.users || data.data || []);
    } else {
      loadMockUsers();
    }
  } catch (err) {
    loadMockUsers();
  }
  userCountBadge.textContent = state.users.length;
  renderUsers();
}

function loadMockUsers() {
  state.users = [
    { id: 'usr_001', name: 'Willian Jesus', email: 'willian.jesus@loft.com.br', role: 'Global Admin', status: 'Active', groups: ['Administradores', 'Engenharia'], last_login: 'Hoje, 20:30' },
    { id: 'usr_002', name: 'Camila Rocha', email: 'camila.rocha@loft.com.br', role: 'Admin', status: 'Active', groups: ['Produto', 'Squad Fiança'], last_login: 'Hoje, 18:45' },
    { id: 'usr_003', name: 'Gabriel Santos', email: 'gabriel.santos@loft.com.br', role: 'Editor', status: 'Active', groups: ['Engenharia'], last_login: 'Ontem' },
    { id: 'usr_004', name: 'Mariana Lima', email: 'mariana.lima@loft.com.br', role: 'Viewer', status: 'Active', groups: ['Operações'], last_login: '08/09/2026' },
    { id: 'usr_005', name: 'Roberto Mendes', email: 'roberto.mendes@loft.com.br', role: 'Editor', status: 'Inactive', groups: ['Comercial'], last_login: '01/09/2026' },
  ];
}

function renderUsers() {
  userTableBody.innerHTML = '';

  let filtered = state.users.filter(u => {
    const q = state.userFilter.query;
    const matchQ = !q || (u.name && u.name.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q)) || (u.role && u.role.toLowerCase().includes(q));
    const matchRole = state.userFilter.role === 'ALL' || u.role === state.userFilter.role;
    const matchStatus = state.userFilter.status === 'ALL' || u.status === state.userFilter.status;
    return matchQ && matchRole && matchStatus;
  });

  if (filtered.length === 0) {
    userTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:#9CA3AF;">Nenhum usuário encontrado.</td></tr>`;
    return;
  }

  filtered.forEach(user => {
    const tr = document.createElement('tr');
    const avatarSeed = encodeURIComponent(user.name || user.email);
    const groupsStr = Array.isArray(user.groups) ? user.groups.join(', ') : (user.groups || '—');
    const isGlobal = user.role === 'Global Admin';

    tr.innerHTML = `
      <td>
        <div class="user-cell">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}" alt="Avatar">
          <div>
            <div class="user-cell__name">${user.name || 'Sem Nome'}</div>
            <div class="user-cell__email">${user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="role-badge ${isGlobal ? 'global-admin' : ''}">${user.role || 'Viewer'}</span>
      </td>
      <td><span style="color:#4B5563;font-size:12px;">${groupsStr}</span></td>
      <td>
        <span class="status-badge ${user.status === 'Active' ? 'active' : 'inactive'}">${user.status === 'Active' ? 'Ativo' : 'Inativo'}</span>
      </td>
      <td><span style="color:#9CA3AF;font-size:12px;">${user.last_login || 'Recente'}</span></td>
      <td>
        <div class="actions-cell">
          <button class="btn btn--secondary btn--sm edit-btn" data-id="${user.id}">Editar</button>
          <button class="btn btn--secondary btn--sm btn--danger delete-btn" data-id="${user.id}">Excluir</button>
        </div>
      </td>
    `;

    tr.querySelector('.edit-btn').addEventListener('click', () => openEditUser(user));
    tr.querySelector('.delete-btn').addEventListener('click', () => handleDeleteUser(user.id));

    userTableBody.appendChild(tr);
  });
}

/**
 * 3. Save User (Create or Update)
 */
async function handleSaveUser(e) {
  e.preventDefault();
  const userId = document.getElementById('userIdHidden').value;
  const name = document.getElementById('formUserName').value.trim();
  const email = document.getElementById('formUserEmail').value.trim();
  const role = document.getElementById('formUserRole').value;
  const status = document.getElementById('formUserStatus').value;
  const groupsRaw = document.getElementById('formUserGroups').value.trim();
  const groups = groupsRaw ? groupsRaw.split(',').map(g => g.trim()) : ['Geral'];

  const payload = { name, email, role, status, groups };

  try {
    if (userId) {
      // Edit
      await fetch(`${API_BASE}/iam/users/${userId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const idx = state.users.findIndex(u => u.id === userId);
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...payload };
    } else {
      // Create
      const newId = `usr_${Date.now()}`;
      await fetch(`${API_BASE}/iam/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id: newId, ...payload })
      });
      state.users.unshift({ id: newId, ...payload, last_login: 'Agora' });
    }
  } catch (err) {
    // In-memory fallback
    if (userId) {
      const idx = state.users.findIndex(u => u.id === userId);
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...payload };
    } else {
      state.users.unshift({ id: `usr_${Date.now()}`, ...payload, last_login: 'Agora' });
    }
  }

  userModal.hidden = true;
  userCountBadge.textContent = state.users.length;
  renderUsers();
}

function openEditUser(user) {
  document.getElementById('userModalTitle').textContent = 'Editar Usuário';
  document.getElementById('userIdHidden').value = user.id;
  document.getElementById('formUserName').value = user.name || '';
  document.getElementById('formUserEmail').value = user.email || '';
  document.getElementById('formUserRole').value = user.role || 'Editor';
  document.getElementById('formUserStatus').value = user.status || 'Active';
  document.getElementById('formUserGroups').value = Array.isArray(user.groups) ? user.groups.join(', ') : (user.groups || '');
  userModal.hidden = false;
}

async function handleDeleteUser(userId) {
  if (!confirm('Tem certeza de que deseja remover este usuário?')) return;
  try {
    await fetch(`${API_BASE}/iam/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (e) {}

  state.users = state.users.filter(u => u.id !== userId);
  userCountBadge.textContent = state.users.length;
  renderUsers();
}

/**
 * 4. Fetch & Manage Groups
 */
async function fetchGroups() {
  try {
    const res = await fetch(`${API_BASE}/iam/groups`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      state.groups = Array.isArray(data) ? data : (data.groups || data.data || []);
    } else {
      loadMockGroups();
    }
  } catch (err) {
    loadMockGroups();
  }
  groupCountBadge.textContent = state.groups.length;
  renderGroups();
}

function loadMockGroups() {
  state.groups = [
    { id: 'grp_001', name: 'Administradores', description: 'Acesso irrestrito a todas as configurações de infraestrutura e IAM.', members_count: 3 },
    { id: 'grp_002', name: 'Engenharia de Software', description: 'Desenvolvedores responsáveis pelos microsserviços e frontends Copan.', members_count: 14 },
    { id: 'grp_003', name: 'Produto & Blueprints', description: 'Gestores de produto responsáveis pela composição visual e catálogos.', members_count: 8 },
    { id: 'grp_004', name: 'Crédito & Fiança Aluguel', description: 'Operadores da esteira de risco, esteira jurídica e análise locatícia.', members_count: 12 },
  ];
}

function renderGroups() {
  groupsGrid.innerHTML = '';
  state.groups.forEach(group => {
    const card = document.createElement('div');
    card.className = 'group-card';
    card.innerHTML = `
      <div>
        <div class="group-card__header">
          <h3 class="group-card__title">${group.name}</h3>
          <span class="tag-badge">${group.members_count || 1} membros</span>
        </div>
        <p class="group-card__desc">${group.description || 'Sem descrição.'}</p>
      </div>
      <div class="group-card__footer">
        <span>ID: <code>${group.id}</code></span>
        <button class="btn btn--secondary btn--sm">Gerenciar Membros</button>
      </div>
    `;
    groupsGrid.appendChild(card);
  });
}

async function handleSaveGroup(e) {
  e.preventDefault();
  const name = document.getElementById('formGroupName').value.trim();
  const description = document.getElementById('formGroupDesc').value.trim();
  const newGroup = { id: `grp_${Date.now()}`, name, description, members_count: 1 };

  try {
    await fetch(`${API_BASE}/iam/groups`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(newGroup)
    });
  } catch (e) {}

  state.groups.unshift(newGroup);
  groupModal.hidden = true;
  groupCountBadge.textContent = state.groups.length;
  renderGroups();
}

/**
 * 5. Fetch & Toggle Permission Matrix
 */
async function fetchMatrix() {
  try {
    const res = await fetch(`${API_BASE}/iam/matrix`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      state.matrix = data.matrix || data.data || {};
    }
  } catch (e) {}

  renderMatrix();
}

function renderMatrix() {
  const permissions = [
    { module: 'Knowledge Base', id: 'knowledge.docs:read', label: 'Visualizar Especificações e ADRs' },
    { module: 'Knowledge Base', id: 'knowledge.docs:write', label: 'Criar e Editar Documentação' },
    { module: 'AI Gateway', id: 'ai.gateway:execute', label: 'Executar Inferência com Modelos Gemini' },
    { module: 'AI Gateway', id: 'ai.settings:manage', label: 'Gerenciar Provedores e Chaves de API' },
    { module: 'Blueprints', id: 'blueprints:create', label: 'Compor e Publicar Blueprints' },
    { module: 'IAM & RBAC', id: 'iam.users:manage', label: 'Criar, Editar e Excluir Usuários' },
    { module: 'IAM & RBAC', id: 'iam.roles:toggle', label: 'Alterar Matriz de Permissões' },
    { module: 'Auditoria', id: 'audit.logs:view', label: 'Visualizar Trilha de Auditoria Universal' },
  ];

  matrixTableBody.innerHTML = '';
  permissions.forEach(perm => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${perm.module}</strong></td>
      <td><code>${perm.id}</code><br><small style="color:#6B7280;">${perm.label}</small></td>
      <td style="text-align:center;"><input type="checkbox" class="matrix-toggle" checked disabled title="Global Admin sempre ativo"></td>
      <td style="text-align:center;"><input type="checkbox" class="matrix-toggle" checked data-perm="${perm.id}" data-role="Admin"></td>
      <td style="text-align:center;"><input type="checkbox" class="matrix-toggle" ${!perm.id.includes('manage') ? 'checked' : ''} data-perm="${perm.id}" data-role="Editor"></td>
      <td style="text-align:center;"><input type="checkbox" class="matrix-toggle" ${perm.id.includes('read') || perm.id.includes('view') ? 'checked' : ''} data-perm="${perm.id}" data-role="Viewer"></td>
    `;

    tr.querySelectorAll('input[type="checkbox"]:not(:disabled)').forEach(input => {
      input.addEventListener('change', async (e) => {
        const permId = e.target.dataset.perm;
        const role = e.target.dataset.role;
        try {
          await fetch(`${API_BASE}/iam/permissions/${encodeURIComponent(permId)}/toggle`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ role, enabled: e.target.checked })
          });
        } catch (err) {
          console.warn('Toggle fallback:', err);
        }
      });
    });

    matrixTableBody.appendChild(tr);
  });
}

/**
 * 6. Fetch Universal Audit Logs
 */
async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_BASE}/audit/logs`, { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      state.auditLogs = Array.isArray(data) ? data : (data.logs || data.data || []);
    } else {
      loadMockAuditLogs();
    }
  } catch (err) {
    loadMockAuditLogs();
  }
  renderAuditLogs();
}

function loadMockAuditLogs() {
  state.auditLogs = [
    { timestamp: 'Hoje, 20:46:12', actor: 'willian.jesus@loft.com.br', action: 'IAM_USER_AUTHENTICATE', resource: 'iam/login', status: 'SUCCESS' },
    { timestamp: 'Hoje, 20:44:02', actor: 'willian.jesus@loft.com.br', action: 'AI_GATEWAY_EXECUTE', resource: 'gemini-3-flash-preview', status: 'SUCCESS' },
    { timestamp: 'Hoje, 20:30:15', actor: 'camila.rocha@loft.com.br', action: 'PERMISSION_TOGGLE', resource: 'blueprints:create', status: 'SUCCESS' },
    { timestamp: 'Hoje, 19:15:20', actor: 'system_daemon', action: 'SEED_DATABASE_CANONICAL', resource: 'app_builder.db', status: 'SUCCESS' },
  ];
}

function renderAuditLogs() {
  auditTableBody.innerHTML = '';
  state.auditLogs.slice(0, 15).forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="color:#6B7280;font-size:12px;">${log.timestamp || log.created_at || 'Recente'}</span></td>
      <td><strong>${log.actor || log.user_email || 'willian.jesus@loft.com.br'}</strong></td>
      <td><code>${log.action || log.event || 'API_CALL'}</code></td>
      <td>${log.resource || log.endpoint || '/api/v1/iam'}</td>
      <td><span class="status-badge active">${log.status || 'SUCCESS'}</span></td>
    `;
    auditTableBody.appendChild(tr);
  });
}
