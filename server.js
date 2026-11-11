const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'szerviz_db',
    port: 3307
});

db.connect((err) => {
    if (err) {
        console.error('Hiba az adatbázis csatlakozáskor:', err);
        return;
    }
    console.log('Sikeres kapcsolat az adatbázissal!');
});

//1
app.get('/szolgaltatasok', (req, res) => {
    const sql = 'SELECT szolgaltatasok.id, szolgaltatasok.megnevezes, szolgaltatasok.alapar, szolgaltatasok.munkaido_perc, szolgaltatasok.aktiv, kategoriak.nev AS kategoria_nev FROM szolgaltatasok INNER JOIN kategoriak ON szolgaltatasok.kategoria_id = kategoriak.id ORDER BY szolgaltatasok.alapar ASC;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});
//2
app.get('/szolgaltatasok', (req, res) => {
    const sql = 'SELECT id, kategoria_id, megnevezes, alapar, munkaido_perc, aktiv FROM szolgaltatasok WHERE aktiv = 1 AND munkaido_perc <= 60;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});
//3
app.get('/szolgaltatasok/kereses/:szoveg', (req, res) => {
    const sql = 'SELECT * FROM `szolgaltatasok`;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});
//4
app.get('/kategoriak/statisztika', (req, res) => {
    const sql = 'SELECT kategoriak.nev AS kategoria_nev, COUNT(szolgaltatasok.id) AS szolgaltatasok_szama, ROUND(AVG(szolgaltatasok.alapar), 1) AS atlagos_alapar FROM kategoriak INNER JOIN szolgaltatasok ON kategoriak.id = szolgaltatasok.kategoria_id GROUP BY kategoriak.id, kategoriak.nev;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});
//5
app.get('/szolgaltatasok/dragak', (req, res) => {
    const sql = 'SELECT megnevezes, alapar, munkaido_perc FROM szolgaltatasok WHERE alapar > 25000 ORDER BY munkaido_perc DESC;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`A szerver fut a http://localhost:${PORT} címen.`);
});