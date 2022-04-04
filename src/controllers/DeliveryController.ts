import { Response, Request, NextFunction } from "express";
import Product from "../models/Productos";

export interface RequestModified {  
  file?:{
    url?:string
    public_id?:string
    
  }
}
export type RequestPersonalized = Request & RequestModified;
export class DeliveryController {
  async uploadPic(req: RequestPersonalized, res: Response) {
    console.log('upload pic');
    console.log(req.file);
    try {
      console.log('llego el archivo que queria si o no carajo');
      console.log(req.file);
      const imageCloud = {
        url: req.file.path,
        id: req.file.filename,
      };
      /* return updated item {"new":true} */
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        { $set: { image: imageCloud } },
        { new: true }
      );
      if (product) return res.status(202).json(product);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send(error.message);
    }
  }

  async verBakery(req: Request, res: Response) {
    try {
      const consulta = await Product.find({
        category: req.params.category,
      });
      return res.status(202).json(consulta);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("server error");
    }
  }

  async agregarProducto(req: Request, res: Response) {
    try {
      const { name, price, description, category } = req.body;
      const yaexisteproducto = await Product.findOne({
        name: name,
      });
      if (!price || !description || !category)
        return res
          .status(404)
          .json({ msg: "te falto llenar todos los campos del producto" });
      if (yaexisteproducto)
        return res.status(404).json({ msg: "el producto ya existe" });
      const product = new Product({ name, price, description, category });
      const exito = await product.save();
      if (exito) res.status(200).json(exito);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async eliminarProducto(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(401).json({ msg: "Product not found" });
      }
      // remove product by id
      await product.remove();
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async actualizarProducto(req: Request, res: Response) {
    try {
      const { name, price, description, category } = req.body;
      const product = await Product.findById(req.params.id);
      product.name = name;
      product.price = price;
      product.description = description;
      product.category = category;
      await product.save();
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async verProducto(req: Request, res: Response) {
    try {
      const productos = await Product.find().sort({ data: -1 });
      res.json(productos);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}
