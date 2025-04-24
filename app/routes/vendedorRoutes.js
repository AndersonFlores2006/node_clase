const express = require('express');
const router = express.Router();
const VendedorController = require('../controllers/vendedorController');

// Rutas para vendedores
router.get('/', VendedorController.getAll);
router.get('/search', VendedorController.search);
router.get('/:id', VendedorController.getById);
router.post('/', VendedorController.create);
router.put('/:id', VendedorController.update);
router.delete('/:id', VendedorController.delete);

module.exports = router; 