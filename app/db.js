require('dotenv').config();
const mysql = require("mysql2/promise");

// Verificar las variables de entorno al inicio
console.log('Configuración de la base de datos:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_USER:', process.env.DB_USER);

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
  console.error('Error: Faltan variables de entorno necesarias para la conexión a la base de datos');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión exitosa a la base de datos");
    console.log("Host:", process.env.DB_HOST);
    console.log("Database:", process.env.DB_DATABASE);

    // Realizar una consulta de prueba
    const [rows] = await connection.query("SELECT 1");
    console.log("Consulta de prueba exitosa");

    connection.release();
    return true;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    console.error("Detalles del error:", error);
    console.error("Verifica que las variables de entorno estén configuradas correctamente");
    return false;
  }
}

// Ejecutar la prueba de conexión
testConnection();

module.exports = { pool, testConnection };

