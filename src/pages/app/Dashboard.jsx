import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, ShoppingBag, Users, CircleDot, Bell, Clock, AlertTriangle, ArrowRight, Loader2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { COLORS, fmt } from "../../lib/theme";
import { useWorkspace } from "../../context/WorkspaceContext";
import { api } from "../../lib/api";

export default function Dashboard() {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listClients(), api.listProduits(), api.listCommandes()])
      .then(([cl, p, c]) => { setClients(cl); setProduits(p); setCommandes(c); })
      .finally(() => setLoading(false));
  }, []);

  const day = 86400000;
  const now = Date.now();

  const caMois = commandes.filter(c => c.statut === "livrée" && c.dateCreation > now - 30 * day).reduce((s, c) => s + c.total, 0);
  const enCours = commandes.filter(c => !["livrée", "annulée"].includes(c.statut)).length;
  const nouveauxClients = clients.filter(c => c.dateCreation > now - 30 * day).length;
  const livrees = commandes.filter(c => c.statut === "livrée").length;
  const totalCmd = commandes.length || 1;
  const tauxConv = Math.round((livrees / totalCmd) * 100);

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d0 = now - i * day;
      const label = new Date(d0).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
      const ca = commandes.filter(c => c.statut === "livrée" && Math.floor(c.dateCreation / day) === Math.floor(d0 / day)).reduce((s, c) => s + c.total, 0);
      days.push({ label, ca });
    }
    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandes]);

  const stockBas = produits.filter(p => p.stock <= 3);
  const relances = commandes.filter(c => c.statut === "nouvelle" && c.dateCreation < now - 3 * 3600000);

  const Kpi = ({ label, value, icon: Icon, color }) => (
    <div className="rounded-md p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>{label}</span>
        <Icon size={15} style={{ color }} />
      </div>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 600, color: COLORS.ink }}>{value}</div>
    </div>
  );

  const prenom = (currentWorkspace?.nom || "").split(" ")[0] || "";

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  if (clients.length === 0 && commandes.length === 0) {
    return (
      <div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: COLORS.ink }} className="font-semibold mb-1">Bonjour {prenom} 👋🏾</h1>
        <p className="text-sm mb-8" style={{ color: COLORS.textMuted }}>Votre espace est prêt, mais encore vide.</p>
        <div className="rounded-md p-8 text-center" style={{ background: COLORS.card, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Commencez par ajouter vos premiers clients et produits, ou créez votre première commande.</p>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => navigate("/app/clients")} className="text-sm font-medium px-4 py-2 rounded" style={{ background: COLORS.ink, color: COLORS.paper }}>Ajouter un client</button>
            <button onClick={() => navigate("/app/pipeline")} className="text-sm font-medium px-4 py-2 rounded" style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}>Créer une commande</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: COLORS.ink }} className="font-semibold mb-1">Bonjour {prenom} 👋🏾</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>Voici l'activité de {currentWorkspace?.boutique?.nom || "votre boutique"} aujourd'hui.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi label="Chiffre d'affaires (30j)" value={fmt(caMois)} icon={TrendingUp} color={COLORS.green} />
        <Kpi label="Commandes en cours" value={enCours} icon={ShoppingBag} color={COLORS.blue} />
        <Kpi label="Nouveaux clients (30j)" value={nouveauxClients} icon={Users} color={COLORS.gold} />
        <Kpi label="Taux de livraison" value={tauxConv + "%"} icon={CircleDot} color={COLORS.violet} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-md p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>Chiffre d'affaires — 14 derniers jours</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 6, border: `1px solid ${COLORS.line}` }} />
              <Area type="monotone" dataKey="ca" stroke={COLORS.gold} fill="url(#caGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-md p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5" style={{ color: COLORS.ink }}><Bell size={14} style={{ color: COLORS.amber }} />À traiter</h3>
          {relances.length === 0 && stockBas.length === 0 && (
            <p className="text-sm" style={{ color: COLORS.textMuted }}>Rien d'urgent pour le moment.</p>
          )}
          <div className="space-y-2">
            {relances.slice(0, 3).map(c => {
              const client = clients.find(cl => cl.id === c.client_id);
              return (
                <button key={c.id} onClick={() => navigate("/app/pipeline")} className="w-full text-left flex items-center justify-between px-3 py-2 rounded text-xs" style={{ background: COLORS.amberSoft }}>
                  <span style={{ color: COLORS.ink }}><Clock size={11} className="inline mr-1" />{c.numero} — {client?.nom} sans réponse</span>
                  <ArrowRight size={12} />
                </button>
              );
            })}
            {stockBas.slice(0, 3).map(p => (
              <button key={p.id} onClick={() => navigate("/app/stock")} className="w-full text-left flex items-center justify-between px-3 py-2 rounded text-xs" style={{ background: COLORS.roseSoft }}>
                <span style={{ color: COLORS.ink }}><AlertTriangle size={11} className="inline mr-1" />Stock bas : {p.nom} ({p.stock})</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}