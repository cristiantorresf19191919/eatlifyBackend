import Categorias from "../models/Categorias";
import Product from "../models/Productos";
import { Response, Request } from "express";
import { TokenRequest } from "./TokenRequestInterface";
type RequestPersonalized = Request & TokenRequest;
export class CategoriasController {

  
  

  async getCategorias(req: RequestPersonalized, res: Response) {
    try {
      const allCats = await Categorias.find({user:req.user.id});
      console.log(allCats);
      if (allCats) {
        return res.json(allCats).status(200);
      }
    } catch (error) {
      return res.status(500).send("error del servidor");
    }
  }

    async postCategorias(req: RequestPersonalized, res: Response) {
    let { name, taxable } = req.body;
    if (!taxable) taxable = false;
    try {
      const categoria = await Categorias.findOne({ name: name, user:req.user.id});
      if (categoria) {
        return res.status(400).send("La categoria ya existe");
      }
      console.log(taxable);
      const newCategoria = await new Categorias({ name, taxable, user:req.user.id });
      newCategoria.save();
      return res.status(200).json(newCategoria);
    } catch (error) {
      return res.status(500).send("error del servidor");
    }
  };

    async deleteCategorias(req: RequestPersonalized, res: Response) {
    try {
      // .save se utiliza cuando se cambia una propiedad dentro de la coleccion
      const categoria = await Categorias.findById(req.params.id);
      if (categoria) {
        const todosProductos = await Product.find();
        // todos los productos diferentes a la categoria que se va a borrar
        const newArray = todosProductos.filter((prod) => {
          return prod.category !== categoria.name;
        });
        await Product.deleteMany({});
        // insertar un arreglo a una collecion
        await Product.insertMany(newArray);
        await categoria.remove();
        return res.status(200).json(categoria);
      } else {
        return res.status(404).send("categoria no encontrada");
      }
    } catch (error) {
      return res.status(500).send("error del servidor");
    }
  };

   async UpdateCategorias(req: RequestPersonalized, res: Response) {
    try {
      // el ide de la categoria en req.params.id
      // encuentra la categoria para actualizar
      const categoria = await Categorias.findById(req.params.id);
      // todos los productos que contienen esa categoria
      const productos = await Product.find({ category: categoria.name });
      const categoriaAntigua = categoria.name;
      // nuevo nombre que se le va a dar a la categoria.
      const { name } = req.body;
      categoria.name = name;
      // cambiar la categoria de los productos a la nueva categoria
      const actualizadosProductos = productos.map((prod) => {
        return { ...prod, category: categoria.name };
      });
      await Product.updateMany(
        { category: categoriaAntigua },
        { $set: { category: name } }
      );

      // save solo se usa cuando se actualiza una de sus propiedades del objeto schema
      await categoria.save();
      return res.status(200).json(categoria);
    } catch (error) {
      return res.status(500).send("error del servidor");
    }
  };
}
