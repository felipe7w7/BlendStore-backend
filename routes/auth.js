
module.exports = router;
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const router = express.Router();

import verifyToken from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.put('/changePassword', verifyToken, authController.changePassword);
router.get('/dashboard', verifyToken, authController.dashboard);

export default router;
