import express from 'express';
import dotenv from 'dotenv';
import productController from '../controllers/productController.js';

dotenv.config();

const router = express.Router();

router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);
router.get('/:id', productController.getOne);
router.get('/', productController.getAll);

export default router;
file:///C:/Users/felip/OneDrive/%C3%81rea%20de%20Trabalho/BlendStore-backend/routes/product.js:3
import productController from '../controllers/productController.js';
       ^^^^^^^^^^^^^^^^^
SyntaxError: The requested module '../controllers/productController.js' does not provide an export named 'default'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:134:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:217:5)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:123:5)

Node.js v20.14.0