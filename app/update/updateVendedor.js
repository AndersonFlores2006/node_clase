const { pool } = require('../db');

async function updateVendedor(req, res) {
    try {
        const { id } = req.params;
        const { nom_ven, ape_ven, cel_ven, distrito } = req.body;
        
        const [result] = await pool.query('CALL sp_modven(?, ?, ?, ?, ?)', [id, nom_ven, ape_ven, cel_ven, distrito]);
        res.json({ message: 'Vendedor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar vendedor:', error);
        res.status(500).json({ error: 'Error al actualizar vendedor' });
    }
}

module.exports = updateVendedor;