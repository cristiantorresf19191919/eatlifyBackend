import { Request, Response, Router, NextFunction } from "express";
import { CajerosController } from "../controllers/CajerosController";
import { Authenticated } from "../middlewares/authenticated";
import { ProductsController } from "../controllers/ProductsController";

class ProductosRoutes {
  private productosController: ProductsController = new ProductsController();
  public seguridad: Authenticated = new Authenticated();
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get("/addons",this.seguridad.adminAuthenticated,this.productosController.getAddonsProducts);
    this.router.post(
      "/",
      this.seguridad.adminAuthenticated,
      this.productosController.agregarProducto
    );
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.seguridad.isadmin,
      this.productosController.eliminarProducto
    );
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.seguridad.isadmin,
      this.productosController.actualizarProducto
    );
    this.router.get("/",this.seguridad.adminAuthenticated,this.productosController.verProducto);
    this.router.get("/:id",this.seguridad.adminAuthenticated,this.productosController.getProductById);
    
  }
}
const productosRoutes: ProductosRoutes = new ProductosRoutes();
export default productosRoutes.router;
