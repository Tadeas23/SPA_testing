const sqlite3 = require("sqlite3").verbose();

// Vytvoření nebo připojení k databázovému souboru chat.db
const db = new sqlite3.Database("chat.db", (err) => {
    if (err) {
        console.error("Chyba při připojování k databázi:", err.message);
    } else {
        console.log("Připojeno k SQLite databázi.");
    }
});

// Vytvoření tabulky pro uživatele (pokud neexistuje)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
});

module.exports = db; // Exportujeme db, abychom ji mohli použít v hlavním souboru
