import Container from '../container';
import { Router } from "express";
import { CategoriasController } from "../controllers/CategoriasController";
import { Authenticated } from '../middlewares/authenticated';

class CategoriaRouter {
  private seguridad:Authenticated = new Authenticated();
  router: Router;
  constructor(private readonly categoriasController: CategoriasController) {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get(
      "/",
      this.seguridad.adminAuthenticated,
      this.categoriasController.getCategorias.bind(this.categoriasController)
    );
    this.router.post(
      "/",
      this.seguridad.adminAuthenticated,
      this.categoriasController.postCategorias.bind(this.categoriasController)
    );
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.categoriasController.deleteCategorias.bind(this.categoriasController)
    );
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.categoriasController.UpdateCategorias.bind(this.categoriasController)
    );
  }
}

const categoriasController = Container.get(CategoriasController);
const categoriasRouter = new CategoriaRouter(categoriasController);
export default categoriasRouter.router;
