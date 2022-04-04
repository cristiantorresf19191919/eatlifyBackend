import { Router } from "express";
import { VentaController } from "../controllers/VentaController";
import { Authenticated } from '../middlewares/authenticated';
class VentasRouter {
  router: Router;
  private ventasController: VentaController;
  private seguridad: Authenticated;
  constructor() {
    this.router = Router();
    this.ventasController = new VentaController();
    this.seguridad = new Authenticated();
    this.routes();
  }

  routes() {
    this.router.get(
      "/eliminarInformesVentas",
      this.seguridad.superUserAuthenticated,
      this.ventasController.eliminarInformesVentas
    );
    this.router.get("/", this.seguridad.adminAuthenticated,this.ventasController.verVentas);
    this.router.post(
      "/",
      this.seguridad.adminAuthenticated,
      this.ventasController.agregarVenta
    );
    this.router.put(
      "/:id",
      this.seguridad.superUserAuthenticated,
      this.ventasController.actualizarVenta
    );
  }
}

const ventarRouter = new VentasRouter();
export default ventarRouter.router;
