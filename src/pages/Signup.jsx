import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { COLORS } from "../lib/theme";
import { Button, Field, TextInput } from "../components/ui";
import { useWorkspace } from "../context/WorkspaceContext";
import BrandPanel from "../components/BrandPanel";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, workspaces } = useWorkspace();
  const [form, setForm] = useState({ nom: "", email: "", pwd: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const valid = form.nom.trim() && form.email.includes("@") && form.pwd.length >= 6;

  const submit = () => {
    if (workspaces.some(w => w.email.toLowerCase() === form.email.toLowerCase())) {
      setError("Un compte existe déjà avec cet e-mail.");
      return;
    }
    signup(form);
    navigate("/onboarding");
  };

  return (
    <div className="w-full min-h-[680px] flex" style={{ background: COLORS.paper }}>
      <BrandPanel step={0} />
      <div className="flex-1 flex items-center justify-center p-8 md:p-14">
        <div className="w-full max-w-sm mx-auto">
          <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl font-semibold mb-1">Créez votre espace Wazora</h1>
          <p className="text-sm mb-7" style={{ color: COLORS.textMuted }}>14 jours d'essai gratuit, sans carte bancaire.</p>

          <Field label="Nom complet">
            <TextInput icon={User} placeholder="Aïda Diagne" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
          </Field>
          <Field label="Adresse e-mail">
            <TextInput icon={Mail} type="email" placeholder="vous@boutique.sn" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Mot de passe">
            <div className="relative">
              <TextInput icon={Lock} type={show ? "text" : "password"} placeholder="6 caractères minimum" value={form.pwd} onChange={e => setForm(f => ({ ...f, pwd: e.target.value }))} />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.textMuted }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}

          <Button variant="solid" className="w-full" disabled={!valid} onClick={submit}>Créer mon compte</Button>
          <p className="text-xs mt-3" style={{ color: COLORS.textMuted }}>
            En continuant, vous acceptez les conditions d'utilisation de Wazora.
          </p>

          <p className="text-center text-sm mt-6" style={{ color: COLORS.textMuted }}>
            Déjà un compte ? <Link to="/login" className="font-medium" style={{ color: COLORS.gold }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}