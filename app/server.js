const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const connection = require('./db');

const createVendedor = require('./create/createVendedor');
const updateVendedor = require('./update/updateVendedor');
const deleteVendedor = require('./delete/deleteVendedor');

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
app.post('/create/vendedor', createVendedor);

// READ y SEARCH
app.get('/view/vendedores/search', (req, res) => {
    const searchTerm = req.query.term || '';
    if (searchTerm === '') {
        // Si no hay término de búsqueda, devolver todos los vendedores
        connection.query('CALL sp_lisven()', (err, results) => {
            if (err) {
                console.error('Error al obtener vendedores:', err);
                res.status(500).json({ error: 'Error al obtener vendedores' });
                return;
            }
            res.json(results[0]);
        });
    } else {
        // Si hay término de búsqueda, usar una consulta SQL directa
        const query = `
            SELECT * FROM Vendedor 
            WHERE nom_ven LIKE ? 
               OR ape_ven LIKE ? 
               OR cel_ven LIKE ?
            ORDER BY id_ven
        `;
        const searchPattern = `%${searchTerm}%`;
        connection.query(query, [searchPattern, searchPattern, searchPattern], (err, results) => {
            if (err) {
                console.error('Error al buscar vendedores:', err);
                res.status(500).json({ error: 'Error al buscar vendedores' });
                return;
            }
            res.json(results);
        });
    }
});

app.get('/view/vendedores', (req, res) => {
    connection.query('CALL sp_lisven()', (err, results) => {
        if (err) {
            console.error('Error al obtener vendedores:', err);
            res.status(500).json({ error: 'Error al obtener vendedores' });
            return;
        }
        res.json(results[0]);
    });
});

app.get('/view/vendedor/:id', (req, res) => {
    const { id } = req.params;
    connection.query('CALL sp_busven(?)', [id], (err, results) => {
        if (err) {
            console.error('Error al obtener vendedor:', err);
            res.status(500).json({ error: 'Error al obtener vendedor' });
            return;
        }
        if (!results[0] || results[0].length === 0) {
            res.status(404).json({ error: 'Vendedor no encontrado' });
            return;
        }
        res.json(results[0][0]);
    });
});

// UPDATE
app.put('/update/vendedor/:id', updateVendedor);

// DELETE
app.delete('/delete/vendedor/:id', deleteVendedor);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 