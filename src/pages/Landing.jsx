import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageCircle, ArrowRight, Check, ChevronDown, ShoppingBag, Package,
  Receipt, BarChart3, Users, Bell, Menu, X, Star
} from "lucide-react";
import { COLORS } from "../lib/theme";
import { Container } from "../components/ui";

const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

function Nav({ onSignup }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comment ça marche", href: "#comment" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <header style={{ background: COLORS.paper, borderBottom: `1px solid ${COLORS.line}` }} className="sticky top-0 z-40">
      <Container className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: COLORS.gold }}>
            <MessageCircle size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: "Fraunces, serif", color: COLORS.ink, fontWeight: 600, fontSize: 19 }}>Wazora</span>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => <a key={l.href} href={l.href} className="text-sm" style={{ color: COLORS.textMuted }}>{l.label}</a>)}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium" style={{ color: COLORS.ink }}>Se connecter</Link>
          <button onClick={onSignup} className="text-sm font-medium px-4 py-2 rounded" style={{ background: COLORS.ink, color: COLORS.paper }}>
            Essayer gratuitement
          </button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(o => !o)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </Container>
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ background: COLORS.paper, borderTop: `1px solid ${COLORS.line}` }}>
          {links.map(l => <a key={l.href} href={l.href} className="text-sm py-1" style={{ color: COLORS.ink }} onClick={() => setOpen(false)}>{l.label}</a>)}
          <Link to="/login" className="text-sm py-1" style={{ color: COLORS.ink }}>Se connecter</Link>
          <button onClick={onSignup} className="text-sm font-medium px-4 py-2 rounded mt-2" style={{ background: COLORS.ink, color: COLORS.paper }}>Essayer gratuitement</button>
        </div>
      )}
    </header>
  );
}

function Hero({ onSignup }) {
  return (
    <section style={{ background: COLORS.paper }} className="pt-16 pb-20 md:pt-24 md:pb-28">
      <Container className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink, lineHeight: 1.08 }} className="text-4xl md:text-[3.2rem] font-semibold mb-5">
            Vos conversations WhatsApp, transformées en ventes suivies.
          </h1>
          <p className="text-base md:text-lg mb-8 max-w-md" style={{ color: COLORS.textMuted }}>
            Wazora centralise les commandes de votre boutique, restaurant ou salon : du premier message client jusqu'à la facture, sans rien perdre dans le fil de discussion.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onSignup} className="px-5 py-3 rounded text-sm font-medium" style={{ background: COLORS.gold, color: "#fff" }}>
              Démarrer gratuitement
            </button>
            <a href="#comment" className="px-5 py-3 rounded text-sm font-medium" style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}>
              Voir comment ça marche
            </a>
          </div>
          <p className="text-xs mt-4" style={{ color: COLORS.textMuted }}>Sans carte bancaire · 14 jours d'essai · Résiliable à tout moment</p>
        </div>

        <div className="rounded-lg p-3" style={{ background: COLORS.ink }}>
          <div className="rounded-md overflow-hidden" style={{ background: COLORS.paperDim }}>
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.line}` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#D9A441" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "#3F8F5C" }} />
              <span className="text-xs ml-2" style={{ color: COLORS.textMuted }}>WhatsApp — Fatou Ndiaye</span>
            </div>
            <div className="p-4 space-y-2">
              <div className="max-w-[75%] px-3 py-2 rounded-lg text-xs" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, color: COLORS.ink }}>
                Bonjour, la robe wax est encore dispo en L ?
              </div>
              <div className="max-w-[75%] ml-auto px-3 py-2 rounded-lg text-xs" style={{ background: COLORS.gold, color: "#fff" }}>
                Oui ! Je vous prépare ça — 18 000 FCFA
              </div>
              <div className="mt-3 rounded-md p-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.goldSoft}` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: COLORS.ink }}>CMD-1006 créée</span>
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: COLORS.goldSoft, color: COLORS.gold }}>nouvelle</span>
                </div>
                <span className="text-xs" style={{ color: COLORS.textMuted }}>1 × Robe wax imprimée · 18 000 FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TrustBand() {
  const items = ["Boutiques", "Restaurants", "Salons de beauté", "Vendeurs Instagram & TikTok", "Agences de services"];
  return (
    <div style={{ background: COLORS.paperDim, borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` }} className="py-4">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        <span className="text-xs" style={{ color: COLORS.textMuted }}>Conçu pour :</span>
        {items.map(i => <span key={i} className="text-sm font-medium" style={{ color: COLORS.ink }}>{i}</span>)}
      </Container>
    </div>
  );
}

function Problem() {
  const pains = [
    "Une commande confirmée oubliée au milieu de 200 messages",
    "Le stock qui n'est jamais à jour d'une boutique à l'autre",
    "Aucun moyen de savoir combien vous avez vendu ce mois-ci",
    "Des clients relancés en retard, ou jamais",
  ];
  return (
    <section className="py-16 md:py-20" style={{ background: COLORS.paper }}>
      <Container className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl md:text-3xl font-semibold mb-4">
            WhatsApp est parfait pour vendre. Il n'a pas été conçu pour gérer une entreprise.
          </h2>
          <p className="text-sm md:text-base" style={{ color: COLORS.textMuted }}>
            Vous connaissez déjà la situation : les commandes se perdent dans le fil de discussion, personne ne sait qui a répondu à qui, et le stock réel ne correspond jamais à ce qui est dans votre tête.
          </p>
        </div>
        <div className="space-y-3">
          {pains.map((p, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-md" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <X size={15} style={{ color: "#C1543A", marginTop: 2, flexShrink: 0 }} />
              <span className="text-sm" style={{ color: COLORS.ink }}>{p}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Features() {
  const features = [
    { icon: MessageCircle, title: "Conversations centralisées", desc: "Tous les échanges WhatsApp de votre équipe au même endroit, liés à chaque client." },
    { icon: ShoppingBag, title: "Pipeline de commandes", desc: "Nouvelle, confirmée, en préparation, livrée : suivez chaque vente sans rien perdre." },
    { icon: Package, title: "Stock en temps réel", desc: "Le stock se met à jour automatiquement à chaque commande confirmée." },
    { icon: Receipt, title: "Factures automatiques", desc: "Une facture générée dès qu'une commande est marquée livrée." },
    { icon: Bell, title: "Relances automatiques", desc: "Wazora signale les commandes en attente et prépare le message de relance." },
    { icon: Users, title: "Équipe multi-employés", desc: "Vendeurs, livreurs, administrateurs : chacun avec son rôle et ses accès." },
    { icon: BarChart3, title: "Statistiques claires", desc: "Chiffre d'affaires, produits les plus vendus, taux de conversion en un coup d'œil." },
    { icon: Check, title: "Fiches clients", desc: "Historique d'achats, coordonnées et tags pour chaque client, en un clic." },
  ];
  return (
    <section id="fonctionnalites" className="py-16 md:py-20" style={{ background: COLORS.paperDim }}>
      <Container>
        <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl md:text-3xl font-semibold mb-10 max-w-lg">
          Tout ce qu'il faut pour gérer les ventes, rien qu'il faille configurer pendant des heures.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-5 rounded-md" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <f.icon size={20} style={{ color: COLORS.gold }} />
              <h3 className="text-sm font-semibold mt-3 mb-1.5" style={{ color: COLORS.ink }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "1", title: "Connectez votre WhatsApp Business", desc: "Reliez votre numéro professionnel en quelques minutes, seul ou avec l'aide de notre équipe." },
    { n: "2", title: "Centralisez clients, stock et commandes", desc: "Importez vos contacts et produits existants, ou démarrez de zéro." },
    { n: "3", title: "Suivez chaque vente jusqu'à la livraison", desc: "Votre équipe travaille sur le même pipeline, avec des notifications automatiques envoyées aux clients." },
  ];
  return (
    <section id="comment" style={{ background: COLORS.ink }} className="py-16 md:py-20">
      <Container>
        <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.paper }} className="text-2xl md:text-3xl font-semibold mb-10 max-w-lg">
          Comment ça marche
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(s => (
            <div key={s.n}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold mb-4" style={{ background: COLORS.gold, color: "#fff" }}>{s.n}</div>
              <h3 className="text-base font-semibold mb-2" style={{ color: COLORS.paper }}>{s.title}</h3>
              <p className="text-sm" style={{ color: COLORS.textOnInk }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Pricing({ onSignup }) {
  const [annual, setAnnual] = useState(false);
  const plans = [
    { name: "Solo", monthly: 9000, desc: "Pour démarrer seul.", features: ["1 utilisateur", "Jusqu'à 150 commandes / mois", "Conversations & pipeline", "Factures automatiques"] },
    { name: "Équipe", monthly: 25000, desc: "Pour une boutique avec du personnel.", features: ["Jusqu'à 5 employés", "Commandes illimitées", "Relances automatiques", "Statistiques avancées"], highlight: true },
    { name: "Business", monthly: 50000, desc: "Pour plusieurs points de vente.", features: ["Employés illimités", "Plusieurs boutiques", "Accès API", "Support prioritaire"] },
  ];
  return (
    <section id="tarifs" className="py-16 md:py-20" style={{ background: COLORS.paper }}>
      <Container>
        <div className="flex flex-col items-center text-center mb-10">
          <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl md:text-3xl font-semibold mb-3">Des tarifs simples, en FCFA</h2>
          <p className="text-sm mb-5" style={{ color: COLORS.textMuted }}>Changez de formule à tout moment selon la taille de votre équipe.</p>
          <div className="inline-flex items-center rounded-full p-1" style={{ background: COLORS.paperDim }}>
            <button onClick={() => setAnnual(false)} className="px-4 py-1.5 rounded-full text-xs font-medium" style={{ background: !annual ? COLORS.card : "transparent", color: COLORS.ink }}>Mensuel</button>
            <button onClick={() => setAnnual(true)} className="px-4 py-1.5 rounded-full text-xs font-medium" style={{ background: annual ? COLORS.card : "transparent", color: COLORS.ink }}>Annuel · -20%</button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map(p => {
            const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <div key={p.name} className="rounded-md p-6" style={{
                background: p.highlight ? COLORS.ink : COLORS.card,
                border: `1px solid ${p.highlight ? COLORS.ink : COLORS.line}`,
              }}>
                <h3 className="text-base font-semibold mb-1" style={{ color: p.highlight ? COLORS.paper : COLORS.ink }}>{p.name}</h3>
                <p className="text-xs mb-4" style={{ color: p.highlight ? COLORS.textOnInk : COLORS.textMuted }}>{p.desc}</p>
                <div className="mb-5">
                  <span style={{ fontFamily: "Fraunces, serif", fontSize: 30, color: p.highlight ? COLORS.paper : COLORS.ink }}>{fmt(price)}</span>
                  <span className="text-xs" style={{ color: p.highlight ? COLORS.textOnInk : COLORS.textMuted }}> / mois</span>
                </div>
                <button onClick={onSignup} className="w-full py-2.5 rounded text-sm font-medium mb-5" style={{
                  background: p.highlight ? COLORS.gold : COLORS.ink,
                  color: "#fff",
                }}>
                  Choisir {p.name}
                </button>
                <div className="space-y-2">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs" style={{ color: p.highlight ? COLORS.textOnInk : COLORS.textMuted }}>
                      <Check size={13} style={{ color: p.highlight ? COLORS.goldLight : COLORS.green, flexShrink: 0 }} />{f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "Faut-il un compte WhatsApp Business ?", a: "Un numéro WhatsApp Business (gratuit chez Meta) suffit pour commencer. Wazora vous guide pour le connecter lors de l'inscription." },
    { q: "Mes messages restent-ils privés ?", a: "Oui. Seules les personnes que vous invitez dans votre espace de travail peuvent voir les conversations et les commandes de votre boutique." },
    { q: "Puis-je importer mes clients et produits existants ?", a: "Oui, via un fichier Excel ou CSV, ou en les ajoutant manuellement au fil de l'eau." },
    { q: "Que se passe-t-il si je dépasse mon quota de commandes ?", a: "Nous vous prévenons avant la limite ; vous pouvez changer de formule en un clic, sans interruption de service." },
    { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement ni frais de résiliation." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-16 md:py-20" style={{ background: COLORS.paperDim }}>
      <Container className="max-w-2xl">
        <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }} className="text-2xl md:text-3xl font-semibold mb-8">Questions fréquentes</h2>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="rounded-md overflow-hidden" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-sm font-medium" style={{ color: COLORS.ink }}>{it.q}</span>
                <ChevronDown size={16} style={{ color: COLORS.textMuted, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {open === i && <p className="px-5 pb-4 text-sm" style={{ color: COLORS.textMuted }}>{it.a}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FinalCta({ onSignup }) {
  return (
    <section style={{ background: COLORS.ink }} className="py-16 md:py-20">
      <Container className="flex flex-col items-center text-center">
        <h2 style={{ fontFamily: "Fraunces, serif", color: COLORS.paper }} className="text-2xl md:text-4xl font-semibold mb-4 max-w-xl">
          Prêt à arrêter de chercher vos commandes dans WhatsApp ?
        </h2>
        <p className="text-sm mb-7" style={{ color: COLORS.textOnInk }}>14 jours d'essai gratuit. Aucune carte bancaire requise.</p>
        <button onClick={onSignup} className="px-6 py-3 rounded text-sm font-medium" style={{ background: COLORS.gold, color: "#fff" }}>
          Créer mon espace Wazora
        </button>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: COLORS.paper, borderTop: `1px solid ${COLORS.line}` }} className="py-10">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: COLORS.gold }}>
            <MessageCircle size={12} color="#fff" />
          </div>
          <span style={{ fontFamily: "Fraunces, serif", color: COLORS.ink, fontWeight: 600 }}>Wazora</span>
        </div>
        <p className="text-xs" style={{ color: COLORS.textMuted }}>© 2026 Wazora. Fait à Dakar, pour les commerçants d'Afrique de l'Ouest.</p>
      </Container>
    </footer>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const onSignup = () => navigate("/signup");
  return (
    <div>
      <Nav onSignup={onSignup} />
      <Hero onSignup={onSignup} />
      <TrustBand />
      <Problem />
      <Features />
      <HowItWorks />
      <Pricing onSignup={onSignup} />
      <Faq />
      <FinalCta onSignup={onSignup} />
      <Footer />
    </div>
  );
}