const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const { URL } = require("url");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Carpeta pública



const dbUrl = new URL(process.env.MYSQL_URL);

const db = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔹 Probar conexión
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
  } else {
    console.log("✅ Conectado a MySQL en Railway");
    connection.release();
  }
});

// 🔹 Listar clientes
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// 🔹 Crear cliente
app.post("/clientes", (req, res) => {
  const { nombre, apellido, telefono, vereda, mensualidad, metodo, pagado } = req.body;
  const sql = "INSERT INTO clientes (nombre, apellido, telefono, vereda, mensualidad, metodo, pagado) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [nombre, apellido, telefono, vereda, mensualidad, metodo, pagado], (err, result) => {
    if (err) {
      console.error("Error al crear cliente:", err);
      res.status(500).json({ error: "Error al crear cliente" });
    } else {
      res.json({ message: "Cliente creado", id: result.insertId });
    }
  });
});

// 🔹 Obtener cliente por ID
app.get("/clientes/:id", (req, res) => {
  db.query("SELECT * FROM clientes WHERE id = ?", [req.params.id], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

// 🔹 Editar cliente
app.put("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, vereda, mensualidad, metodo, pagado } = req.body;

  db.query(
    "UPDATE clientes SET nombre=?, apellido=?, telefono=?, vereda=?, mensualidad=?, metodo=?, pagado=? WHERE id=?",
    [nombre, apellido, telefono, vereda, mensualidad, metodo, pagado, id],
    (err, result) => {
      if (err) throw err;
      res.json({ mensaje: "Cliente actualizado", result });
    }
  );
});

// 🔹 Eliminar cliente
app.delete("/clientes/:id", (req, res) => {
  db.query("DELETE FROM clientes WHERE id = ?", [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Cliente eliminado" });
  });
});

// 🔹 Buscar clientes (nombre, apellido o teléfono)
app.get("/buscar", (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  const sql = `SELECT * FROM clientes 
               WHERE nombre LIKE ? OR apellido LIKE ? OR telefono LIKE ?`;

  const like = `%${q}%`;
  db.query(sql, [like, like, like], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
