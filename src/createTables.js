const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("chat.db");

// Vytvoření tabulky pro uživatele
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error("Chyba při vytváření tabulky 'users':", err.message);
    } else {
        console.log("Tabulka 'users' byla vytvořena nebo již existuje.");
    }
});

// Vytvoření tabulky pro zprávy
db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error("Chyba při vytváření tabulky 'messages':", err.message);
    } else {
        console.log("Tabulka 'messages' byla vytvořena nebo již existuje.");
    }
});

// Uzavření databáze
db.close();
