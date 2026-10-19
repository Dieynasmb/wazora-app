import { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { emptyData } from "./seed";

export function useWorkspaceData() {
  const { currentWorkspace } = useWorkspace();
  const key = currentWorkspace ? `wazora:data:${currentWorkspace.id}` : null;
  const [data, setData] = useState(() => {
    if (!key) return emptyData();
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : emptyData();
    } catch { return emptyData(); }
  });

  useEffect(() => {
    if (!key) return;
    try {
      const raw = localStorage.getItem(key);
      setData(raw ? JSON.parse(raw) : emptyData());
    } catch { setData(emptyData()); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!key) return;
    const t = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(t);
  }, [data, key]);

  return [data, setData];
}