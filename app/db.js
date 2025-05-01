require('dotenv').config();
const mysql = require("mysql2/promise");

// Verificar y mostrar la configuración
const config = {
  host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'CaCCQPMlJGquCrnImlacApdzKmACfHui',
  port: parseInt(process.env.DB_PORT || '41613'),
  database: process.env.DB_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

console.log('Configuración de la base de datos:');
console.log('Host:', config.host);
console.log('Port:', config.port);
console.log('Database:', config.database);
console.log('User:', config.user);

const pool = mysql.createPool(config);

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión exitosa a la base de datos");

    // Realizar una consulta de prueba
    const [rows] = await connection.query("SELECT 1");
    console.log("Consulta de prueba exitosa");

    connection.release();
    return true;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    console.error("Detalles del error:", error);
    return false;
  }
}

// Ejecutar prueba de conexión al inicio
testConnection();

module.exports = { pool, testConnection };

