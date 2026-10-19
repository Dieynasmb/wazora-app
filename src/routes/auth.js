const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../db");
const { JWT_SECRET, requireAuth } = require("../middleware/auth");

const router = express.Router();
const uid = () => crypto.randomUUID();

function makeToken(user) {
  return jwt.sign({ userId: user.id, workspaceId: user.workspace_id }, JWT_SECRET, { expiresIn: "30d" });
}

function workspacePublic(ws) {
  return {
    id: ws.id,
    boutique: { nom: ws.boutique_nom, secteur: ws.secteur, ville: ws.ville },
    whatsapp: { telephone: ws.whatsapp_telephone, connected: !!ws.whatsapp_connected },
    onboarded: !!ws.onboarded,
  };
}

router.post("/signup", (req, res) => {
  const { nom, email, password } = req.body || {};
  if (!nom || !email || !password || password.length < 6) {
    return res.status(400).json({ error: "Nom, email et mot de passe (6 caractères min.) sont requis." });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: "Un compte existe déjà avec cet e-mail." });

  const workspaceId = uid();
  const userId = uid();
  const now = Date.now();
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(`INSERT INTO workspaces (id, created_at) VALUES (?, ?)`).run(workspaceId, now);
  db.prepare(`INSERT INTO users (id, workspace_id, nom, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, 'Admin', ?)`)
    .run(userId, workspaceId, nom, email.toLowerCase(), passwordHash, now);

  const user = { id: userId, workspace_id: workspaceId };
  const ws = db.prepare("SELECT * FROM workspaces WHERE id = ?").get(workspaceId);

  res.json({ token: makeToken(user), workspace: workspacePublic(ws), user: { id: userId, nom, email: email.toLowerCase() } });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis." });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }

  const ws = db.prepare("SELECT * FROM workspaces WHERE id = ?").get(user.workspace_id);
  res.json({ token: makeToken(user), workspace: workspacePublic(ws), user: { id: user.id, nom: user.nom, email: user.email } });
});

router.get("/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT id, nom, email FROM users WHERE id = ?").get(req.userId);
  const ws = db.prepare("SELECT * FROM workspaces WHERE id = ?").get(req.workspaceId);
  res.json({ user, workspace: workspacePublic(ws) });
});

module.exports = router;