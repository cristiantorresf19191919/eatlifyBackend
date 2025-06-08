import Container from '../container';
import { Request, Response, Router, NextFunction } from "express";
import { CashiersController } from "../controllers/CashiersController";
import { Authenticated } from "../middlewares/authenticated";

class CashierRoutes {
  public authenticated: Authenticated = new Authenticated();
  router: Router;

  constructor(private readonly cashierController: CashiersController) {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.post(
      "/registerSuperUser",
      this.cashierController.registerMasterUser.bind(this.cashierController)
    );
    this.router.post("/loginCajero", this.cashierController.loginCashier.bind(this.cashierController));
    this.router.post(
      "/agregarCajero",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cashierController.addCashier.bind(this.cashierController)
    );
    this.router.delete(
      "/eliminarCajero/:id",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cashierController.deleteCashier.bind(this.cashierController)
    );
    this.router.put(
      "/actualizarCajero/:id",
      this.authenticated.adminAuthenticated,
      this.authenticated.superUserAuthenticated,
      this.cashierController.updateCashier.bind(this.cashierController)
    );
    this.router.get("/verCajero", this.cashierController.seeCashier.bind(this.cashierController));
    this.router.get("/compareEmail", this.cashierController.compareEmail.bind(this.cashierController));
  }
}

const cashierController = Container.get(CashiersController);
const cajerosRoutes = new CashierRoutes(cashierController);

export default cajerosRoutes.router;
