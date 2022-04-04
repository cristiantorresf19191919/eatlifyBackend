import { Router } from "express";
import { CategoriasController } from "../controllers/CategoriasController";
import { FinalUsersController } from "../controllers/FinalUsersController";
import { Authenticated } from '../middlewares/authenticated';

class FinalUserRouter {
  private finalUserController:FinalUsersController = new FinalUsersController();

  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(
      "/",    
      this.finalUserController.addFinalUser
    );
    this.router.post(
        "/login",
        this.finalUserController.loginFinalUser
    );
    this.router.get(
      "/",
      this.finalUserController.viewAllUsers
    );
    this.router.get(
      "/:id",
      this.finalUserController.viewFinalUserbyId
    );
    this.router.delete(
      "/:id",
      this.finalUserController.deleteFinalUser
    );
    this.router.put(
      "/:id",
      this.finalUserController.updateFinalUser
    );
   
  }
}

const finalUserRouter = new FinalUserRouter();
export default finalUserRouter.router;
