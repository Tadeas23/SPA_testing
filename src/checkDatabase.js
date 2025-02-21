const sqlite3 = require("sqlite3").verbose();

// Otevři databázi
const db = new sqlite3.Database("chat.db");

// Získání všech zpráv
db.all("SELECT * FROM messages", [], (err, rows) => {
    if (err) {
        console.error("Chyba při získávání zpráv:", err.message);
    } else {
        if (rows.length > 0) {
            console.log("📩 Zprávy v databázi:", rows);
        } else {
            console.log("⚠️ Žádné zprávy v databázi.");
        }
    }
});

// Získání všech uživatelů
db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        console.error("Chyba při získávání uživatelů:", err.message);
    } else {
        if (rows.length > 0) {
            console.log("👤 Uživatelé v databázi:", rows);
        } else {
            console.log("⚠️ Žádní uživatelé v databázi.");
        }
    }
});

// Uzavření databáze
db.close();
