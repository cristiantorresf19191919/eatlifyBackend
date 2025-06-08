import { Service } from 'typedi';
import Product, { IProductos } from '../models/Productos';

interface IImageCloud {
    url: string;
    id: string;
}

@Service()
export class DeliveryService {
    async uploadPic(productId: string, imageCloud: IImageCloud) {
        return await Product.findByIdAndUpdate(
            productId,
            { $set: { image: imageCloud } },
            { new: true }
        );
    }

    async verBakery(category: string) {
        return await Product.find({ category: category });
    }

    async agregarProducto(productData: IProductos) {
        const { name, price, description, category } = productData;
        if (!price || !description || !category)
            throw new Error("te falto llenar todos los campos del producto");
        const yaexisteproducto = await Product.findOne({ name: name });
        if (yaexisteproducto)
            throw new Error("el producto ya existe");
        const product = new Product({ name, price, description, category });
        return await product.save();
    }

    async eliminarProducto(id: string) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        await product.remove();
        return product;
    }

    async actualizarProducto(id: string, productData: IProductos) {
        const { name, price, description, category } = productData;
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        product.name = name;
        product.price = price;
        product.description = description;
        product.category = category;
        return await product.save();
    }

    async verProducto() {
        return await Product.find().sort({ data: -1 });
    }
} 