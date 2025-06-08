import { Service } from 'typedi';
import { Response, Request } from "express";
import { DeliveryService } from '../services/deliveryService';
import { IProductos } from '../models/Productos';

export interface RequestModified {  
  file?:{
    url?:string
    public_id?:string
    
  }
}
export type RequestPersonalized = Request & RequestModified;
@Service()
export class DeliveryController {

  constructor(private readonly deliveryService: DeliveryService) { }

  async uploadPic(req: Request, res: Response) {
    try {
      const imageCloud = {
        url: req.file.path,
        id: req.file.filename,
      };
      const product = await this.deliveryService.uploadPic(req.params.productId, imageCloud);
      if (product) return res.status(202).json(product);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send(error.message);
    }
  }

  async verBakery(req: Request, res: Response) {
    try {
      const consulta = await this.deliveryService.verBakery(req.params.category);
      return res.status(202).json(consulta);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("server error");
    }
  }

  async agregarProducto(req: Request, res: Response) {
    try {
      const exito = await this.deliveryService.agregarProducto(req.body as IProductos);
      if (exito) res.status(200).json(exito);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  async eliminarProducto(req: Request, res: Response) {
    try {
      const product = await this.deliveryService.eliminarProducto(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(401).json({ msg: error.message });
    }
  }

  async actualizarProducto(req: Request, res: Response) {
    try {
      const product = await this.deliveryService.actualizarProducto(req.params.id, req.body as IProductos);
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async verProducto(req: Request, res: Response) {
    try {
      const productos = await this.deliveryService.verProducto();
      res.json(productos);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}
