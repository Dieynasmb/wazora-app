import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Phone, Send, Plus, Loader2 } from "lucide-react";
import { COLORS, fmtDateTime } from "../../lib/theme";
import { TextInput, Button, Empty } from "../../components/ui";
import { api } from "../../lib/api";

export default function Conversations() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([api.listConversations(), api.listClients()])
      .then(([conv, cl]) => {
        setConversations(conv);
        setClients(cl);
        if (conv.length > 0) setActiveId(conv[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const conv = conversations.find(c => c.id === activeId) || null;
  const client = conv && clients.find(c => c.id === conv.clientId);

  const send = async () => {
    if (!draft.trim() || !conv) return;
    setSending(true);
    try {
      const msg = await api.sendMessage(conv.clientId, draft.trim());
      setConversations(list => list.map(c => c.id === conv.id ? { ...c, messages: [...c.messages, msg] } : c));
      setDraft("");
    } catch (e) { /* ignore */ }
    setSending(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" style={{ color: COLORS.gold }} /></div>;
  }

  if (clients.length === 0) {
    return (
      <div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold mb-1">Conversations WhatsApp</h1>
        <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>Toutes vos discussions clients centralisées au même endroit.</p>
        <div className="rounded-md p-10 text-center" style={{ background: COLORS.card, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Ajoutez d'abord un client pour démarrer une conversation.</p>
          <button onClick={() => navigate("/app/clients")} className="text-sm font-medium px-4 py-2 rounded" style={{ background: COLORS.ink, color: COLORS.paper }}>Aller aux clients</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: COLORS.ink }} className="font-semibold mb-1">Conversations WhatsApp</h1>
      <p className="text-sm mb-5" style={{ color: COLORS.textMuted }}>Toutes vos discussions clients centralisées au même endroit.</p>

      <div className="flex rounded-md overflow-hidden" style={{ border: `1px solid ${COLORS.line}`, height: 560 }}>
        <div className="w-72 shrink-0 overflow-y-auto" style={{ background: COLORS.card, borderRight: `1px solid ${COLORS.line}` }}>
          {conversations.length === 0 && (
            <div className="p-4 text-xs" style={{ color: COLORS.textMuted }}>Aucune conversation pour l'instant. Elles apparaissent automatiquement dès qu'une commande change de statut.</div>
          )}
          {conversations.map(c => {
            const cl = clients.find(x => x.id === c.clientId);
            const last = c.messages[c.messages.length - 1];
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)} className="w-full text-left px-4 py-3 flex flex-col gap-0.5"
                style={{ background: activeId === c.id ? COLORS.paperDim : "transparent", borderBottom: `1px solid ${COLORS.line}` }}>
                <span className="text-sm font-medium" style={{ color: COLORS.ink }}>{cl?.nom}</span>
                <span className="text-xs truncate" style={{ color: COLORS.textMuted }}>{last?.texte}</span>
              </button>
            );
          })}
        </div>
        <div className="flex-1 flex flex-col" style={{ background: COLORS.paper }}>
          {conv ? (
            <>
              <div className="px-4 py-3 flex items-center justify-between" style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.line}` }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: COLORS.ink }}>{client?.nom}</div>
                  <div className="text-xs flex items-center gap-1" style={{ color: COLORS.textMuted }}><Phone size={11} />{client?.telephone}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/app/pipeline")}><Plus size={13} />Créer une commande</Button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {conv.messages.map(m => (
                  <div key={m.id} className={`flex ${m.sens === "sortant" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%] px-3 py-2 rounded-lg text-sm" style={{
                      background: m.sens === "sortant" ? COLORS.gold : COLORS.card,
                      color: m.sens === "sortant" ? "#fff" : COLORS.ink,
                      border: m.sens === "sortant" ? "none" : `1px solid ${COLORS.line}`,
                    }}>
                      {m.auto && <div className="text-[10px] mb-0.5 opacity-75">Message automatique</div>}
                      {m.texte}
                      <div className="text-[10px] mt-1 opacity-60">{fmtDateTime(m.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 flex gap-2" style={{ borderTop: `1px solid ${COLORS.line}` }}>
                <TextInput value={draft} onChange={e => setDraft(e.target.value)} placeholder="Écrire un message..." onKeyDown={e => e.key === "Enter" && send()} disabled={sending} />
                <Button variant="gold" onClick={send} disabled={sending}><Send size={14} /></Button>
              </div>
            </>
          ) : <Empty icon={MessageCircle} title="Aucune conversation" subtitle="Elle apparaîtra ici dès qu'une commande sera confirmée." />}
        </div>
      </div>
    </div>
  );
}