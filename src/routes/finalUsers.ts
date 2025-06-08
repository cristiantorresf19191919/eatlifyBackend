import Container from '../container';
import { Router } from "express";
import { FinalUsersController } from "../controllers/FinalUsersController";

class FinalUserRouter {
  router: Router;
  constructor(private readonly finalUserController: FinalUsersController) {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(
      "/",
      this.finalUserController.addFinalUser.bind(this.finalUserController)
    );
    this.router.post(
      "/login",
      this.finalUserController.loginFinalUser.bind(this.finalUserController)
    );
    this.router.get(
      "/",
      this.finalUserController.viewAllUsers.bind(this.finalUserController)
    );
    this.router.get(
      "/:id",
      this.finalUserController.viewFinalUserbyId.bind(this.finalUserController)
    );
    this.router.delete(
      "/:id",
      this.finalUserController.deleteFinalUser.bind(this.finalUserController)
    );
    this.router.put(
      "/:id",
      this.finalUserController.updateFinalUser.bind(this.finalUserController)
    );

  }
}

const finalUserController = Container.get(FinalUsersController);
const finalUserRouter = new FinalUserRouter(finalUserController);
export default finalUserRouter.router;
