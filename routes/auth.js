require('dotenv').config();
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authController = require('../controllers/authController')

//registro de usuarios
router.post('/register', authController.register);

//login de usuarios
router.post('/login', authController.login);

//***restablecer contraseña**
//envio de email con url para restablecer contraseña
router.post('/forgotPassword', authController.forgotPassword);

//cambio de contraseña
router.put('/changePassword', verifyToken, authController.changePassword);

//ruta protegida
router.get('/dashboard', verifyToken, authController.dashboard);

module.exports = router;