import React, { useState, useEffect } from "react";
import { Plus, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { COLORS, fmt } from "../../lib/theme";
import { Button, Field, TextInput, Modal } from "../../components/ui";
import { api } from "../../lib/api";

export default function Stock() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ nom: "", prix: "", stock: "", categorie: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.listProduits().then(setProduits).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!form.nom || !form.prix) return;
    try {
      const created = await api.createProduit(form);
      setProduits(list => [created, ...list]);
      setForm({ nom: "", prix: "", stock: "", categorie: "" });
      setShowNew(false);
    } catch (e) { setError(e.message); }
  };

  const updateStock = async (id, delta) => {
    try {
      const updated = await api.updateProduitStock(id, delta);
      setProduits(list => list.map(p => p.id === id ? updated : p));
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    try {
      await api.deleteProduit(id);
      setProduits(list => list.filter(p => p.id !== id));
    } catch (e) { setError(e.message); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold">Produits & Stock</h1>
        <Button variant="gold" onClick={() => setShowNew(true)}><Plus size={14} />Ajouter un produit</Button>
      </div>
      <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Le stock diminue automatiquement quand une commande est confirmée.</p>
      {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}

      {produits.length === 0 ? (
        <div className="rounded-md p-10 flex flex-col items-center text-center" style={{ background: COLORS.card, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>Aucun produit pour l'instant. Ajoutez le premier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {produits.map(p => (
            <div key={p.id} className="rounded-md p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: COLORS.paperDim, color: COLORS.textMuted }}>{p.categorie}</span>
                <button onClick={() => remove(p.id)}><Trash2 size={13} style={{ color: COLORS.textMuted }} /></button>
              </div>
              <div className="font-medium mb-1" style={{ color: COLORS.ink }}>{p.nom}</div>
              <div className="text-sm mb-3" style={{ color: COLORS.gold, fontWeight: 600 }}>{fmt(p.prix)}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-1" style={{ color: p.stock <= 3 ? COLORS.rose : COLORS.textMuted }}>
                  {p.stock <= 3 && <AlertTriangle size={11} />}Stock : {p.stock}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => updateStock(p.id, -1)} className="w-6 h-6 rounded flex items-center justify-center text-sm" style={{ background: COLORS.paperDim }}>−</button>
                  <button onClick={() => updateStock(p.id, 1)} className="w-6 h-6 rounded flex items-center justify-center text-sm" style={{ background: COLORS.paperDim }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <Modal title="Ajouter un produit" onClose={() => setShowNew(false)}>
          <Field label="Nom du produit"><TextInput value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></Field>
          <Field label="Prix (FCFA)"><TextInput type="number" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} /></Field>
          <Field label="Stock initial"><TextInput type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></Field>
          <Field label="Catégorie"><TextInput value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))} /></Field>
          <Button variant="gold" className="w-full justify-center" onClick={save}>Enregistrer</Button>
        </Modal>
      )}
    </div>
  );
}