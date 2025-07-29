
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Obtener todos los grupos
app.get('/grupos', async (req, res) => {
  const result = await pool.query('SELECT * FROM grupos ORDER BY id');
  res.json(result.rows);
});

// Obtener todos los jurados
app.get('/jurados', async (req, res) => {
  const result = await pool.query('SELECT * FROM jurados ORDER BY id');
  res.json(result.rows);
});

// Enviar evaluación
app.post('/evaluaciones', async (req, res) => {
  const { jurado_id, grupo_id, categoria, item, puntaje } = req.body;
  const result = await pool.query(
    'INSERT INTO evaluaciones (jurado_id, grupo_id, categoria, item, puntaje) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [jurado_id, grupo_id, categoria, item, puntaje]
  );
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
