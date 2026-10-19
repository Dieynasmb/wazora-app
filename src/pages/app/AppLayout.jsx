import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MessageCircle, ShoppingBag, Users, Package, Receipt,
  UserCog, BarChart3, LogOut
} from "lucide-react";
import { COLORS } from "../../lib/theme";
import { useWorkspace } from "../../context/WorkspaceContext";

const TABS = [
  { to: "/app", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/app/conversations", label: "Conversations", icon: MessageCircle },
  { to: "/app/pipeline", label: "Commandes", icon: ShoppingBag },
  { to: "/app/clients", label: "Clients", icon: Users },
  { to: "/app/stock", label: "Produits & Stock", icon: Package },
  { to: "/app/factures", label: "Factures", icon: Receipt },
  { to: "/app/equipe", label: "Équipe", icon: UserCog },
  { to: "/app/stats", label: "Statistiques", icon: BarChart3 },
];

export default function AppLayout() {
  const { currentWorkspace, logout } = useWorkspace();
  const navigate = useNavigate();

  const doLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="w-full min-h-screen flex" style={{ background: COLORS.paper }}>
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: COLORS.ink }}>
        <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: COLORS.gold }}>
              <MessageCircle size={16} color="#fff" />
            </div>
            <div>
              <div style={{ color: COLORS.paper, fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 15, lineHeight: 1.1 }}>
                {currentWorkspace?.boutique?.nom || "Mon espace"}
              </div>
              <div style={{ color: "rgba(246,242,232,0.5)", fontSize: 11 }}>Propulsé par Wazora</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {TABS.map(t => (
            <NavLink key={t.to} to={t.to} end={t.end}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors"
              style={({ isActive }) => ({
                background: isActive ? "rgba(198,134,43,0.15)" : "transparent",
                color: isActive ? COLORS.gold : "rgba(246,242,232,0.72)",
                fontWeight: isActive ? 600 : 400,
              })}>
              <t.icon size={16} />{t.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={doLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm" style={{ color: "rgba(246,242,232,0.6)" }}>
            <LogOut size={15} />Se déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}