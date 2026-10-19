import React, { useState, useEffect } from "react";
import { Receipt, Loader2 } from "lucide-react";
import { COLORS, fmt, fmtDate } from "../../lib/theme";
import { Empty } from "../../components/ui";
import { api } from "../../lib/api";

export default function Factures() {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.listFactures(), api.listClients(), api.listCommandes()])
      .then(([f, cl, cm]) => { setFactures(f); setClients(cl); setCommandes(cm); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const togglePaid = async (id) => {
    try {
      const updated = await api.toggleFacture(id);
      setFactures(list => list.map(f => f.id === id ? updated : f));
    } catch (e) { setError(e.message); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold mb-1">Factures</h1>
      <p className="text-sm mb-5" style={{ color: COLORS.textMuted }}>Générées automatiquement à chaque livraison.</p>
      {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}

      <div className="rounded-md overflow-hidden" style={{ border: `1px solid ${COLORS.line}` }}>
        {factures.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: COLORS.paperDim, color: COLORS.textMuted }}>
                <th className="text-left px-4 py-2.5 font-medium">Facture</th>
                <th className="text-left px-4 py-2.5 font-medium">Client</th>
                <th className="text-left px-4 py-2.5 font-medium">Montant</th>
                <th className="text-left px-4 py-2.5 font-medium">Date</th>
                <th className="text-left px-4 py-2.5 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[...factures].sort((a, b) => b.dateEmission - a.dateEmission).map(f => {
                const cmd = commandes.find(c => c.id === f.commande_id);
                const client = cmd && clients.find(c => c.id === cmd.client_id);
                return (
                  <tr key={f.id} style={{ borderTop: `1px solid ${COLORS.line}`, background: COLORS.card }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: COLORS.ink }}>{f.numero}</td>
                    <td className="px-4 py-2.5" style={{ color: COLORS.textMuted }}>{client?.nom || "—"}</td>
                    <td className="px-4 py-2.5" style={{ color: COLORS.ink }}>{fmt(f.montant)}</td>
                    <td className="px-4 py-2.5" style={{ color: COLORS.textMuted }}>{fmtDate(f.dateEmission)}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => togglePaid(f.id)} className="text-xs font-medium px-2.5 py-1 rounded"
                        style={{ background: f.statut === "payée" ? COLORS.greenSoft : COLORS.roseSoft, color: f.statut === "payée" ? COLORS.green : COLORS.rose }}>
                        {f.statut}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Empty icon={Receipt} title="Aucune facture" subtitle="Elles apparaissent dès qu'une commande est livrée." />
        )}
      </div>
    </div>
  );
}