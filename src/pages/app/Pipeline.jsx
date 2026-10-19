import React, { useState, useEffect } from "react";
import { Plus, X, ArrowRight, Loader2 } from "lucide-react";
import { COLORS, STATUTS, STATUT_META, fmt, fmtDate } from "../../lib/theme";
import { Button, Field, TextInput, SelectInput, Modal } from "../../components/ui";
import { api } from "../../lib/api";

export default function Pipeline() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ clientId: "", items: [] });
  const [prodSel, setProdSel] = useState("");
  const [qte, setQte] = useState(1);

  useEffect(() => {
    Promise.all([api.listCommandes(), api.listClients(), api.listProduits()])
      .then(([c, cl, p]) => { setCommandes(c); setClients(cl); setProduits(p); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const advance = async (cmd) => {
    try {
      const { commande } = await api.advanceCommande(cmd.id);
      setCommandes(list => list.map(c => c.id === commande.id ? commande : c));
      if (commande.statut === "confirmée") {
        const fresh = await api.listProduits();
        setProduits(fresh);
      }
    } catch (e) { setError(e.message); }
  };

  const cancel = async (cmd) => {
    try {
      const updated = await api.cancelCommande(cmd.id);
      setCommandes(list => list.map(c => c.id === updated.id ? updated : c));
    } catch (e) { setError(e.message); }
  };

  const addItem = () => {
    if (!prodSel) return;
    const p = produits.find(x => x.id === prodSel);
    if (!p) return;
    setForm(f => ({ ...f, items: [...f.items, { produitId: p.id, nom: p.nom, qte: Number(qte), prix: p.prix }] }));
    setProdSel(""); setQte(1);
  };

  const submitOrder = async () => {
    if (!form.clientId || form.items.length === 0) return;
    try {
      const created = await api.createCommande(form);
      setCommandes(list => [created, ...list]);
      setShowNew(false); setForm({ clientId: "", items: [] });
    } catch (e) { setError(e.message); }
  };

  const noBaseData = clients.length === 0 || produits.length === 0;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold">Commandes</h1>
        <Button variant="gold" onClick={() => setShowNew(true)} disabled={noBaseData}><Plus size={14} />Nouvelle commande</Button>
      </div>
      <p className="text-sm mb-5" style={{ color: COLORS.textMuted }}>De la première réponse WhatsApp jusqu'à la livraison.</p>
      {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}

      {noBaseData && (
        <div className="rounded-md p-4 mb-5 text-sm" style={{ background: COLORS.amberSoft, color: COLORS.ink }}>
          Ajoutez d'abord au moins un client et un produit pour pouvoir créer une commande.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {STATUTS.map(statut => {
          const cmds = commandes.filter(c => c.statut === statut).sort((a, b) => b.dateCreation - a.dateCreation);
          const meta = STATUT_META[statut];
          return (
            <div key={statut} className="rounded-md" style={{ background: COLORS.paperDim, minHeight: 300 }}>
              <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderBottom: `2px solid ${meta.color}` }}>
                <span className="text-xs font-semibold capitalize" style={{ color: meta.color }}>{statut}</span>
                <span className="text-xs" style={{ color: COLORS.textMuted }}>{cmds.length}</span>
              </div>
              <div className="p-2 space-y-2">
                {cmds.map(cmd => {
                  const client = clients.find(c => c.id === cmd.client_id);
                  return (
                    <div key={cmd.id} className="rounded p-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: COLORS.ink }}>{cmd.numero}</span>
                        <span className="text-[10px]" style={{ color: COLORS.textMuted }}>{fmtDate(cmd.dateCreation)}</span>
                      </div>
                      <div className="text-xs mb-1.5" style={{ color: COLORS.textMuted }}>{client?.nom || "Client supprimé"}</div>
                      <div className="text-sm font-semibold mb-2" style={{ color: COLORS.ink }}>{fmt(cmd.total)}</div>
                      {statut !== "livrée" && statut !== "annulée" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => advance(cmd)}>
                            {meta.next}<ArrowRight size={11} />
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => cancel(cmd)}><X size={12} /></Button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {cmds.length === 0 && <div className="text-xs text-center py-6" style={{ color: COLORS.textMuted }}>Vide</div>}
              </div>
            </div>
          );
        })}
      </div>

      {showNew && (
        <Modal title="Nouvelle commande" onClose={() => setShowNew(false)}>
          <Field label="Client">
            <SelectInput value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}>
              <option value="">Sélectionner un client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </SelectInput>
          </Field>
          <Field label="Ajouter un produit">
            <div className="flex gap-2">
              <SelectInput value={prodSel} onChange={e => setProdSel(e.target.value)} className="flex-1">
                <option value="">Produit</option>
                {produits.map(p => <option key={p.id} value={p.id}>{p.nom} — {fmt(p.prix)}</option>)}
              </SelectInput>
              <TextInput type="number" min={1} value={qte} onChange={e => setQte(e.target.value)} style={{ width: 64 }} />
              <Button variant="outline" onClick={addItem}><Plus size={14} /></Button>
            </div>
          </Field>
          {form.items.length > 0 && (
            <div className="mb-3 space-y-1">
              {form.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm px-2 py-1 rounded" style={{ background: COLORS.paperDim }}>
                  <span>{i.qte} × {i.nom}</span><span>{fmt(i.qte * i.prix)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold pt-1">
                <span>Total</span><span>{fmt(form.items.reduce((s, i) => s + i.qte * i.prix, 0))}</span>
              </div>
            </div>
          )}
          <Button variant="gold" className="w-full justify-center" onClick={submitOrder}>Créer la commande</Button>
        </Modal>
      )}
    </div>
  );
}