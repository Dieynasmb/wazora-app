import React from "react";
import { MessageCircle, ShoppingBag, BarChart3 } from "lucide-react";
import { COLORS } from "../lib/theme";

const PROPS = [
  { icon: MessageCircle, title: "Toutes vos conversations, un seul endroit", desc: "Fini les commandes perdues dans le fil WhatsApp." },
  { icon: ShoppingBag, title: "Un pipeline clair pour chaque vente", desc: "Nouvelle, confirmée, en préparation, livrée." },
  { icon: BarChart3, title: "Votre activité en un coup d'œil", desc: "Chiffre d'affaires et ventes suivis automatiquement." },
];

export default function BrandPanel({ step = 0 }) {
  const p = PROPS[step % PROPS.length];
  return (
    <div className="hidden md:flex flex-col justify-between w-[42%] p-10" style={{ background: COLORS.ink }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: COLORS.gold }}>
          <MessageCircle size={16} color="#fff" />
        </div>
        <span style={{ fontFamily: "Fraunces, serif", color: COLORS.paper, fontWeight: 600, fontSize: 19 }}>Wazora</span>
      </div>

      <div>
        <p.icon size={26} style={{ color: COLORS.gold }} />
        <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.paper, lineHeight: 1.2 }} className="text-2xl font-semibold mt-4 mb-2 max-w-xs">
          {p.title}
        </h2>
        <p className="text-sm max-w-xs" style={{ color: COLORS.textOnInk }}>{p.desc}</p>
      </div>

      <p className="text-xs" style={{ color: COLORS.textOnInk }}>© 2026 Wazora — fait à Dakar</p>
    </div>
  );
}