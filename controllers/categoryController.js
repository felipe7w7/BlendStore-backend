const Category = require("../models/Category");

// Criar nova categoria
exports.create = async (req, res) => {
    const { name, categoryCover, subCategories } = req.body;

    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ errorMessage: 'O nome da categoria já existe' });
        }
        
        const newCategory = new Category({ name, categoryCover, subCategories });
        await newCategory.save();
        return res.status(201).json({ message: 'Categoria registrada com sucesso', status: 201 });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Erro ao criar categoria: ${err.message}` });
    }
};

// Atualizar categoria
exports.update = async (req, res) => {
    const { name, categoryCover, subCategories } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'O ID da categoria é obrigatório' });
    }

    try {
        const existingCategory = await Category.findOne({ _id: id });
        if (!existingCategory) {
            return res.status(404).json({ errorMessage: 'A categoria que você está tentando editar não existe' });
        }

        existingCategory.name = name || existingCategory.name;
        existingCategory.categoryCover = categoryCover || existingCategory.categoryCover;
        existingCategory.subCategories = subCategories || existingCategory.subCategories;
        await existingCategory.save();

        return res.status(200).json({ message: 'Categoria atualizada com sucesso', status: 200, data: existingCategory });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Erro ao atualizar a categoria: ${err.message}` });
    }
};

// Deletar categoria
exports.delete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'O ID da categoria é obrigatório' });
    }

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ errorMessage: 'A categoria que você está tentando deletar não existe' });
        }

        return res.status(200).json({ message: 'Categoria deletada com sucesso', status: 200 });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Erro ao deletar a categoria: ${err.message}` });
    }
};

// Carregar todas as categorias
exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ data: categories, status: 201 });
    } catch (err) {
        return res.status(500).json({ errorMessage: `Erro ao obter todas as categorias` });
    }
};
