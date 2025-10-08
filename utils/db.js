const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sales.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller TEXT,
    amount INTEGER,
    facAmount INTEGER,
    date TEXT
  )`);
});

module.exports = db;
