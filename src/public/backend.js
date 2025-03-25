require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../database"); // Databáze je v kořenové složce
const WebSocket = require("ws");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Obsluha statických souborů z public složky
app.use(express.static(path.join(__dirname, "public")));

// API endpointy
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err) {
        if (err) {
            return res.status(400).json({ error: "Username already taken" });
        }
        res.status(201).json({ success: true });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        res.json({ success: true, message: "Login successful" });
    });
});

app.get("/messages", (req, res) => {
    db.all("SELECT * FROM messages ORDER BY timestamp ASC", [], (err, rows) => {
        if (err) {
            console.error("Chyba při získávání zpráv:", err);
            return res.status(500).json({ error: "Chyba při získávání zpráv" });
        }
        res.json(rows);
    });
});

app.post("/messages", (req, res) => {
    const { user, text } = req.body;
    if (!user || !text) {
        return res.status(400).json({ error: "User and message text are required" });
    }
    const timestamp = new Date().toISOString();
    const sql = "INSERT INTO messages (user, text, timestamp) VALUES (?, ?, ?)";
    db.run(sql, [user, text, timestamp], function (err) {
        if (err) {
            console.error("Chyba při ukládání zprávy:", err);
            return res.status(500).json({ error: "Chyba při ukládání zprávy" });
        }
        res.status(201).json({ success: true });
    });
});

// WebSocket logika
wss.on("connection", (ws) => {
    console.log("Nové WebSocket připojení");
    ws.on("message", (message) => {
        const msgData = JSON.parse(message);
        console.log("Přijatá zpráva:", msgData);
        const sql = "INSERT INTO messages (user, text, timestamp) VALUES (?, ?, ?)";
        const timestamp = new Date().toISOString();
        db.run(sql, [msgData.user, msgData.text, timestamp], (err) => {
            if (err) {
                console.error("Chyba při ukládání zprávy:", err);
                return;
            }
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(msgData));
                }
            });
        });
    });
    db.all("SELECT * FROM messages ORDER BY timestamp ASC", [], (err, rows) => {
        if (!err && rows) {
            rows.forEach(msg => ws.send(JSON.stringify(msg)));
        }
    });
});

// Fallback pro SPA - vrací index.html z public pro všechny neznámé cesty
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicializace databáze
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            text TEXT,
            timestamp TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
});

// Spuštění serveru
server.listen(PORT, () => {
    console.log(`Chat server běží na http://localhost:${PORT}`);
});