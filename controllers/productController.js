const Product = require("../models/Product");

// crear nuevos productos
exports.create = async (req, res) => {
    const { name, category, subCategory, price, images, stockInfo, description } = req.body;

    try {
        const existingProduct = await Product.findOne({ name })
        if (existingProduct) {
            return res.status(400).json({ errorMessage: 'Ya existe un producto con ese nombre' });
        }

        const newProduct = new Product({ name, category, subCategory, price, images, stockInfo, description });
        await newProduct.save();
        return res.status(201).json({ message: 'Nuevo producto registrado', status: 201 });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error registrando productos, ${err.message}` });
    }
}

// actualizar productos
exports.update = async (req, res) => {
    const { name, category, subCategory, price, images, stockInfo, description } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'El Id del producto es requerido' });
    }

    try {
        const existingProduct = await Product.findOne({ _id: id })
        if (!existingProduct) {
            return res.status(404).json({ errorMessage: 'El producto que intentas editar no existe' });
        }

        existingProduct.name = name || existingProduct.name;
        existingProduct.category = category || existingProduct.category;
        existingProduct.subCategory = subCategory || existingProduct.subCategory;
        existingProduct.price = price || existingProduct.price;
        existingProduct.images = images || existingProduct.images;
        existingProduct.stockInfo  = stockInfo || existingProduct.stockInfo;
        existingProduct.description  = description || existingProduct.description;

        await existingProduct.save();

        return res.status(200).json({ message: 'Producto actualizado con éxito', status: 200, data: existingProduct });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error actualizando el producto, ${err.message}` });
    }
}

// eliminar productos
exports.delete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'El Id del producto es requerido' });
    }

    try {
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({ errorMessage: 'El producto que intentas eliminar no existe' });
        }

        return res.status(200).json({ message: 'Producto eliminado con éxito', status: 200});
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error actualizando el producto, ${err.message}` });
    }
}

//cargar todos los productos
exports.getAll = async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(201).json({ data: products, status: 201 });
    } catch (err) {
        return res.status(400).json({ message: `Error al cargar todos los productos, ${err.message}` });
    }
}

//cargar un productos
exports.getOne = async (req, res) => {
    const { id } = req.params;

    try {
        const existingProduct = await Product.findById(id)
        if (!existingProduct) {
            return res.status(404).json({ errorMessage: 'El producto buscado no existe' });
        }

        return res.status(201).json({ message: 'Producto encontrado con éxito', status: 201, data: existingProduct });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error al cargar todos los productos, ${err.message}` });
    }
}