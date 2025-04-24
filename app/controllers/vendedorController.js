const Vendedor = require('../models/Vendedor');

class VendedorController {
    static async getAll(req, res) {
        try {
            const vendedores = await Vendedor.getAll();
            res.json(vendedores);
        } catch (error) {
            console.error('Error al obtener vendedores:', error);
            res.status(500).json({ error: 'Error al obtener vendedores' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const vendedor = await Vendedor.getById(id);
            if (!vendedor || vendedor.length === 0) {
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            }
            res.json(vendedor[0]);
        } catch (error) {
            console.error('Error al obtener vendedor:', error);
            res.status(500).json({ error: 'Error al obtener vendedor' });
        }
    }

    static async search(req, res) {
        try {
            const searchTerm = req.query.term || '';
            const vendedores = await Vendedor.search(searchTerm);
            res.json(vendedores);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            res.status(500).json({ error: 'Error al buscar vendedores' });
        }
    }

    static async create(req, res) {
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

            const id = await Vendedor.create(nom_ven, apel_ven, cel_ven, id_distrito);
            res.json({ success: true, id });
        } catch (error) {
            console.error('Error al crear vendedor:', error);
            res.status(500).json({ error: error.message || 'Error al crear vendedor' });
        }
    }

    static async update(req, res) {
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

            await Vendedor.update(id, nom_ven, apel_ven, cel_ven, id_distrito);
            res.json({ success: true, message: 'Vendedor actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar vendedor:', error);
            res.status(500).json({ error: error.message || 'Error al actualizar vendedor' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Vendedor.delete(id);
            res.json({ success: true, message: 'Vendedor eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar vendedor:', error);
            res.status(500).json({ error: error.message || 'Error al eliminar vendedor' });
        }
    }
}

module.exports = VendedorController; 