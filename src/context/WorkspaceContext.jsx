import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (api.getToken()) {
        try {
          const { user, workspace } = await api.me();
          setCurrentUser(user);
          setCurrentWorkspace(workspace);
        } catch {
          api.setToken(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  async function signup({ nom, email, pwd }) {
    const { token, user, workspace } = await api.signup({ nom, email, password: pwd });
    api.setToken(token);
    setCurrentUser(user);
    setCurrentWorkspace(workspace);
    return workspace;
  }

  async function login(email, pwd) {
    try {
      const { token, user, workspace } = await api.login({ email, password: pwd });
      api.setToken(token);
      setCurrentUser(user);
      setCurrentWorkspace(workspace);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  function loginDemo() {
    return login("demo@wazora.sn", "demo1234");
  }

  function logout() {
    api.setToken(null);
    setCurrentUser(null);
    setCurrentWorkspace(null);
  }

  async function completeOnboarding({ boutique, whatsapp, equipe }) {
    const workspace = await api.saveOnboarding({ boutique, whatsapp, equipe });
    setCurrentWorkspace(workspace);
  }

  function updateWorkspace(patch) {
    setCurrentWorkspace(ws => ({ ...ws, ...patch }));
  }

  const value = {
    workspaces: [], currentWorkspace, isAuthenticated: !!currentWorkspace, loading,
    signup, login, loginDemo, logout, updateWorkspace, completeOnboarding,
  };
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}