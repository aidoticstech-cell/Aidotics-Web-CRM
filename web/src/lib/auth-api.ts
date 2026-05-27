import { apiFetch, setTokens, clearTokens, getTokens } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  bureauId: string;
  partnerBureauId: string;
  role: string;
  permissions: string[];
};

export async function login(email: string, password: string) {
  const data = await apiFetch<{
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error("Login response was missing tokens. Check API logs.");
  }
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function register(payload: {
  bureauCode: string;
  bureauName: string;
  email: string;
  password: string;
  fullName: string;
  mobile?: string;
}) {
  const data = await apiFetch<{
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }>("/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

/** Refresh access token using refresh token from localStorage. */
export async function refreshSession(): Promise<boolean> {
  const { refresh } = getTokens();
  if (!refresh) return false;
  try {
    const data = await apiFetch<{ accessToken: string; refreshToken: string; user: AuthUser }>("/auth/refresh", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ refreshToken: refresh }),
    });
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function getMe() {
  return apiFetch<{ user: AuthUser & { bureauName?: string } }>("/auth/me");
}

export async function logout() {
  const { refresh } = getTokens();
  if (refresh) {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ refreshToken: refresh }),
      });
    } catch {
      /* ignore */
    }
  }
  clearTokens();
}
