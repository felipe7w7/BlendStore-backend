const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController')

//crear categorias
router.post('/', categoryController.create)

//actualizar categorias
router.put('/:id', categoryController.update)

//eliminar categorias
router.delete('/:id', categoryController.delete)

//mostrar todas las categorias
router.get('/', categoryController.getAll)

module.exports = router;