import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { COLORS } from "../lib/theme";
import { Button, Field, TextInput } from "../components/ui";
import { useWorkspace } from "../context/WorkspaceContext";
import BrandPanel from "../components/BrandPanel";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginDemo } = useWorkspace();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    const res = await login(email, pwd);
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    navigate("/app");
  };

  const tryDemo = async () => {
    setLoading(true);
    setError("");
    const res = await loginDemo();
    setLoading(false);
    if (!res.ok) { setError("Compte démo indisponible pour l'instant."); return; }
    navigate("/app");
  };

  return (
    <div className="w-full min-h-[680px] flex" style={{ background: COLORS.paper }}>
      <BrandPanel step={0} />
      <div className="flex-1 flex items-center justify-center p-8 md:p-14">
        <div className="w-full max-w-sm mx-auto">
          <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl font-semibold mb-1">Content de vous revoir</h1>
          <p className="text-sm mb-7" style={{ color: COLORS.textMuted }}>Connectez-vous à votre espace Wazora.</p>

          <Field label="Adresse e-mail">
            <TextInput icon={Mail} type="email" placeholder="vous@boutique.sn" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
          <Field label="Mot de passe">
            <div className="relative">
              <TextInput icon={Lock} type={show ? "text" : "password"} placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.textMuted }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          {error && <p className="text-xs mb-3" style={{ color: COLORS.rose }}>{error}</p>}

          <Button variant="solid" className="w-full" onClick={submit} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

          <button onClick={tryDemo} disabled={loading} className="w-full flex items-center justify-center gap-1.5 text-xs font-medium mt-3 py-2" style={{ color: COLORS.gold }}>
            <Sparkles size={13} />Essayer avec des données de démonstration
          </button>

          <p className="text-center text-sm mt-6" style={{ color: COLORS.textMuted }}>
            Pas encore de compte ? <Link to="/signup" className="font-medium" style={{ color: COLORS.gold }}>Créer un espace</Link>
          </p>
        </div>
      </div>
    </div>
  );
}