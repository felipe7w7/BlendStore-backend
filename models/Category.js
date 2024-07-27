const mongoose = require('mongoose');

const subCategoriesSchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true
  },
  subCategoryCover: {
    type: String,
    default: "https://dummyimage.com/400x400/919191/fff.jpg&text=Default+image"
  },
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryCover: {
    type: String,
    default: "https://dummyimage.com/400x400/919191/fff.jpg&text=Default+image"
  },
  subCategories: {
    type: [subCategoriesSchema],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0;  // Asegurar que hay al menos una subcategoría
      },
      message: 'La categoría debe tener al menos una subcategoría'
    }
  }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
