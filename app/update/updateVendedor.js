const mysql = require('mysql');
const connection = require('../db');

function updateVendedor(req, res) {
    const { id } = req.params;
    const { nom_ven, ape_ven, cel_ven } = req.body;
    
    connection.query('CALL sp_modven(?, ?, ?, ?)', [id, nom_ven, ape_ven, cel_ven], (err, results) => {
        if (err) {
            console.error('Error al actualizar vendedor:', err);
            res.status(500).json({ error: 'Error al actualizar vendedor' });
            return;
        }
        res.json({ message: 'Vendedor actualizado correctamente' });
    });
}

module.exports = updateVendedor; 