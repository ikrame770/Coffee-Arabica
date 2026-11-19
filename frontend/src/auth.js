const API_URL =
  (process.env.REACT_APP_API_URL || "http://localhost:8081") + "/api";

export const getAuth = () =>
  JSON.parse(sessionStorage.getItem("auth") || "null");

export const logout = () => sessionStorage.removeItem("auth");

export async function apiFetch(path, options = {}) {
  const auth = getAuth();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `Basic ${auth.token}` }),
      ...options.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) logout();
    let message = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      if (body.message) message = body.message;
    } catch {}
    throw new Error(message);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function login(username, password) {
  const token = btoa(`${username}:${password}`);
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Basic ${token}` },
  });
  if (!res.ok) throw new Error("Identifiants incorrects");
  const me = await res.json();
  sessionStorage.setItem(
    "auth",
    JSON.stringify({
      token,
      username: me.username,
      firstName: me.firstName,
      role: me.role,
    }),
  );
  return me.role;
}

export const userApi = {
  getAll: () => apiFetch("/users"),
  create: (u) => apiFetch("/users", { method: "POST", body: JSON.stringify(u) }),
  update: (id, u) =>
    apiFetch(`/users/${id}`, { method: "PUT", body: JSON.stringify(u) }),
  setActive: (id, active) =>
    apiFetch(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    }),
};