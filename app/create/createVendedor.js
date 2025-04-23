const mysql = require('mysql');
const connection = require('../db');

function createVendedor(req, res) {
    const { nom_ven, ape_ven, cel_ven } = req.body;
    
    connection.query('CALL sp_ingven(?, ?, ?)', [nom_ven, ape_ven, cel_ven], (err, results) => {
        if (err) {
            console.error('Error al crear vendedor:', err);
            res.status(500).json({ error: 'Error al crear vendedor' });
            return;
        }
        res.status(201).json({ message: 'Vendedor creado correctamente' });
    });
}

module.exports = createVendedor; 