import React, { useState, useEffect } from "react";
import { Users, Plus, Search, Trash2, Loader2 } from "lucide-react";
import { COLORS, fmtDate } from "../../lib/theme";
import { Button, Field, TextInput, Modal, Empty } from "../../components/ui";
import { api } from "../../lib/api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ nom: "", telephone: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.listClients().then(setClients).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) || c.telephone.includes(search)
  );

  const save = async () => {
    if (!form.nom || !form.telephone) return;
    try {
      const created = await api.createClient(form);
      setClients(list => [created, ...list]);
      setForm({ nom: "", telephone: "", email: "" });
      setShowNew(false);
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    try {
      await api.deleteClient(id);
      setClients(list => list.filter(c => c.id !== id));
    } catch (e) { setError(e.message); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold">Clients</h1>
        <Button variant="gold" onClick={() => setShowNew(true)}><Plus size={14} />Ajouter un client</Button>
      </div>
      <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>{clients.length} clients enregistrés</p>
      {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}

      <div className="mb-4 relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.textMuted }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client..."
          style={{ border: `1px solid ${COLORS.line}`, background: COLORS.paper, color: COLORS.ink, paddingLeft: 34 }}
          className="w-full rounded px-3 py-2 text-sm outline-none" />
      </div>

      <div className="rounded-md overflow-hidden" style={{ border: `1px solid ${COLORS.line}` }}>
        {filtered.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: COLORS.paperDim, color: COLORS.textMuted }}>
                <th className="text-left px-4 py-2.5 font-medium">Nom</th>
                <th className="text-left px-4 py-2.5 font-medium">Téléphone</th>
                <th className="text-left px-4 py-2.5 font-medium">Client depuis</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderTop: `1px solid ${COLORS.line}`, background: COLORS.card }}>
                  <td className="px-4 py-2.5 font-medium" style={{ color: COLORS.ink }}>{c.nom}</td>
                  <td className="px-4 py-2.5" style={{ color: COLORS.textMuted }}>{c.telephone}</td>
                  <td className="px-4 py-2.5" style={{ color: COLORS.textMuted }}>{fmtDate(c.dateCreation)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => remove(c.id)}><Trash2 size={14} style={{ color: COLORS.textMuted }} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty icon={Users} title="Aucun client" subtitle={clients.length === 0 ? "Ajoutez votre premier client pour commencer." : "Aucun résultat pour cette recherche."} />
        )}
      </div>

      {showNew && (
        <Modal title="Ajouter un client" onClose={() => setShowNew(false)}>
          <Field label="Nom complet"><TextInput value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></Field>
          <Field label="Téléphone WhatsApp"><TextInput placeholder="+221 77 000 00 00" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} /></Field>
          <Field label="Email (optionnel)"><TextInput value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
          <Button variant="gold" className="w-full justify-center" onClick={save}>Enregistrer</Button>
        </Modal>
      )}
    </div>
  );
}