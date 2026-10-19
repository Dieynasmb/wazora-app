import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { COLORS } from "../../lib/theme";
import { Button, Field, TextInput, SelectInput, Modal } from "../../components/ui";
import { api } from "../../lib/api";

export default function Equipe() {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ nom: "", role: "Vendeur", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.listEmployes().then(setEmployes).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!form.nom) return;
    try {
      const created = await api.createEmploye(form);
      setEmployes(list => [created, ...list]);
      setForm({ nom: "", role: "Vendeur", email: "" });
      setShowNew(false);
    } catch (e) { setError(e.message); }
  };

  const toggleActif = async (id) => {
    try {
      const updated = await api.toggleEmploye(id);
      setEmployes(list => list.map(e => e.id === id ? updated : e));
    } catch (e) { setError(e.message); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold">Équipe</h1>
        <Button variant="gold" onClick={() => setShowNew(true)}><Plus size={14} />Ajouter un employé</Button>
      </div>
      <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Gérez qui a accès à quoi dans la boutique.</p>
      {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}

      {employes.length === 0 ? (
        <div className="rounded-md p-10 text-center" style={{ background: COLORS.card, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>Aucun employé pour l'instant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {employes.map(e => (
            <div key={e.id} className="rounded-md p-4 flex items-center justify-between" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.goldSoft, color: COLORS.gold }}>
                  {(e.nom || e.email || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: COLORS.ink }}>{e.nom || e.email}</div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>{e.role}{e.email ? ` · ${e.email}` : ""}</div>
                </div>
              </div>
              <button onClick={() => toggleActif(e.id)} className="text-xs font-medium px-2.5 py-1 rounded" style={{ background: e.actif ? COLORS.greenSoft : COLORS.paperDim, color: e.actif ? COLORS.green : COLORS.textMuted }}>
                {e.actif ? "actif" : "inactif"}
              </button>
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <Modal title="Ajouter un employé" onClose={() => setShowNew(false)}>
          <Field label="Nom complet"><TextInput value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></Field>
          <Field label="Rôle">
            <SelectInput value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option>Admin</option><option>Vendeur</option><option>Livreur</option>
            </SelectInput>
          </Field>
          <Field label="Email"><TextInput value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
          <Button variant="gold" className="w-full justify-center" onClick={save}>Enregistrer</Button>
        </Modal>
      )}
    </div>
  );
}