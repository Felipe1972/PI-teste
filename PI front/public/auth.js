const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const router = express.Router();

// Cadastro
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  db.run(sql, [name, email, hashed], (err) => {
    if (err) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }
    res.json({ message: "Usuário cadastrado com sucesso!" });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const correct = await bcrypt.compare(password, user.password);

    if (!correct) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    res.json({ message: "Login realizado com sucesso!", userId: user.id });
  });
});

module.exports = router;
