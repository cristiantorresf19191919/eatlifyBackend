import { Service } from 'typedi';
import { Response, Request } from "express";
import { CategoriasService } from '../services/categoriasService';

@Service()
export class CategoriasController {

  constructor(private readonly categoriasService: CategoriasService) { }

  async getCategorias(req: Request, res: Response) {
    try {
      const allCats = await this.categoriasService.getCategorias(req.user.id);
      if (allCats) {
        return res.json(allCats).status(200);
      }
    } catch (error) {
      return res.status(500).send("error del servidor");
    }
  }

  async postCategorias(req: Request, res: Response) {
    let { name, taxable } = req.body;
    try {
      const newCategoria = await this.categoriasService.postCategorias(name, taxable, req.user.id);
      return res.status(200).json(newCategoria);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  };

  async deleteCategorias(req: Request, res: Response) {
    try {
      const categoria = await this.categoriasService.deleteCategorias(req.params.id);
      return res.status(200).json(categoria);
    } catch (error) {
      return res.status(404).send(error.message);
    }
  };

  async UpdateCategorias(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const categoria = await this.categoriasService.updateCategorias(req.params.id, name);
      return res.status(200).json(categoria);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };
}

