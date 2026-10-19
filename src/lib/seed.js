import { uid } from "./theme";

export function emptyData() {
  return { clients: [], produits: [], employes: [], commandes: [], factures: [], conversations: [] };
}

export function seedData() {
  const now = Date.now();
  const day = 86400000;
  const clients = [
    { id: "c1", nom: "Fatou Ndiaye", telephone: "+221 77 512 34 21", email: "", tags: ["fidèle"], dateCreation: now - 40 * day },
    { id: "c2", nom: "Moussa Diop", telephone: "+221 76 233 87 09", email: "", tags: ["revendeur"], dateCreation: now - 25 * day },
    { id: "c3", nom: "Aissatou Ba", telephone: "+221 78 901 22 45", email: "", tags: [], dateCreation: now - 12 * day },
    { id: "c4", nom: "Cheikh Fall", telephone: "+221 70 445 61 18", email: "", tags: ["fidèle"], dateCreation: now - 5 * day },
    { id: "c5", nom: "Awa Sarr", telephone: "+221 77 200 98 77", email: "", tags: [], dateCreation: now - 2 * day },
  ];
  const produits = [
    { id: "p1", nom: "Robe wax imprimée", prix: 18000, stock: 14, categorie: "Vêtements" },
    { id: "p2", nom: "Ensemble bazin brodé", prix: 35000, stock: 6, categorie: "Vêtements" },
    { id: "p3", nom: "Sac à main tissé", prix: 12000, stock: 3, categorie: "Accessoires" },
    { id: "p4", nom: "Paire de sandales cuir", prix: 9500, stock: 20, categorie: "Chaussures" },
    { id: "p5", nom: "Foulard soie imprimé", prix: 6000, stock: 2, categorie: "Accessoires" },
  ];
  const employes = [
    { id: "e1", nom: "Aïda Diagne", role: "Admin", email: "aida@boutique.sn", actif: true },
    { id: "e2", nom: "Ibrahima Sow", role: "Vendeur", email: "ibou@boutique.sn", actif: true },
    { id: "e3", nom: "Khady Diallo", role: "Livreur", email: "khady@boutique.sn", actif: true },
  ];
  const commandes = [
    { id: "o1", numero: "CMD-1001", clientId: "c1", employeId: "e2", items: [{ produitId: "p1", nom: "Robe wax imprimée", qte: 2, prix: 18000 }], statut: "livrée", total: 36000, dateCreation: now - 6 * day },
    { id: "o2", numero: "CMD-1002", clientId: "c2", employeId: "e2", items: [{ produitId: "p2", nom: "Ensemble bazin brodé", qte: 1, prix: 35000 }], statut: "en préparation", total: 35000, dateCreation: now - 2 * day },
    { id: "o3", numero: "CMD-1003", clientId: "c3", employeId: "e1", items: [{ produitId: "p4", nom: "Paire de sandales cuir", qte: 1, prix: 9500 }, { produitId: "p5", nom: "Foulard soie imprimé", qte: 1, prix: 6000 }], statut: "confirmée", total: 15500, dateCreation: now - 1 * day },
    { id: "o4", numero: "CMD-1004", clientId: "c4", employeId: "e2", items: [{ produitId: "p3", nom: "Sac à main tissé", qte: 1, prix: 12000 }], statut: "nouvelle", total: 12000, dateCreation: now - 5 * 3600000 },
    { id: "o5", numero: "CMD-1005", clientId: "c5", employeId: "e1", items: [{ produitId: "p1", nom: "Robe wax imprimée", qte: 1, prix: 18000 }], statut: "nouvelle", total: 18000, dateCreation: now - 1 * 3600000 },
  ];
  const factures = commandes.filter(c => c.statut === "livrée").map(c => ({
    id: uid(), numero: "FA-" + c.numero.split("-")[1], commandeId: c.id, montant: c.total, statut: "payée", dateEmission: c.dateCreation + day,
  }));
  const conversations = [
    { id: "conv1", clientId: "c1", messages: [
      { id: uid(), sens: "entrant", texte: "Bonjour, la robe wax est encore dispo en L ?", date: now - 6 * day - 3600000 },
      { id: uid(), sens: "sortant", texte: "Bonjour Fatou ! Oui, il en reste. Je vous la mets de côté ?", date: now - 6 * day - 3000000, auto: false },
      { id: uid(), sens: "entrant", texte: "Oui parfait, je passe demain 🙏🏾", date: now - 6 * day - 2900000 },
      { id: uid(), sens: "sortant", texte: "Votre commande CMD-1001 a été livrée. Merci pour votre confiance !", date: now - 6 * day, auto: true },
    ]},
    { id: "conv2", clientId: "c2", messages: [
      { id: uid(), sens: "entrant", texte: "Vous avez le bazin en bleu nuit ?", date: now - 2 * day - 5000 },
      { id: uid(), sens: "sortant", texte: "Votre commande CMD-1002 est confirmée, total 35 000 FCFA.", date: now - 2 * day, auto: true },
    ]},
    { id: "conv3", clientId: "c4", messages: [
      { id: uid(), sens: "entrant", texte: "Le sac tissé beige, il coûte combien ?", date: now - 5 * 3600000 },
    ]},
    { id: "conv4", clientId: "c5", messages: [
      { id: uid(), sens: "entrant", texte: "Bonsoir, je veux commander la robe wax taille M", date: now - 3600000 },
    ]},
  ];
  return { clients, produits, employes, commandes, factures, conversations };
}