const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'view')));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// CREATE
app.post('/create/vendedor', async (req, res) => {
    try {
        const { nom_ven, apel_ven, cel_ven } = req.body;
        
        // Validaciones
        if (!nom_ven || nom_ven.trim() === '') {
            return res.status(400).json({ error: 'El nombre del vendedor no puede estar vacío' });
        }
        if (!apel_ven || apel_ven.trim() === '') {
            return res.status(400).json({ error: 'El apellido del vendedor no puede estar vacío' });
        }
        if (!cel_ven || cel_ven.trim() === '' || cel_ven.length !== 9) {
            return res.status(400).json({ error: 'El número de celular debe tener 9 dígitos' });
        }

        const [result] = await pool.query('CALL sp_ingven(?, ?, ?)', [nom_ven, apel_ven, cel_ven]);
        res.json({ success: true, id: result[0][0].nuevo_id_vendedor });
    } catch (error) {
        console.error('Error al crear vendedor:', error);
        res.status(500).json({ error: error.message || 'Error al crear vendedor' });
    }
});

// READ y SEARCH
app.get('/view/vendedores/search', async (req, res) => {
    try {
        const searchTerm = req.query.term || '';
        if (searchTerm === '') {
            // Si no hay término de búsqueda, devolver todos los vendedores
            const [results] = await pool.query('SELECT * FROM vendedor');
            res.json(results);
        } else {
            // Si hay término de búsqueda, usar una consulta directa
            const query = `
                SELECT * FROM vendedor 
                WHERE nom_ven LIKE ? 
                   OR apel_ven LIKE ? 
                   OR cel_ven LIKE ?
                ORDER BY id_ven
            `;
            const searchPattern = `%${searchTerm}%`;
            const [results] = await pool.query(query, [searchPattern, searchPattern, searchPattern]);
            res.json(results);
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({ error: 'Error al buscar vendedores' });
    }
});

app.get('/view/vendedores', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM vendedor');
        res.json(results);
    } catch (error) {
        console.error('Error al obtener vendedores:', error);
        res.status(500).json({ error: 'Error al obtener vendedores' });
    }
});

app.get('/view/vendedor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query('SELECT * FROM vendedor WHERE id_ven = ?', [id]);
        if (results.length === 0) {
            res.status(404).json({ error: 'Vendedor no encontrado' });
            return;
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error al obtener vendedor:', error);
        res.status(500).json({ error: 'Error al obtener vendedor' });
    }
});

// UPDATE
app.put('/update/vendedor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_ven, apel_ven, cel_ven } = req.body;

        // Validaciones
        if (!nom_ven || nom_ven.trim() === '') {
            return res.status(400).json({ error: 'El nombre del vendedor no puede estar vacío' });
        }
        if (!apel_ven || apel_ven.trim() === '') {
            return res.status(400).json({ error: 'El apellido del vendedor no puede estar vacío' });
        }
        if (!cel_ven || cel_ven.trim() === '' || cel_ven.length !== 9) {
            return res.status(400).json({ error: 'El número de celular debe tener 9 dígitos' });
        }

        const [result] = await pool.query('CALL sp_modven(?, ?, ?, ?)', [id, nom_ven, apel_ven, cel_ven]);
        res.json({ success: true, message: 'Vendedor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar vendedor:', error);
        res.status(500).json({ error: error.message || 'Error al actualizar vendedor' });
    }
});

// DELETE
app.delete('/delete/vendedor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('CALL sp_delven(?)', [id]);
        res.json({ success: true, message: 'Vendedor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar vendedor:', error);
        res.status(500).json({ error: error.message || 'Error al eliminar vendedor' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 