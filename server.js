const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const {
  evaluarPenalizacion,
  validarReglaEdad,
  validarHorarioOperativo,
  verificarChoqueCitas
} = require('./citasLogic');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE citas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente TEXT,
    edad INTEGER,
    categoria TEXT,
    medicoId INTEGER,
    fechaHora TEXT,
    estado TEXT DEFAULT 'ACTIVA',
    penalizado INTEGER DEFAULT 0
  )`);
});

app.post('/api/citas', (req, res) => {
  try {
    const { paciente, edad, tieneRepresentante, medicoId, fechaHora } = req.body;
    const fechaObj = new Date(fechaHora);

    if (!validarHorarioOperativo(fechaObj.getHours(), fechaObj.getDay())) {
      return res.status(400).json({ error: 'Franja horaria no operativa.' });
    }

    const categoria = validarReglaEdad(edad, tieneRepresentante);

    db.all(`SELECT * FROM citas WHERE medicoId = ?`, [medicoId], (err, rows) => {
      try {
        verificarChoqueCitas(rows, medicoId, fechaHora);
        db.run(
          `INSERT INTO citas (paciente, edad, categoria, medicoId, fechaHora) VALUES (?, ?, ?, ?, ?)`,
          [paciente, edad, categoria, medicoId, fechaHora],
          function () {
            res.status(201).json({ id: this.lastID, categoria, estado: 'ACTIVA' });
          }
        );
      } catch (choqueErr) {
        res.status(409).json({ error: choqueErr.message });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/citas/:id/cancelar', (req, res) => {
  const { horasAnticipacion, esEmergencia } = req.body;
  const cancelacionTardia = horasAnticipacion < 24;
  let flagPenalizacion = 0;

  const resultado = evaluarPenalizacion(cancelacionTardia, esEmergencia, () => {
    flagPenalizacion = 1;
  });

  db.run(
    `UPDATE citas SET estado = 'CANCELADA', penalizado = ? WHERE id = ?`,
    [flagPenalizacion, req.params.id],
    () => res.json(resultado)
  );
});

module.exports = app;