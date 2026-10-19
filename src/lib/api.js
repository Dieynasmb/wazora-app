const API_URL = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("wazora:token");
}
function setToken(token) {
  if (token) localStorage.setItem("wazora:token", token);
  else localStorage.removeItem("wazora:token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
  return data;
}

export const api = {
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  saveOnboarding: (body) => request("/workspace/onboarding", { method: "PUT", body: JSON.stringify(body) }),

  listClients: () => request("/clients"),
  createClient: (body) => request("/clients", { method: "POST", body: JSON.stringify(body) }),
  deleteClient: (id) => request(`/clients/${id}`, { method: "DELETE" }),

  listProduits: () => request("/produits"),
  createProduit: (body) => request("/produits", { method: "POST", body: JSON.stringify(body) }),
  updateProduitStock: (id, delta) => request(`/produits/${id}/stock`, { method: "PATCH", body: JSON.stringify({ delta }) }),
  deleteProduit: (id) => request(`/produits/${id}`, { method: "DELETE" }),

  listCommandes: () => request("/commandes"),
  createCommande: (body) => request("/commandes", { method: "POST", body: JSON.stringify(body) }),
  advanceCommande: (id) => request(`/commandes/${id}/advance`, { method: "PATCH" }),
  cancelCommande: (id) => request(`/commandes/${id}/cancel`, { method: "PATCH" }),

  listFactures: () => request("/factures"),
  toggleFacture: (id) => request(`/factures/${id}/toggle`, { method: "PATCH" }),

  listEmployes: () => request("/employes"),
  createEmploye: (body) => request("/employes", { method: "POST", body: JSON.stringify(body) }),
  toggleEmploye: (id) => request(`/employes/${id}/toggle`, { method: "PATCH" }),

  listConversations: () => request("/conversations"),
  sendMessage: (clientId, texte) => request(`/conversations/${clientId}/messages`, { method: "POST", body: JSON.stringify({ texte }) }),

  setToken,
  getToken,
};