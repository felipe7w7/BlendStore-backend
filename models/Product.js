const mongoose = require('mongoose');

// Definir las tallas permitidas
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XXL', '4', '5', '6', '7', '8', '9', '28', '30', '32', '34', '36', '38', '40', '42', 'none'];

const stockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: validSizes
  },
  color: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true, 
     unique: true 
    },
  category: {
      type: String,
      required: true
    },
  subCategory: {
     type: String, 
     required: true, 
    },
  price: {
     type: Number, 
     required: true, 
    },
  images: {
    type: [String],
    default: ["https://dummyimage.com/400x400/919191/fff.jpg&text=Default+image"] 
    },
  stockInfo: {
    type: [stockSchema],
    validate: {
      validator: function(arr) {
        return arr.length > 0;  // Asegurar que hay al menos una combinación de talla y color con stock
      },
      message: 'O produto deve ter pelo menos uma combinação de tamanho e cor disponível'
    },
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;