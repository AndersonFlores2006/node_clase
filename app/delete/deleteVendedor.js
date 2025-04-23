const mysql = require('mysql');
const connection = require('../db');

function deleteVendedor(req, res) {
    const { id } = req.params;
    
    connection.query('CALL sp_eliven(?)', [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar vendedor:', err);
            res.status(500).json({ error: 'Error al eliminar vendedor' });
            return;
        }
        res.json({ message: 'Vendedor eliminado correctamente' });
    });
}

module.exports = deleteVendedor; 