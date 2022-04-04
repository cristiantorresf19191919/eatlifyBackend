import { Response, NextFunction, Request } from 'express';
import Product, { IProductos } from "../models/Productos";
import { TokenRequest } from './TokenRequestInterface';

type RequestPersonalized = Request & TokenRequest;

export class ProductsController {
  
    async agregarProducto (req:RequestPersonalized, res:Response){
        try {
          console.log(req.user);
          req.user;
          const {name, price, description, category,addonProduct,restaurant} = req.body;
          let topProduct = false;
          if (req.body.topProduct){
            topProduct = req.body.topProduct;
          }          
          const yaexisteproducto = await Product.findOne({            
            name:name,user:req.user.id
          });

          if (!price || !description || !category) return res.status(404).json({msg: 'te falto llenar todos los campos del producto'});
          if (yaexisteproducto) return res.status(404).json({msg: 'el producto ya existe'});
          const product = new Product({name, price, description, category,topProduct,user:req.user.id,addonProduct,restaurant});
          const exito = await product.save();
          if (exito) res.status(200).json(exito);
        } catch (error) {
          console.error(error.message);
          res.status(500).json(error);

        }
      }
      
    async eliminarProducto(req:Request, res:Response){
        try {
        
          const product = await Product.findById(req.params.id);
          if (!product) {
            return res.status(401).json({msg: 'Product not found'});
          }
          // remove product by id
          await product.remove();
          res.json(product);
        } catch (error) {
          console.error(error.message);
          res.status(500).json(error);

        }
      };
      
    async actualizarProducto (req:Request, res:Response){
        try {
       
          const product = await Product.findById(req.params.id);
          let topProduct = false;
          const {name, price, description, category} = req.body;
          if (req.body.topProduct){
            topProduct = req.body.topProduct;
          }
          
          product.name = name;
          product.price = price;
          product.description = description;
          product.category = category;
          product.topProduct = topProduct;
          await product.save();
          res.json(product);
        } catch (error) {
          console.log('***********************');
          console.log('***********************');
          console.log('***********************');
          console.error(error.message);
          console.log('***********************');
          console.log('***********************');
          console.log('***********************');
          res.status(500).json(error);

        }
      };
      
    async verProducto (req:RequestPersonalized, res:Response){
        try {
          console.log('ver productos');
          console.log('token decodificado');
          console.log(req.user);
          const productos = await Product.find({user:req.user.id}).sort({data: -1});
          res.json(productos);
        } catch (error) {
          console.error(error.message);
          res.status(500).json(error);

        }
      };

      async getProductById (req:RequestPersonalized, res:Response){
        try{
          const product = await Product.findById(req.params.id);
          res.status(200).json(product);
        }
        catch(error){
          res.status(500).send("error server");
        }
      }

      
      async getAddonsProducts (req:RequestPersonalized, res:Response){
        try{
          const products = await Product.find({addonProduct:true});
          res.status(200).json(products);
        }
        catch(error){
          res.status(500).send("error server");
        }
      }


      

}


