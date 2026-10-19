export const COLORS = {
  ink: "#1B2A24",
  inkSoft: "#24352D",
  paper: "#F6F2E8",
  paperDim: "#EDE7D8",
  card: "#FFFFFF",
  line: "#E1D9C4",
  textMuted: "#7A7263",
  textOnInk: "rgba(246,242,232,0.72)",
  gold: "#C6862B",
  goldLight: "#E0A94E",
  goldSoft: "#F0DDB8",
  green: "#3F8F5C",
  greenSoft: "#DCEEE1",
  amber: "#D9A441",
  amberSoft: "#FBEED1",
  violet: "#8A5FBF",
  violetSoft: "#EAE1F5",
  blue: "#3B6FA0",
  blueSoft: "#DEE9F3",
  rose: "#C1543A",
  roseSoft: "#F6DED8",
};

export const STATUTS = ["nouvelle", "confirmée", "en préparation", "livrée", "annulée"];
export const STATUT_META = {
  "nouvelle": { color: COLORS.amber, bg: COLORS.amberSoft, next: "confirmée" },
  "confirmée": { color: COLORS.blue, bg: COLORS.blueSoft, next: "en préparation" },
  "en préparation": { color: COLORS.violet, bg: COLORS.violetSoft, next: "livrée" },
  "livrée": { color: COLORS.green, bg: COLORS.greenSoft, next: null },
  "annulée": { color: COLORS.rose, bg: COLORS.roseSoft, next: null },
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const fmt = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n || 0)) + " FCFA";
export const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
export const fmtDateTime = (d) => new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });