const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      amount REAL
    )
  `);
});

app.get('/transactions', (req, res) => {
  db.all("SELECT * FROM transactions", [], (err, rows) => {
    res.json(rows);
  });
});

app.post('/transactions', (req, res) => {
  const { description, amount } = req.body;

  db.run(
    "INSERT INTO transactions (description, amount) VALUES (?, ?)",
    [description, amount],
    function (err) {
      res.json({ id: this.lastID });
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
