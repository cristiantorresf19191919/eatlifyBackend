import { Router } from "express";
import { CategoriasController } from "../controllers/CategoriasController";
import { Authenticated } from '../middlewares/authenticated';

class CategoriaRouter {
  private categoriasController:CategoriasController = new CategoriasController();
  private seguridad:Authenticated = new Authenticated();
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get(
      "/",
      this.seguridad.adminAuthenticated,
      this.categoriasController.getCategorias
    );
    this.router.post(
      "/",
      this.seguridad.adminAuthenticated,
      this.categoriasController.postCategorias
    );
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.categoriasController.deleteCategorias
    );
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.categoriasController.UpdateCategorias
    );
  }
}

const categoriasRouter = new CategoriaRouter();
export default categoriasRouter.router;
