const Product = require("../models/Product");

// Criar novo produto
exports.create = async (req, res) => {
    const { name, category, subCategory, price, images, stockInfo, description } = req.body;

    try {
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ errorMessage: 'Já existe um produto com esse nome' });
        }

        const newProduct = new Product({ name, category, subCategory, price, images, stockInfo, description });
        await newProduct.save();
        return res.status(201).json({ message: 'Novo produto registrado com sucesso', status: 201 });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Erro ao registrar produto: ${err.message}` });
    }
};

// Atualizar produto
exports.update = async (req, res) => {
    const { name, category, subCategory, price, images, stockInfo, description } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'O ID do produto é obrigatório' });
    }

    try {
        const existingProduct = await Product.findOne({ _id: id });
        if (!existingProduct) {
            return res.status(404).json({ errorMessage: 'O produto que você está tentando editar não existe' });
        }

        existingProduct.name = name || existingProduct.name;
        existingProduct.category = category || existingProduct.category;
        existingProduct.subCategory = subCategory || existingProduct.subCategory;
        existingProduct.price = price || existingProduct.price;
        existingProduct.images = images || existingProduct.images;
        existingProduct.stockInfo = stockInfo || existingProduct.stockInfo;
        existingProduct.description = description || existingProduct.description;

        await existingProduct.save();

        return res.status(200).json({ message: 'Produto atualizado com sucesso', status: 200, data: existingProduct });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Erro ao atualizar o produto: ${err.message}` });
    }
};

// Deletar produto
exports.delete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'O ID do produto é obrigatório' });
    }

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ errorMessage: 'O produto que você está tentando deletar não existe' });
        }

        return res.status(200).json({ message: 'Produto deletado com sucesso', status: 200 });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Erro ao deletar o produto: ${err.message}` });
    }
};

// Carregar todos os produtos
exports.getAll = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(201).json({ data: products, status: 201 });
    } catch (err) {
        return res.status(400).json({ message: `Erro ao carregar todos os produtos: ${err.message}` });
    }
};

// Carregar um produto
exports.getOne = async (req, res) => {
    const { id } = req.params;

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ errorMessage: 'O produto buscado não existe' });
        }

        return res.status(201).json({ message: 'Produto encontrado com sucesso', status: 201, data: existingProduct });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Erro ao buscar o produto: ${err.message}` });
    }
};
