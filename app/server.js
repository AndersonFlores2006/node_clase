// Cargar variables de entorno al inicio
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const { pool, testConnection } = require('./db');
const XLSX = require('xlsx');
const PdfPrinter = require('pdfmake');

// Verificar variables de entorno críticas
console.log('Variables de entorno del servidor:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Importar rutas
const vendedorRoutes = require('./routes/vendedorRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'views')));

// Rutas
app.use('/api/vendedores', vendedorRoutes);

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

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('IMPORTANTE: Asegúrate de ejecutar el script railway_procedures.sql para crear los procedimientos almacenados necesarios');
});