require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database"); // Import databáze
const bcrypt = require("bcrypt");

const WebSocket = require("ws");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname)));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend.html"));
});

const saltRounds = 10; // Počet "salt" kol

// Registrace uživatele
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Šifrování hesla
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }

        // Uložení šifrovaného hesla do databáze
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
            if (err) {
                return res.status(400).json({ error: "Username already taken" });
            }
            res.status(201).json({ success: true });
        });
    });
});

// Přihlášení uživatele
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        console.log("Chybí uživatelské jméno nebo heslo");
        return res.status(400).json({ error: "Username and password are required" });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            console.log("Chyba při hledání uživatele:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            console.log("Uživatel nenalezen");
            return res.status(401).json({ error: "Invalid username or password" });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log("Chyba při porovnání hesel:", err);
                return res.status(500).json({ error: "Error checking password" });
            }
            if (!isMatch) {
                console.log("Hesla se neshodují");
                return res.status(401).json({ error: "Invalid username or password" });
            }

            console.log("Přihlášení úspěšné");
            res.json({ success: true, message: "Login successful" });
        });
    });
});


// Získání zpráv
app.get("/messages", (req, res) => {
    db.all("SELECT * FROM messages ORDER BY timestamp ASC", [], (err, rows) => {
        if (err) {
            console.error("Chyba při získávání zpráv:", err);
            return res.status(500).json({ error: "Chyba při získávání zpráv" });
        }
        res.json(rows);
    });
});

// Odeslání zpráv
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

// Vytvoření místnosti a tabulek
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            text TEXT,
            timestamp TEXT
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS room_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id INTEGER,
            user TEXT,
            text TEXT,
            timestamp TEXT,
            FOREIGN KEY(room_id) REFERENCES rooms(id)
        )
    `);
});

// WebSocket pro chat
wss.on("connection", (ws) => {
    console.log("Nové WebSocket připojení");

    ws.on("message", (message) => {
        const msgData = JSON.parse(message);
        console.log("📩 Přijatá zpráva:", msgData);

        const sql = "INSERT INTO messages (user, text, timestamp) VALUES (?, ?, ?)";
        const timestamp = new Date().toISOString();

        db.run(sql, [msgData.user, msgData.text, timestamp], (err) => {
            if (err) {
                console.error("❌ Chyba při ukládání zprávy:", err);
                return;
            }

            // Poslat zprávu VŠEM klientům (včetně odesílatele)
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ user: msgData.user, text: msgData.text, timestamp }));
                }
            });
        });
    });

    // Po připojení pošleme historii zpráv
    db.all("SELECT * FROM messages ORDER BY timestamp ASC", [], (err, rows) => {
        if (!err && rows) {
            rows.forEach(msg => ws.send(JSON.stringify(msg)));
        }
    });
});

// Endpointy pro místnosti
app.post('/rooms', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Room name is required" });

    db.run("INSERT INTO rooms (name) VALUES (?)", [name], function (err) {
        if (err) return res.status(400).json({ error: "Room name already exists" });
        res.status(201).json({ id: this.lastID, name });
    });
});

app.get('/rooms', (req, res) => {
    db.all("SELECT * FROM rooms", [], (err, rooms) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rooms);
    });
});

// Spuštění serveru
server.listen(PORT, () => {
    console.log(`Chat server běží na http://localhost:${PORT}`);
});