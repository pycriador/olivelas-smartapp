/**
 * Supabase Direct Data & IAM Bridge (`olivelas_smartapp` Isolated Schema)
 * =======================================================================
 * Connects the React Frontend directly to Supabase PostgREST (`VITE_SUPABASE_URL` + `VITE_SUPABASE_KEY`)
 * using the isolated PostgreSQL schema `olivelas_smartapp`.
 *
 * Used automatically when deployed to static hosting (GitHub Pages) or when the local FastAPI
 * server is offline, ensuring 100% end-to-end functionality with the same Supabase database.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';
const SUPABASE_SCHEMA = import.meta.env.VITE_SUPABASE_SCHEMA || 'olivelas_smartapp';

export const isSupabaseConfigured = (): boolean => Boolean(SUPABASE_URL && SUPABASE_KEY);

export const getSupabaseConfig = () => ({
  url: SUPABASE_URL,
  key: SUPABASE_KEY,
  schema: SUPABASE_SCHEMA,
  isConfigured: isSupabaseConfigured(),
});

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomHex(bytes: number = 8): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPasswordWebCrypto(password: string, salt?: string): Promise<string> {
  const s = salt || randomHex(16);
  const digest = await sha256Hex(`${s}:${password}`);
  return `sha256$${s}$${digest}`;
}

export async function verifyPasswordWebCrypto(plain: string, storedHash: string): Promise<boolean> {
  if (!plain || !storedHash) return false;
  if (storedHash.startsWith('sha256$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const expected = await hashPasswordWebCrypto(plain, parts[1]);
    return expected === storedHash;
  }
  return false;
}

async function sbFetch<T = any>(
  tableOrPath: string,
  options: {
    method?: string;
    query?: string;
    body?: any;
    prefer?: string;
  } = {}
): Promise<T> {
  const method = options.method || 'GET';
  const qs = options.query ? `?${options.query}` : '';
  const url = `${SUPABASE_URL}/rest/v1/${tableOrPath}${qs}`;

  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Accept-Profile': SUPABASE_SCHEMA,
    'Content-Profile': SUPABASE_SCHEMA,
    'Content-Type': 'application/json',
  };
  if (options.prefer) {
    headers['Prefer'] = options.prefer;
  } else if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    headers['Prefer'] = 'return=representation';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let errText = res.statusText;
    try {
      const errJson = await res.json();
      errText = errJson.message || errJson.details || errJson.hint || errText;
    } catch {
      // ignore
    }
    throw new Error(errText);
  }

  if (res.status === 204) return [] as unknown as T;
  const text = await res.text();
  return text ? JSON.parse(text) : ([] as unknown as T);
}

async function getSystemState<T = any>(key: string, fallback: T): Promise<T> {
  try {
    const rows = await sbFetch<Array<{ key: string; value: T }>>('system_states', {
      query: `key=eq.${encodeURIComponent(key)}&select=key,value`,
    });
    if (rows && rows.length > 0 && rows[0].value !== undefined) {
      return rows[0].value;
    }
  } catch {
    // ignore
  }
  return fallback;
}

async function setSystemState(key: string, value: any): Promise<void> {
  await sbFetch('system_states', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: { key, value },
  });
}

function paginate<T>(items: T[], searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.max(1, parseInt(searchParams.get('page_size') || '50', 10));
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return {
    data: paged,
    meta: {
      page,
      page_size: pageSize,
      total,
      total_items: total,
      total_pages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

export async function handleSupabaseBridgeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const method = (options.method || 'GET').toUpperCase();
  const parsedUrl = new URL(endpoint, 'http://localhost');
  const path = parsedUrl.pathname.replace(/^\/api\/v1/, '');
  const sp = parsedUrl.searchParams;
  const body = options.body && typeof options.body === 'string' ? JSON.parse(options.body) : options.body;

  // ---------------------------------------------------------------------------
  // 1. IAM Auth & Bootstrap (First User = Global Admin)
  // ---------------------------------------------------------------------------
  if (path === '/iam/bootstrap-status' || path === '/iam/auth/bootstrap-status') {
    const users = await sbFetch<any[]>('users', { query: 'select=id' });
    const total = users.length;
    return {
      data: {
        total_users: total,
        has_users: total > 0,
        first_user_will_be_global_admin: total === 0,
        initial_role_on_signup: total === 0 ? 'Global Admin' : 'Viewer',
        initial_group_on_signup: total === 0 ? 'grp_admin' : 'grp_viewers',
      },
    };
  }

  if ((path === '/iam/auth/signup' || path === '/iam/signup') && method === 'POST') {
    const email = String(body?.email || '').trim().toLowerCase();
    const username = String(body?.username || email.split('@')[0] || '').trim().toLowerCase();
    const name = String(body?.name || username).trim();
    const password = String(body?.password || '');

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      throw new Error('A senha deve ter entre 8 e 128 caracteres e conter letras e números.');
    }

    const allUsers = await sbFetch<any[]>('users', { query: 'select=id,email,username' });
    const conflict = allUsers.find(
      (u) => String(u.email).toLowerCase() === email || String(u.username).toLowerCase() === username
    );
    if (conflict) {
      throw new Error(`Usuário ou e-mail já cadastrado (${email}).`);
    }

    const isFirstUser = allUsers.length === 0;
    const assignedRole = isFirstUser ? 'Global Admin' : 'Viewer';
    const assignedGroup = isFirstUser ? 'grp_admin' : 'grp_viewers';
    const userId = `usr_${randomHex(6)}`;
    const nowIso = new Date().toISOString();
    const parts = name.split(/\s+/);
    const passwordHash = await hashPasswordWebCrypto(password);

    const newUserRow = {
      id: userId,
      name,
      first_name: body?.first_name || parts[0] || username,
      last_name: body?.last_name || (parts.length > 1 ? parts[parts.length - 1] : ''),
      username,
      email,
      password_hash: passwordHash,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
      role: assignedRole,
      status: 'Active',
      primary_group_id: assignedGroup,
      language: body?.language || 'pt-BR',
      timezone_name: body?.timezone_name || 'America/Sao_Paulo',
      is_active: true,
      must_change_password: false,
      failed_login_attempts: 0,
      last_login_at: nowIso,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const inserted = await sbFetch<any[]>('users', { method: 'POST', body: newUserRow });
    const savedUser = inserted?.[0] || newUserRow;

    try {
      await sbFetch('user_groups', {
        method: 'POST',
        prefer: 'resolution=ignore-duplicates',
        body: {
          id: `ug_${randomHex(6)}`,
          user_id: savedUser.id,
          group_id: savedUser.primary_group_id || assignedGroup,
          created_at: nowIso,
        },
      });
    } catch {
      // Trigger may have already inserted user_group
    }

    if (isFirstUser) {
      await setSystemState('active_user_id', { user_id: savedUser.id });
    }

    const perms = await sbFetch<any[]>('permissions', { query: 'select=code' });
    const permCodes = savedUser.role === 'Global Admin' ? perms.map((p) => p.code) : ['components:read', 'projects:read'];
    const token = `sb_jwt_${savedUser.id}_${randomHex(12)}`;

    const userInfo = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role,
      avatar_url: savedUser.avatar_url,
      status: savedUser.status,
      must_change_password: false,
      permissions: permCodes,
      groups: [savedUser.role === 'Global Admin' ? 'Administradores' : 'Visualizadores & Auditores'],
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('loft_user_info', JSON.stringify(userInfo));
    }

    return {
      data: {
        access_token: token,
        refresh_token: `sb_ref_${savedUser.id}_${randomHex(12)}`,
        token_type: 'bearer',
        expires_in: 86400,
        user: userInfo,
      },
    };
  }

  if ((path === '/iam/auth/login' || path === '/iam/login') && method === 'POST') {
    const ident = String(body?.username_or_email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    const allUsers = await sbFetch<any[]>('users', { query: 'select=*' });
    const user = allUsers.find(
      (u) => String(u.email).toLowerCase() === ident || String(u.username).toLowerCase() === ident
    );
    if (!user) {
      throw new Error('Credenciais inválidas. Verifique seu e-mail/usuário e senha.');
    }

    const valid = await verifyPasswordWebCrypto(password, user.password_hash);
    if (!valid) {
      throw new Error('Credenciais inválidas. Verifique seu e-mail/usuário e senha.');
    }

    const perms = await sbFetch<any[]>('permissions', { query: 'select=code' });
    const permCodes = user.role === 'Global Admin' ? perms.map((p) => p.code) : ['components:read', 'projects:read'];
    const token = `sb_jwt_${user.id}_${randomHex(12)}`;

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar_url: user.avatar_url,
      status: user.status,
      must_change_password: Boolean(user.must_change_password),
      permissions: permCodes,
      groups: [user.role === 'Global Admin' ? 'Administradores' : 'Visualizadores & Auditores'],
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('loft_user_info', JSON.stringify(userInfo));
    }

    return {
      data: {
        access_token: token,
        refresh_token: `sb_ref_${user.id}_${randomHex(12)}`,
        token_type: 'bearer',
        expires_in: 86400,
        user: userInfo,
      },
    };
  }

  if (path === '/iam/auth/me' || path === '/iam/me' || path === '/rbac/current-user') {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('loft_user_info') : null;
    if (stored) {
      return { data: JSON.parse(stored) };
    }
    const users = await sbFetch<any[]>('users', { query: 'select=*&order=created_at.asc&limit=1' });
    if (users.length > 0) {
      const u = users[0];
      return {
        data: {
          id: u.id,
          name: u.name,
          email: u.email,
          username: u.username,
          role: u.role,
          avatar_url: u.avatar_url,
          status: u.status,
          is_active: u.is_active,
          permissions: ['*'],
          groups: ['Administradores'],
        },
      };
    }
    return {
      data: {
        id: 'usr_bootstrap',
        name: 'Visitante (Aguardando 1º Cadastro)',
        email: '',
        username: 'guest',
        role: 'Global Admin',
        status: 'Active',
        is_active: true,
        permissions: ['*'],
        groups: [],
      },
    };
  }

  if (path === '/rbac/session-token') {
    const me = await handleSupabaseBridgeRequest('/api/v1/iam/auth/me');
    return {
      data: {
        access_token: `sb_session_${randomHex(8)}`,
        token_type: 'Bearer',
        user: me.data,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // 2. Dashboard Summary
  // ---------------------------------------------------------------------------
  if (path === '/dashboard' || path === '/dashboard/summary') {
    const [components, modules, templates, rules, specs, archs, projects, blueprints, logs] = await Promise.all([
      sbFetch<any[]>('components', { query: 'select=id,name,category,type,status,version,updated_at' }),
      sbFetch<any[]>('modules', { query: 'select=id,name,category,status' }),
      sbFetch<any[]>('templates', { query: 'select=id,name,category,status' }),
      sbFetch<any[]>('rules', { query: 'select=id,name,category,priority,status' }),
      sbFetch<any[]>('specifications', { query: 'select=id,name,title,category,status' }),
      sbFetch<any[]>('architectures', { query: 'select=id,name,category,status' }),
      sbFetch<any[]>('projects', { query: 'select=*' }),
      sbFetch<any[]>('blueprints', { query: 'select=*' }),
      sbFetch<any[]>('audit_logs', { query: 'select=*&order=timestamp.desc&limit=15' }),
    ]);

    return {
      data: {
        metrics: {
          total_components: components.length,
          total_modules: modules.length,
          total_templates: templates.length,
          total_rules: rules.length,
          total_specifications: specs.length,
          total_architectures: archs.length,
          total_projects: projects.length,
          total_blueprints: blueprints.length,
        },
        recent_projects: projects.slice(0, 5),
        recent_blueprints: blueprints.slice(0, 5),
        recent_audit_logs: logs,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // 3. Generic Table Handlers for Catalog, Knowledge, Projects, Blueprints, IAM
  // ---------------------------------------------------------------------------
  const tableRoutes: Record<string, string> = {
    '/components': 'components',
    '/catalog/components': 'components',
    '/catalog/modules': 'modules',
    '/modules': 'modules',
    '/templates': 'templates',
    '/catalog/templates': 'templates',
    '/rules': 'rules',
    '/specifications': 'specifications',
    '/architectures': 'architectures',
    '/projects': 'projects',
    '/blueprints': 'blueprints',
    '/iam/users': 'users',
    '/rbac/users': 'users',
    '/iam/groups': 'groups',
    '/iam/roles': 'iam_roles',
    '/iam/permissions': 'permissions',
    '/iam/sessions': 'sessions',
    '/iam/invitations': 'invitations',
    '/iam/shares': 'shares',
    '/audit/logs': 'audit_logs',
    '/audit': 'audit_logs',
    '/knowledge/docs': 'knowledge_documents',
  };

  for (const [routePrefix, tableName] of Object.entries(tableRoutes)) {
    if (path === routePrefix) {
      if (method === 'GET') {
        const rows = await sbFetch<any[]>(tableName, { query: 'select=*' });
        const q = (sp.get('search') || sp.get('q') || '').toLowerCase();
        const cat = sp.get('category');
        let filtered = rows;
        if (cat) {
          filtered = filtered.filter((r) => String(r.category || '').toLowerCase() === cat.toLowerCase());
        }
        if (q) {
          filtered = filtered.filter(
            (r) =>
              String(r.name || r.title || '').toLowerCase().includes(q) ||
              String(r.description || r.summary || '').toLowerCase().includes(q) ||
              String(r.email || '').toLowerCase().includes(q)
          );
        }
        return paginate(filtered, sp);
      }
      if (method === 'POST') {
        if (tableName === 'users') {
          const signupRes = await handleSupabaseBridgeRequest('/api/v1/iam/auth/signup', {
            method: 'POST',
            body: JSON.stringify(body),
          });
          return { data: signupRes.data.user };
        }
        const nowIso = new Date().toISOString();
        const prefix = tableName.slice(0, 3);
        const newRow = {
          id: body?.id || `${prefix}_${randomHex(5)}`,
          ...body,
          created_at: nowIso,
          updated_at: nowIso,
        };
        const inserted = await sbFetch<any[]>(tableName, { method: 'POST', body: newRow });
        return { data: inserted?.[0] || newRow };
      }
    }

    if (path.startsWith(`${routePrefix}/`)) {
      const subPath = path.slice(routePrefix.length + 1);
      if (!subPath.includes('/')) {
        const itemId = decodeURIComponent(subPath);
        if (method === 'GET') {
          const rows = await sbFetch<any[]>(tableName, {
            query: `id=eq.${encodeURIComponent(itemId)}&select=*`,
          });
          if (!rows.length) throw new Error(`Item ${itemId} não encontrado.`);
          return { data: rows[0] };
        }
        if (method === 'PUT' || method === 'PATCH') {
          const updated = await sbFetch<any[]>(tableName, {
            method: 'PATCH',
            query: `id=eq.${encodeURIComponent(itemId)}`,
            body: { ...body, updated_at: new Date().toISOString() },
          });
          return { data: updated?.[0] || { id: itemId, ...body } };
        }
        if (method === 'DELETE') {
          await sbFetch(tableName, {
            method: 'DELETE',
            query: `id=eq.${encodeURIComponent(itemId)}`,
          });
          return { data: { deleted: true, id: itemId } };
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. IAM Matrix & Dashboard Stats
  // ---------------------------------------------------------------------------
  if (path === '/iam/permissions/matrix' || path === '/iam/matrix') {
    const [perms, roles, rolePerms] = await Promise.all([
      sbFetch<any[]>('permissions', { query: 'select=*' }),
      sbFetch<any[]>('iam_roles', { query: 'select=*' }),
      sbFetch<any[]>('role_permissions', { query: 'select=*' }),
    ]);
    const roleMap = Object.fromEntries(roles.map((r) => [r.id, r.name]));
    const matrix = perms.map((p) => {
      const grantedRoleIds = rolePerms.filter((rp) => rp.permission_id === p.id).map((rp) => rp.role_id);
      return {
        permission_id: p.id,
        code: p.code,
        name: p.name,
        module: p.module,
        category: p.category,
        description: p.description,
        granted_roles: grantedRoleIds.map((rid) => roleMap[rid]).filter(Boolean),
        granted_groups: [],
      };
    });
    return { data: matrix, meta: { page: 1, page_size: matrix.length, total: matrix.length } };
  }

  if (path === '/iam/dashboard/stats') {
    const [users, groups, roles, perms, sessions] = await Promise.all([
      sbFetch<any[]>('users', { query: 'select=id,is_active' }),
      sbFetch<any[]>('groups', { query: 'select=id' }),
      sbFetch<any[]>('iam_roles', { query: 'select=id' }),
      sbFetch<any[]>('permissions', { query: 'select=id' }),
      sbFetch<any[]>('sessions', { query: 'select=id,is_active' }),
    ]);
    return {
      data: {
        total_users: users.length,
        active_users: users.filter((u) => u.is_active).length,
        total_groups: groups.length,
        total_roles: roles.length,
        total_permissions: perms.length,
        active_sessions: sessions.filter((s) => s.is_active).length,
        pending_invitations: 0,
        total_shares: 0,
        recent_logs: [],
      },
    };
  }

  // ---------------------------------------------------------------------------
  // 5. Settings, AI Providers, AI Agents & Gateway (via system_states)
  // ---------------------------------------------------------------------------
  if (path.startsWith('/ai/settings') || path.startsWith('/ai/providers')) {
    const cfg = await getSystemState('ai_providers_config', {
      default_provider: 'gemini',
      default_model: 'gemini-2.5-flash',
      providers: [],
    });
    return { data: cfg };
  }

  if (path.startsWith('/ai/agents')) {
    const agents = await getSystemState('ai_agents_catalog', []);
    return { data: agents, meta: { page: 1, page_size: agents.length || 20, total: agents.length } };
  }

  if (path.startsWith('/ai/gateway')) {
    const [policy, metrics] = await Promise.all([
      getSystemState('ai_gateway_policy', {}),
      getSystemState('ai_gateway_metrics', {}),
    ]);
    return { data: { policy, metrics, recent_logs: [] } };
  }

  if (path.startsWith('/settings')) {
    const [customCats, rbacSettings] = await Promise.all([
      getSystemState('custom_categories', {}),
      getSystemState('category_rbac_settings', {
        roles_can_manage: ['Global Admin', 'Admin'],
        roles_can_create: ['Global Admin', 'Admin', 'Editor'],
        roles_can_delete: ['Global Admin'],
      }),
    ]);
    return {
      data: {
        categories: Object.values(customCats),
        rbac_settings: rbacSettings,
      },
    };
  }

  if (path === '/knowledge/favorites') {
    return { favorites: [], total: 0 };
  }

  return { data: [] };
}
