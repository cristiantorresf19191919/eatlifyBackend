import { Request, Response } from 'express';
import ProductosTest from '../models/ProductosTest';








export class ProductosTestController {

    async agregarProducto(req:Request,res:Response){
        console.log('Header Authorization on add PRODUCTO');
        console.log(req.headers.authorization);
        // to do
        console.log('add product query params');
        console.log(req.query);
        try {
            console.log(req.query);
            const {price,description,title,imageUrl,isFavorite,addonProduct} = req.body;

            let productoExiste = await ProductosTest.find({title});
            if (productoExiste.length > 0){
                return res.status(404).json({msg:'the product already exists in db'}); 
            }
            const nuevoProducto = new ProductosTest({price,description,title,imageUrl,isFavorite});
            if (await nuevoProducto.save()){
                return res.status(200).json({msg:'producto creado correctamente en la base de datos',product:nuevoProducto});
            }
            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'error del servidor', error:error});            
        }
    }


    async verProducto(req:Request,res:Response){
        console.log('Header Authorization on FETCH PRODUCTS');
        console.log(req.headers.authorization);
        // to do
        try {
            console.log(req.query);
            const allProducts = await ProductosTest.find({});
            if (allProducts){
                return res.status(200).json({
                    msg:"los productos se cargaron cone exito",
                    productos:allProducts});
            }
            
            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'error del servidor', error:error});   
            
        }
    }
    async verProductoPorId(req:Request,res:Response){
        // to do
        try {
            const product = await ProductosTest.findById(req.params.id);
            if (product){
                return res.status(200).json({msg:"se encontro el producto con  exito",product});

            } else {
                return res.status(404).json({msg:"el prooducto no se encuentra en la base de datos"});
            }
            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'error del servidor', error:error});   
            
        }
    }


    async actualizarProducto(req:Request,res:Response){
        console.log('Header Authorization on UPDATE PRODUCTS');
        console.log(req.headers.authorization);
        // to do
        try {
            console.log('update product query params');
            console.log(req.query);
            const {price,description,title,imageUrl,isFavorite} = req.body;

            const product = await ProductosTest.findById(req.params.id);
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            product.isFavorite = isFavorite;
            if (await product.save()){
                return res.status(200).json({msg:"producto actualizado con exito",product});

            }

            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'error del servidor', error:error});   
        }
    }


    async eliminarProducto(req:Request,res:Response){
        console.log('Header Authorization on DELETE PRODUCTS');
        console.log(req.headers.authorization);
        console.log('delete product query params');
        console.log(req.query);
        // to do
        try {
            const product = await ProductosTest.findByIdAndRemove(req.params.id);
            if (product){
                return res.status(200).json({msg:"producto eliminado con exito"});

            }
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'error del servidor', error:error});   
            
        }
    }

    async toggleFavorite(req:Request, res:Response){
        try {
            //update all documents to set favorite to false just in case
              /*   const update = await ProductosTest.updateMany({}, { $set: { isFavorite: false } });
            update.save(); */
            //find by id
            
            const product = await ProductosTest.findById(req.params.id);

            //update
            if(product){
                product.isFavorite = req.body.isFavorite;
            }
            //save
            product.save();
            
            res.status(200);
            
        } catch (error) {
            res.status(500).send("error en el servidor");
        }
    }

}

