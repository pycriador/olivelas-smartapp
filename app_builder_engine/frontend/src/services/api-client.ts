import { handleSupabaseBridgeRequest, isSupabaseConfigured } from './supabase-bridge';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const isStaticHosting = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (import.meta.env.VITE_USE_SUPABASE_DIRECT === 'true') return true;
  return window.location.hostname.endsWith('.github.io');
};

export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
}

export interface PaginatedResult<T> {
  data: T[];
  items: T[];
  total: number;
  meta: PaginationMeta;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let bootstrapPromise: Promise<string | null> | null = null;

async function ensureSessionToken(forceRefresh: boolean = false): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  if (!forceRefresh) {
    const existing = localStorage.getItem('loft_access_token');
    if (existing) return existing;
  }

  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    try {
      // First try refresh token if available
      const refreshToken = localStorage.getItem('loft_refresh_token');
      if (refreshToken) {
        const refreshRes = await fetch(`${API_BASE_URL}/api/v1/iam/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const newAccess = refreshJson?.data?.access_token || refreshJson?.access_token;
          if (newAccess) {
            localStorage.setItem('loft_access_token', newAccess);
            return newAccess as string;
          }
        }
      }

      // Fallback to active RBAC session token for seamless workspace governance
      const sessionRes = await fetch(`${API_BASE_URL}/api/v1/rbac/session-token`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (sessionRes.ok) {
        const sessionJson = await sessionRes.json();
        const token = sessionJson?.data?.access_token || sessionJson?.access_token;
        if (token) {
          localStorage.setItem('loft_access_token', token);
          return token as string;
        }
      }
    } catch {
      // ignore network error during token bootstrap
    } finally {
      bootstrapPromise = null;
    }
    return null;
  })();

  return bootstrapPromise;
}

async function rawFetchJson(endpoint: string, options: RequestInit = {}, isRetry: boolean = false): Promise<any> {
  if (isStaticHosting() && isSupabaseConfigured()) {
    return handleSupabaseBridgeRequest(endpoint, options);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const isPublicAuthEndpoint =
    endpoint.includes('/auth/login') ||
    endpoint.includes('/auth/signup') ||
    endpoint.includes('/bootstrap-status') ||
    endpoint.includes('/rbac/session-token');

  let token = typeof window !== 'undefined' ? localStorage.getItem('loft_access_token') : null;
  if (!token && !isPublicAuthEndpoint) {
    token = await ensureSessionToken(false);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    if (isSupabaseConfigured()) {
      return handleSupabaseBridgeRequest(endpoint, options);
    }
    throw networkErr;
  }

  const contentType = response.headers.get('content-type') || '';
  if (
    isSupabaseConfigured() &&
    (response.status === 404 || response.status === 405 || response.status >= 502 || contentType.includes('text/html'))
  ) {
    return handleSupabaseBridgeRequest(endpoint, options);
  }

  if (response.status === 401 && !isRetry && !isPublicAuthEndpoint) {
    const refreshedToken = await ensureSessionToken(true);
    if (refreshedToken) {
      return rawFetchJson(endpoint, options, true);
    }
  }

  if (!response.ok) {
    let errorDetail = response.statusText;
    let data;
    try {
      data = await response.json();
      errorDetail = data.detail || (data.error && data.error.message) || data.message || response.statusText;
    } catch {
      // ignore
    }
    throw new ApiError(errorDetail, response.status, data);
  }

  if (response.status === 204) {
    return {};
  }

  const json = await response.json();

  // Persist refreshed token if returned in response meta (e.g. /rbac/current-user or /rbac/switch-role)
  if (json && typeof json === 'object' && json.meta && typeof json.meta.access_token === 'string') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('loft_access_token', json.meta.access_token);
    }
  }

  return json;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const json = await rawFetchJson(endpoint, options);
  // If response has { data: ... } envelope, unwrap it seamlessly
  if (json && typeof json === 'object' && 'data' in json && !('what_is_it' in json)) {
    return json.data as T;
  }
  return json as T;
}

async function requestPaginated<T>(endpoint: string, options: RequestInit = {}): Promise<PaginatedResult<T>> {
  const json = await rawFetchJson(endpoint, { method: 'GET', ...options });
  if (json && typeof json === 'object' && 'data' in json && Array.isArray(json.data)) {
    const items = json.data as T[];
    const metaRaw = json.meta || {};
    const total = typeof metaRaw.total === 'number' ? metaRaw.total : items.length;
    return {
      data: items,
      items,
      total,
      meta: {
        page: typeof metaRaw.page === 'number' ? metaRaw.page : 1,
        page_size: typeof metaRaw.page_size === 'number' ? metaRaw.page_size : items.length || 10,
        total,
      },
    };
  }
  const fallbackArray = Array.isArray(json) ? (json as T[]) : [];
  return {
    data: fallbackArray,
    items: fallbackArray,
    total: fallbackArray.length,
    meta: {
      page: 1,
      page_size: fallbackArray.length || 10,
      total: fallbackArray.length,
    },
  };
}

export const apiClient = {
  get: <T>(url: string, options?: RequestInit) => request<T>(url, { method: 'GET', ...options }),
  getPaginated: <T>(url: string, options?: RequestInit) => requestPaginated<T>(url, options),
  post: <T>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...options }),
  put: <T>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...options }),
  delete: <T>(url: string, options?: RequestInit) => request<T>(url, { method: 'DELETE', ...options }),
};
