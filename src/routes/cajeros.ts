import { Request, Response, Router, NextFunction } from "express";
import { CashiersController } from "../controllers/CashiersController";
import { Authenticated } from "../middlewares/authenticated";

class CashierRoutes {
  private cashierController: CashiersController = new CashiersController();
  public authenticated: Authenticated = new Authenticated();
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post(
      "/registerSuperUser",
      this.cashierController.registerMasterUser
    );
    this.router.post("/loginCajero", this.cashierController.loginCashier); //middleware
    this.router.post(
      "/agregarCajero",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cashierController.addCashier
    );
    this.router.delete(
      "/eliminarCajero/:id",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cashierController.deleteCashier
    );
    this.router.put(
      "/actualizarCajero/:id",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cashierController.updateCashier
    );
    this.router.get("/verCajero", this.cashierController.seeCashier);
    this.router.get("/compareEmail", this.cashierController.compareEmail);
  }
}

const cajerosRoutes = new CashierRoutes();

export default cajerosRoutes.router;
