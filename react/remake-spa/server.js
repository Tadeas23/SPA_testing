const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const session = require("express-session");
const { WebSocketServer } = require("ws");
const db = require("./database.js");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "tajnyklic",
    resave: false,
    saveUninitialized: true,
  })
);

// **Registrace uživatele**
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
    if (row) {
      return res.status(400).json({ message: "Uživatel už existuje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: "Chyba při registraci" });
      res.json({ message: "Registrace úspěšná" });
    });
  });
});

// **Přihlášení uživatele**
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Neplatné přihlašovací údaje" });
    }
    req.session.user = username;
    res.json({ message: "Přihlášení úspěšné" });
  });
});

// **Odhlášení uživatele**
app.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Odhlášení úspěšné" }));
});

// **Spuštění serveru**
const server = app.listen(PORT, () => console.log(`✅ Server běží na http://localhost:${PORT}`));

// **WebSocket server**
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 Uživatel se připojil");

  ws.on("message", (message) => {
    const msgData = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(msgData));
      }
    });
  });

  ws.on("close", () => console.log("🔴 Uživatel se odpojil"));
});
