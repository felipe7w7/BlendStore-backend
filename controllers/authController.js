require('dotenv').config();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 5;
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer')

//registro de usuarios
exports.register = async (req, res) => {
    const { name, lastname, username, password, email } = req.body;

    try {
        const existedUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        if (existedUser) {
            return res.status(400).json({ message: 'El nombre de usuario o el correo electrónico ya están en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, lastname, username, password: hashedPassword, email });
        await newUser.save();
        return res.status(201).json({ message: 'Usuario registrado', status: 201 });
    } catch (err) {
        return res.status(400).json({ message: `Error registrando usuario, ${err.message}` });
    }
}
//login de usuarios
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas: No existe ese usuario' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas: Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.SECRET_KEY, { expiresIn: '30m' });
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' })
    }

}

//envio de correo para la recuperacion de contraseña
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(401).json({ message: 'Email no agregado - campo obligatorio' })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const resetToken = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.SECRET_KEY, { expiresIn: '7m' })

        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.USERMAIL,
                pass: process.env.USERPASSWORD
            }
        });

        const mailOptions = {
            from: process.env.USERMAIL,
            to: `${user.email}`,
            subject: 'Recupera tu contraseña',
            text: `Crea tu nueva contraseña ingresando al siguiente link: ${process.env.URL_FRONTEND}/resetPassword?token=${resetToken}, recuerda que este token sólo estara vigente por 7 min. Despúes tendras que volver a solicitarlo de nuevo.
    
      Si no solicitaste el cambio de contraseña, ignora este correo. Tu contraseña continuará siendo la misma.
      `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            } else {
                console.log('Correo enviado correctamente: ' + info.response);
            }
        });
        return res.status(201).json({ message: 'Token enviado a tu correo para cambiar contraseña' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

//cambiar contraseña
exports.changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const { email } = req.user;

    if (!email || !newPassword) {
        return res.status(401).json({ message: 'Faltan credenciales por completar' })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword
        await user.save();
        res.status(201).json({ message: 'Contraseña cambiada existosamente' });
    } catch (error) {
        res.status(500).json({ errorMessage: `Error en el servidor cambiando contraseña: ${error.message}` });
    }
}

//ruta privada
exports.dashboard = (req, res) => {
    return res.status(201).json({ message: "Token valido y acceso permitido a la ruta protegida", data: req.user })
}

