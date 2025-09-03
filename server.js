const mysql = require("mysql2");

// 🔍 Mostrar las variables de entorno que Railway le pasa a este servicio
console.log("🔍 Variables de conexión detectadas:");
console.log("HOST:", process.env.MYSQLHOST);
console.log("USER:", process.env.MYSQLUSER);
console.log("DB:", process.env.MYSQLDATABASE);
console.log("PORT:", process.env.MYSQLPORT);
console.log("PASSWORD:", process.env.MYSQLPASSWORD ? "**** (oculta)" : "NO DEFINIDA");

// 🔹 Crear conexión a MySQL
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔹 Probar conexión
db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
  } else {
    console.log("✅ Conexión exitosa a MySQL en Railway");
    db.end();
  }
});

