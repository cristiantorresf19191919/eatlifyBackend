import { Router } from "express";
import { PreventasController } from "../controllers/PreventasController";
import { Authenticated } from "../middlewares/authenticated";

class PreventaRouter {
  private preventasController: PreventasController = new PreventasController();
  private seguridad: Authenticated = new Authenticated();
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get(
      "/",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.preventasController.verVentas
    );
    this.router.post(
      "/",
      this.seguridad.adminAuthenticated,
      this.preventasController.agregarVenta
    );
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.preventasController.eliminarVenta
    );
    this.router.get(
      "/borretodo",
      this.seguridad.superUserAuthenticated,
      this.preventasController.deleteAllSales
    );
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.preventasController.actualizarVenta
    );
  }
}

const preventasRouter = new PreventaRouter();
export default preventasRouter.router;
