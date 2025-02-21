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

// Funkce pro získání seznamu tabulek
db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
        if (err) {
            console.error("Chyba při získávání tabulek:", err.message);
        } else {
            console.log("Tabulky v databázi:", tables);
        }
    });
});


module.exports = db; // Exportujeme db, abychom ji mohli použít v hlavním souboru
