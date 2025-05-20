require('dotenv').config();
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')

//crear nuevos productos
router.post('/', productController.create);

//actualizar de productos
router.put('/:id', productController.update);

//eliminar productos
router.delete('/:id', productController.delete);

//cargar un producto
router.get('/:id', productController.getOne);

//cargar todos los productos
router.get('/', productController.getAll);

module.exports = router;