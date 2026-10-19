import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store, MapPin, Phone, Mail, Check, ArrowRight, ArrowLeft, Plus,
  Trash2, Sparkles
} from "lucide-react";
import { COLORS } from "../lib/theme";
import { Button, Field, TextInput, SelectInput } from "../components/ui";
import { useWorkspace } from "../context/WorkspaceContext";
import BrandPanel from "../components/BrandPanel";

const SECTEURS = ["Boutique / mode", "Restauration", "Salon de beauté", "Vente en ligne (Instagram/TikTok)", "Agence de services", "Autre"];

function Stepper({ step, total }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1 rounded-full flex-1" style={{ background: i < step ? COLORS.gold : COLORS.line }} />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { currentWorkspace, updateWorkspace, completeOnboarding } = useWorkspace();
  const [step, setStep] = useState(1);
  const [boutique, setBoutique] = useState(currentWorkspace?.boutique || { nom: "", secteur: "", ville: "" });
  const [whatsapp, setWhatsapp] = useState(currentWorkspace?.whatsapp || { telephone: "", connected: false });
  const [equipe, setEquipe] = useState(currentWorkspace?.equipe || []);
  const [connecting, setConnecting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Vendeur");

  if (!currentWorkspace) { navigate("/signup"); return null; }

  const goStep = (n) => { updateWorkspace({ boutique, whatsapp, equipe }); setStep(n); };

  const connect = () => {
    setConnecting(true);
    setTimeout(() => { setWhatsapp(w => ({ ...w, connected: true })); setConnecting(false); }, 1100);
  };

  const addInvite = () => {
    if (!inviteEmail.includes("@")) return;
    setEquipe(e => [...e, { email: inviteEmail, role: inviteRole }]);
    setInviteEmail("");
  };
  const removeInvite = (i) => setEquipe(e => e.filter((_, idx) => idx !== i));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      await completeOnboarding({ boutique, whatsapp, equipe });
      navigate("/app");
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  const validBoutique = boutique.nom.trim() && boutique.secteur && boutique.ville.trim();

  return (
    <div className="w-full min-h-[680px] flex" style={{ background: COLORS.paper }}>
      <BrandPanel step={step - 1} />
      <div className="flex-1 flex items-center justify-center p-8 md:p-14">
        {step === 1 && (
          <div className="w-full max-w-sm mx-auto">
            <Stepper step={1} total={4} />
            <span className="text-xs font-medium" style={{ color: COLORS.gold }}>Étape 1 sur 4</span>
            <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl font-semibold mt-1 mb-1">Parlez-nous de votre activité</h1>
            <p className="text-sm mb-7" style={{ color: COLORS.textMuted }}>Ces informations personnalisent votre espace de travail.</p>

            <Field label="Nom de la boutique">
              <TextInput icon={Store} placeholder="Boutique Aïda" value={boutique.nom} onChange={e => setBoutique(b => ({ ...b, nom: e.target.value }))} />
            </Field>
            <Field label="Secteur d'activité">
              <SelectInput value={boutique.secteur} onChange={e => setBoutique(b => ({ ...b, secteur: e.target.value }))}>
                <option value="">Sélectionner</option>
                {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectInput>
            </Field>
            <Field label="Ville">
              <TextInput icon={MapPin} placeholder="Dakar" value={boutique.ville} onChange={e => setBoutique(b => ({ ...b, ville: e.target.value }))} />
            </Field>

            <Button variant="solid" className="w-full" disabled={!validBoutique} onClick={() => goStep(2)}>Continuer<ArrowRight size={14} /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-sm mx-auto">
            <Stepper step={2} total={4} />
            <span className="text-xs font-medium" style={{ color: COLORS.gold }}>Étape 2 sur 4</span>
            <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl font-semibold mt-1 mb-1">Connectez votre WhatsApp</h1>
            <p className="text-sm mb-7" style={{ color: COLORS.textMuted }}>Utilisez votre numéro WhatsApp Business existant. Vous pourrez toujours le faire plus tard.</p>

            <Field label="Numéro WhatsApp Business">
              <TextInput icon={Phone} placeholder="+221 77 000 00 00" value={whatsapp.telephone} onChange={e => setWhatsapp(w => ({ ...w, telephone: e.target.value }))} />
            </Field>

            {whatsapp.connected ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded mb-5 text-sm" style={{ background: COLORS.greenSoft, color: COLORS.green }}>
                <Check size={15} />Numéro connecté avec succès
              </div>
            ) : (
              <Button variant="outline" className="w-full mb-5" onClick={connect} disabled={!whatsapp.telephone || connecting}>
                {connecting ? "Connexion..." : "Connecter ce numéro"}
              </Button>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => goStep(1)}><ArrowLeft size={14} />Retour</Button>
              <Button variant="solid" className="flex-1" onClick={() => goStep(3)}>
                {whatsapp.connected ? "Continuer" : "Passer cette étape"}<ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-sm mx-auto">
            <Stepper step={3} total={4} />
            <span className="text-xs font-medium" style={{ color: COLORS.gold }}>Étape 3 sur 4</span>
            <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl font-semibold mt-1 mb-1">Invitez votre équipe</h1>
            <p className="text-sm mb-7" style={{ color: COLORS.textMuted }}>Facultatif — vous pourrez ajouter des employés à tout moment.</p>

            <div className="flex gap-2 mb-3">
              <TextInput icon={Mail} placeholder="employe@boutique.sn" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            <div className="flex gap-2 mb-5">
              <SelectInput value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="flex-1">
                <option>Vendeur</option><option>Livreur</option><option>Admin</option>
              </SelectInput>
              <Button variant="outline" onClick={addInvite}><Plus size={14} /></Button>
            </div>

            {equipe.length > 0 && (
              <div className="space-y-1.5 mb-5">
                {equipe.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded text-xs" style={{ background: COLORS.paperDim }}>
                    <span style={{ color: COLORS.ink }}>{m.email} <span style={{ color: COLORS.textMuted }}>· {m.role}</span></span>
                    <button onClick={() => removeInvite(i)}><Trash2 size={13} style={{ color: COLORS.textMuted }} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => goStep(2)}><ArrowLeft size={14} />Retour</Button>
              <Button variant="solid" className="flex-1" onClick={() => goStep(4)}>Continuer<ArrowRight size={14} /></Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="w-full max-w-sm mx-auto text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: COLORS.goldSoft }}>
              <Sparkles size={22} style={{ color: COLORS.gold }} />
            </div>
            <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl font-semibold mb-2">
              {boutique.nom || "Votre espace"} est prêt
            </h1>
            <p className="text-sm mb-7" style={{ color: COLORS.textMuted }}>
              {whatsapp.connected ? "Votre WhatsApp est connecté et " : ""}Wazora est configuré pour {boutique.secteur || "votre activité"}
              {equipe.length > 0 ? `, avec ${equipe.length} employé${equipe.length > 1 ? "s" : ""} invité${equipe.length > 1 ? "s" : ""}.` : "."}
            </p>
            {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}
            <Button variant="gold" className="w-full" onClick={finish} disabled={saving}>
              {saving ? "Enregistrement..." : "Aller au tableau de bord"}<ArrowRight size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}