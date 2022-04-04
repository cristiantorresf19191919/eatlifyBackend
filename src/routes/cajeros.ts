import { Request, Response, Router, NextFunction } from "express";
import { CajerosController } from "../controllers/CajerosController";
import { Authenticated } from "../middlewares/authenticated";

class CajerosRoutes {
  private cajerosController: CajerosController = new CajerosController();
  public authenticated: Authenticated = new Authenticated();
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post(
      "/registerSuperUser",
      this.cajerosController.RegistrarCajero
    );
    this.router.post("/loginCajero", this.cajerosController.loginCajero); //middleware
    this.router.post(
      "/agregarCajero",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cajerosController.agregarCajero
    );
    this.router.delete(
      "/eliminarCajero/:id",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cajerosController.eliminarCajero
    );
    this.router.put(
      "/actualizarCajero/:id",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cajerosController.actualizarCajero
    );
    this.router.get("/verCajero", this.cajerosController.verCajero);
    this.router.get("/compareEmail", this.cajerosController.compareEmail);
  }
}

const cajerosRoutes = new CajerosRoutes();

export default cajerosRoutes.router;
