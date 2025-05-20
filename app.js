require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');

const app = express();

const corsOptions = {
  origin: "https://blendstore.vercel.app",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions))
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI_PROD;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
  }).catch((err) => {
    console.error('Error conectando a MongoDB', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}, visita: http://localhost:${PORT}`);
  });