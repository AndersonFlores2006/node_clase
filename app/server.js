const express = require('express');
const path = require('path');
const cors = require('cors');
const { pool } = require('./db');
const XLSX = require('xlsx');
const PdfPrinter = require('pdfmake');

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

// Ruta para obtener distritos
app.get('/view/distritos', async (req, res) => {
    try {
        const [results] = await pool.query('CALL sp_lisdistritos()');
        res.json(results[0]);
    } catch (error) {
        console.error('Error al obtener distritos:', error);
        res.status(500).json({ error: 'Error al obtener distritos' });
    }
});

// CREATE
app.post('/create/vendedor', async (req, res) => {
    try {
        const { nom_ven, apel_ven, cel_ven, id_distrito } = req.body;
        
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

        // Ejecutar el procedimiento almacenado con los parámetros correctos
        const [result] = await pool.query('CALL sp_ingven(?, ?, ?, ?)', [nom_ven, apel_ven, cel_ven, id_distrito || null]);
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
        const [results] = await pool.query('CALL sp_searchven(?)', [searchTerm]);
        res.json(results[0]);
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({ error: 'Error al buscar vendedores' });
    }
});

app.get('/view/vendedores', async (req, res) => {
    try {
        const [results] = await pool.query('CALL sp_lisven()');
        res.json(results[0]);
    } catch (error) {
        console.error('Error al obtener vendedores:', error);
        res.status(500).json({ error: 'Error al obtener vendedores' });
    }
});

app.get('/view/vendedor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query('CALL sp_busven(?)', [id]);
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
        const { nom_ven, apel_ven, cel_ven, id_distrito } = req.body;

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

        const [result] = await pool.query('CALL sp_modven(?, ?, ?, ?, ?)', [id, nom_ven, apel_ven, cel_ven, id_distrito || null]);
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

// Export to Excel
app.get('/export/excel', async (req, res) => {
    try {
        const [vendedores] = await pool.query('SELECT * FROM Vendedor');
        
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(vendedores);
        
        // Set column headers
        XLSX.utils.sheet_add_aoa(ws, [['ID', 'Nombre', 'Apellido', 'Celular']], { origin: 'A1' });
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Vendedores');
        
        // Generate buffer
        const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Vendedores.xlsx');
        
        res.send(excelBuffer);
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        res.status(500).json({ error: 'Error al exportar a Excel' });
    }
});

// Export to PDF
app.get('/export/pdf', async (req, res) => {
    try {
        const [vendedores] = await pool.query('SELECT * FROM Vendedor');
        
        const fonts = {
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            }
        };
        
        const printer = new PdfPrinter(fonts);
        
        // Prepare data for the table
        const tableBody = [
            ['ID', 'Nombre', 'Apellido', 'Celular'], // headers
            ...vendedores.map(v => [v.id_ven.toString(), v.nom_ven, v.apel_ven, v.cel_ven])
        ];
        
        const docDefinition = {
            content: [
                { text: 'Lista de Vendedores', style: 'header' },
                { text: `Fecha: ${new Date().toLocaleDateString()}`, style: 'subheader' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', '*', 'auto'],
                        body: tableBody
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 12,
                    margin: [0, 0, 0, 20]
                }
            },
            defaultStyle: {
                font: 'Helvetica'
            }
        };
        
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Vendedores.pdf');
        
        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (error) {
        console.error('Error al exportar a PDF:', error);
        res.status(500).json({ error: 'Error al exportar a PDF' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('IMPORTANTE: Asegúrate de ejecutar el script railway_procedures.sql para crear los procedimientos almacenados necesarios');
});