const API_BASE = "/api/v1";

export class ApiError extends Error {
  status: number;
  detail?: unknown;
  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export function getTokens() {
  if (typeof window === "undefined") return { access: null as string | null, refresh: null as string | null };
  return {
    access: localStorage.getItem("crm_access_token"),
    refresh: localStorage.getItem("crm_refresh_token"),
  };
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("crm_access_token", access);
  localStorage.setItem("crm_refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("crm_access_token");
  localStorage.removeItem("crm_refresh_token");
}

async function tryRefreshAccessToken(): Promise<boolean> {
  const { refresh } = getTokens();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    const text = await res.text();
    let body: { accessToken?: string; refreshToken?: string } = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      return false;
    }
    if (!res.ok || !body.accessToken || !body.refreshToken) return false;
    setTokens(body.accessToken, body.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean; _retried?: boolean } = {}
): Promise<T> {
  const { auth = true, _retried, ...init } = options;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");

  if (auth) {
    const { access } = getTokens();
    if (access) headers.set("Authorization", `Bearer ${access}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch (e) {
    const hint =
      typeof window !== "undefined" && window.location?.hostname
        ? " Start the API (e.g. port 4100) and ensure Next.js can reach it (API_URL / rewrites)."
        : "";
    const msg =
      e instanceof TypeError && String(e.message).includes("fetch")
        ? `Cannot reach the API.${hint}`
        : e instanceof Error
          ? e.message
          : "Network error";
    throw new ApiError(msg, 0, e);
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (res.status === 401 && auth && !_retried) {
    const ok = await tryRefreshAccessToken();
    if (ok) return apiFetch<T>(path, { ...options, _retried: true });
  }

  if (!res.ok) {
    let msg = (data as { message?: string })?.message || `Request failed (${res.status})`;
    if (typeof msg === "string") {
      const looksHtml = /<html[\s>]|<!DOCTYPE/i.test(msg);
      const generic500 = res.status === 500 && /internal server error/i.test(msg);
      if (looksHtml || generic500) {
        msg =
          "Could not reach the CRM API (proxy returned an error page). Start the API on port 4100, or set API_URL in web/.env.local to the correct base URL (e.g. http://127.0.0.1:4100).";
      }
    }
    throw new ApiError(msg, res.status, data);
  }
  return data as T;
}
