import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Loader2 } from "lucide-react";
import { COLORS, STATUTS, STATUT_META } from "../../lib/theme";
import { api } from "../../lib/api";

export default function Stats() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCommandes().then(setCommandes).finally(() => setLoading(false));
  }, []);

  const statutData = STATUTS.map(s => ({ name: s, value: commandes.filter(c => c.statut === s).length, color: STATUT_META[s].color }));

  const venteParProduit = useMemo(() => {
    const map = {};
    commandes.forEach(c => c.items.forEach(i => { map[i.nom] = (map[i.nom] || 0) + i.qte; }));
    return Object.entries(map).map(([nom, qte]) => ({ nom, qte })).sort((a, b) => b.qte - a.qte).slice(0, 6);
  }, [commandes]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  if (commandes.length === 0) {
    return (
      <div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold mb-1">Statistiques</h1>
        <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>La performance de votre boutique en un coup d'œil.</p>
        <div className="rounded-md p-10 text-center" style={{ background: COLORS.card, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>Pas encore de commandes à analyser.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold mb-1">Statistiques</h1>
      <p className="text-sm mb-5" style={{ color: COLORS.textMuted }}>La performance de votre boutique en un coup d'œil.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-md p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>Commandes par statut</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {statutData.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {statutData.map((s, i) => (
              <span key={i} className="text-xs flex items-center gap-1" style={{ color: COLORS.textMuted }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: s.color }} />{s.name} ({s.value})
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>Produits les plus vendus</h3>
          {venteParProduit.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={venteParProduit} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid stroke={COLORS.line} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nom" width={110} tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="qte" fill={COLORS.gold} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-16" style={{ color: COLORS.textMuted }}>Pas encore de produits vendus.</p>
          )}
        </div>
      </div>
    </div>
  );
}