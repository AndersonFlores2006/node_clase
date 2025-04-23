const { pool } = require('../db');

async function deleteVendedor(req, res) {
    try {
        const { id } = req.params;
        
        const [result] = await pool.query('CALL sp_delven(?)', [id]);
        res.json({ message: 'Vendedor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar vendedor:', error);
        res.status(500).json({ error: 'Error al eliminar vendedor' });
    }
}

module.exports = deleteVendedor; 