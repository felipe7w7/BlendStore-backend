import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';

const saltRounds = 5;

// Registro de usuários
export const register = async (req, res) => {
    const { name, lastname, username, password, email } = req.body;

    try {
        const existedUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
        if (existedUser) {
            return res.status(400).json({ message: 'O nome de usuário ou o e-mail já estão em uso' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, lastname, username, password: hashedPassword, email });
        await newUser.save();
        return res.status(201).json({ message: 'Usuário registrado com sucesso', status: 201 });
    } catch (err) {
        return res.status(400).json({ message: `Erro ao registrar o usuário: ${err.message}` });
    }
};

// Login de usuários
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas: Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas: Senha incorreta' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '30m' }
        );
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

// Envio de e-mail para recuperação de senha
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(401).json({ message: 'E-mail não informado - campo obrigatório' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const resetToken = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '7m' }
        );

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
            subject: 'Recupere sua senha',
            text: `Crie sua nova senha acessando o seguinte link: ${process.env.URL_FRONTEND}/resetPassword?token=${resetToken}. Lembre-se que esse token é válido por apenas 7 minutos. Depois disso, será necessário solicitar um novo.

Se você não solicitou a troca de senha, ignore este e-mail. Sua senha continuará a mesma.`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('E-mail enviado com sucesso: ' + info.response);
            }
        });

        return res.status(201).json({ message: 'Token enviado para o seu e-mail para redefinição de senha' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

// Troca de senha
export const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const { email } = req.user;

    if (!email || !newPassword) {
        return res.status(401).json({ message: 'Credenciais incompletas' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();

        res.status(201).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: `Erro interno ao alterar senha: ${error.message}` });
    }
};

// Rota protegida
export const dashboard = (req, res) => {
    return res.status(201).json({ message: "Token válido. Acesso permitido à rota protegida", data: req.user });
};

