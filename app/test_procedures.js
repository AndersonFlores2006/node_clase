const mysql = require('mysql');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ventas'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL');

    // Probar sp_ingven (Insertar)
    connection.query('CALL sp_ingven(?, ?, ?)', ['Juan', 'Pérez', '987654321'], (err, results) => {
        if (err) throw err;
        console.log('Vendedor insertado correctamente');

        // Probar sp_lisven (Listar todos)
        connection.query('CALL sp_lisven()', (err, results) => {
            if (err) throw err;
            console.log('Lista de vendedores:', results[0]);

            // Cerrar la conexión
            connection.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                    return;
                }
                console.log('Conexión cerrada');
            });
        });
    });
}); 