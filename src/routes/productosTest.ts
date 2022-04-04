import { ProductosTestController } from '../controllers/ProductosTesController';
import { Router } from 'express';

class ProductosTestRoutes {
    private productoTestController:ProductosTestController = new ProductosTestController;
    router:Router;

    constructor(){
        this.router = Router();
        this.routes();

    }

    routes(){
        this.router.post("/",this.productoTestController.agregarProducto);
        this.router.get("/",this.productoTestController.verProducto);
        this.router.get("/:id",this.productoTestController.verProductoPorId);
        this.router.put("/:id",this.productoTestController.actualizarProducto);
        this.router.delete("/:id",this.productoTestController.eliminarProducto);
        this.router.patch("/:id",this.productoTestController.toggleFavorite);
    }

}

const productosTestRouter:ProductosTestRoutes = new ProductosTestRoutes();
    export default productosTestRouter.router;