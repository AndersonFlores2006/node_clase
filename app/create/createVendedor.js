const { pool } = require('../db');

async function createVendedor(req, res) {
    try {
        const { nom_ven, ape_ven, cel_ven } = req.body;
        
        const [result] = await pool.query('CALL sp_ingven(?, ?, ?)', [nom_ven, ape_ven, cel_ven]);
        res.status(201).json({ message: 'Vendedor creado correctamente' });
    } catch (error) {
        console.error('Error al crear vendedor:', error);
        res.status(500).json({ error: 'Error al crear vendedor' });
    }
}

module.exports = createVendedor; 