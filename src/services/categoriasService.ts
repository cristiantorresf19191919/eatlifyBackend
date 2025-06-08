import { Service } from 'typedi';
import Categorias from '../models/Categorias';
import Product from '../models/Productos';

@Service()
export class CategoriasService {
    async getCategorias(userId: string) {
        return await Categorias.find({ user: userId });
    }

    async postCategorias(name: string, taxable: boolean, userId: string) {
        if (!taxable) taxable = false;
        const categoria = await Categorias.findOne({ name: name, user: userId });
        if (categoria) {
            throw new Error("La categoria ya existe");
        }
        const newCategoria = new Categorias({ name, taxable, user: userId });
        return await newCategoria.save();
    }

    async deleteCategorias(id: string) {
        const categoria = await Categorias.findById(id);
        if (categoria) {
            const todosProductos = await Product.find();
            const newArray = todosProductos.filter((prod) => prod.category !== categoria.name);
            await Product.deleteMany({});
            await Product.insertMany(newArray);
            await categoria.remove();
            return categoria;
        } else {
            throw new Error("categoria no encontrada");
        }
    }

    async updateCategorias(id: string, name: string) {
        const categoria = await Categorias.findById(id);
        if (!categoria) {
            throw new Error("categoria no encontrada");
        }
        const categoriaAntigua = categoria.name;
        categoria.name = name;
        await Product.updateMany(
            { category: categoriaAntigua },
            { $set: { category: name } }
        );
        await categoria.save();
        return categoria;
    }
} 