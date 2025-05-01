require('dotenv').config();
const mysql = require("mysql2/promise");

// Verificar que todas las variables de entorno necesarias estén definidas
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_PORT', 'DB_DATABASE'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable de entorno ${envVar} es requerida`);
  }
}

// Configuración de la base de datos usando solo variables de entorno
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

console.log('Configuración de la base de datos inicializada');
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

