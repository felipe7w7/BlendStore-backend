import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);
router.get('/', categoryController.getAll);

export default router;
