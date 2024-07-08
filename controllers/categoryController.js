const Category = require("../models/Category");

//crear nueva categoria
exports.create = async (req, res) => {
    const { name } = req.body;

    try {
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).json({ errorMessage: 'El nombre de la categoria ya existe' });
        }
        
        const newCategory = new Category({ name });
        await newCategory.save();
        return res.status(201).json({ message: 'Categoria registrada', status: 201 });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error creando categorias, ${err.message}` });
    }
}

//actualizar categoria
exports.update = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'El Id de la categoria es requerido' });
    }

    try {
        const existingCategory = await Category.findOne({ _id: id })
        if (!existingCategory) {
            return res.status(404).json({ errorMessage: 'La categoria que intentas editar no existe' });
        }

        existingCategory.name = name || existingCategory.name;
        await existingCategory.save();

        return res.status(200).json({ message: 'Categoria actualizada con éxito', status: 200, data: existingCategory });
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error actualizando la categoria, ${err.message}` });
    }
}

//eliminar categoria
exports.delete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ errorMessage: 'El Id de la categoria es requerido' });
    }

    try {
        const category = await Category.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).json({ errorMessage: 'La categoria que intentas eliminar no existe' });
        }

        return res.status(200).json({ message: 'Categoria eliminada con éxito', status: 200});
    } catch (err) {
        return res.status(400).json({ errorMessage: `Error eliminando la categoria, ${err.message}` });
    }
};

//cargar categorias
exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ data: categories, status: 201 });
    } catch (err) {
        return res.status(500).json({ errorMessage: `Error al obtener todas las categorias` });
    }
};