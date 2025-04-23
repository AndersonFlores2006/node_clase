const mysql = require('mysql');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // Por defecto XAMPP no tiene contraseña
    database: 'ventas',
    port: 3306     // Puerto por defecto de MySQL
});

// Conectar a la base de datos
connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        console.error('Detalles de la conexión:', {
            host: connection.config.host,
            user: connection.config.user,
            database: connection.config.database,
            port: connection.config.port
        });
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
    
    // Verificar que la base de datos existe
    connection.query('SHOW DATABASES LIKE ?', [connection.config.database], (err, results) => {
        if (err) {
            console.error('Error al verificar la base de datos:', err);
            return;
        }
        if (results.length === 0) {
            console.error('La base de datos no existe. Por favor, crea la base de datos y las tablas.');
            return;
        }
        console.log('Base de datos verificada correctamente');
        
        // Verificar que la tabla existe
        connection.query('SHOW TABLES LIKE "Vendedor"', (err, results) => {
            if (err) {
                console.error('Error al verificar la tabla:', err);
                return;
            }
            if (results.length === 0) {
                console.error('La tabla Vendedor no existe. Por favor, crea la tabla.');
                return;
            }
            console.log('Tabla Vendedor verificada correctamente');
        });
    });
});

// Manejar la desconexión
connection.on('error', function(err) {
    console.error('Error de base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Conexión perdida. Reconectando...');
        connection.connect();
    } else {
        throw err;
    }
});

module.exports = connection;

