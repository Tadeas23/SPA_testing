require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database"); // Import databáze

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname)));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend.html"));
});

// Registrace uživatele
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

// Přihlášení uživatele
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

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`Chat server běží na http://localhost:${PORT}`);
});
