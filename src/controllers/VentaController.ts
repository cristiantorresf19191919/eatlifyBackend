import Venta from "../models/Ventas";
import Preventa from "../models/Preventas";
import { Request, Response } from "express";
import { TokenRequest } from "./TokenRequestInterface";
type RequestPersonalized = Request & TokenRequest;
export class VentaController {
  async agregarVenta(req: RequestPersonalized, res: Response) {
    try {
      const fullrequest = req.body;
      const { year, month, day, date } = fullrequest;
      const query = await Venta.find({
        date: date,
      });     
      if (query.length > 0) {
        return res.status(404).send("Ya hay un documento con esta fecha");
      }
      const venta = new Venta({...fullrequest,user:req.user.id});
      const exito = await venta.save();
      if (exito) {
        await Preventa.deleteMany({});
        return res.status(200).json(exito);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async verVentaDetallada(req: RequestPersonalized, res: Response) {
    try {
      const venta = await Venta.findById(req.params.id);
      console.log(typeof venta.date);
      console.log(venta.date);
      const today = venta.date;
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      res.status(200).send(date);
    } catch (error) {
      console.log(error);
    }
  }

  async eliminarVenta(req: Request, res: Response) {
    try {
      const venta = await Venta.findById(req.params.id);
      if (!venta) {
        return res.status(401).json({ msg: "venta not Found" });
      }
      // remove venta by id
      await venta.remove();
      res.json(venta);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async actualizarVenta(req: Request, res: Response) {
    try {
      const { cajero, totalventa, productos } = req.body;
      const venta = await Venta.findById(req.params.id);
      if (!venta)
        return res
          .status(404)
          .json({ msg: "El cajero no se encuentra en la base de datos" });
      venta.cajero = cajero;
      venta.totalventa = totalventa;
      venta.productos = productos;
      await venta.save();
      res.json(venta);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async verVentas(req: RequestPersonalized, res: Response) {
    try {
      const venta = await Venta.find({user:req.user.id}).sort({ date: -1 });
      res.json(venta);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  /* const deleteAllSales = async(req,res)=>{
          try {
             console.log('borre todo');
      
          } catch (error) {
              console.log('erroooooooooooooooooooooooooooooooooooooooooooooooooooooor');
              console.error(error.message);
              res.status(500).send('server error');
          }
      } */
 

  async eliminarInformesVentas(req: RequestPersonalized, res: Response) {
    try {
      console.log("boom");
      const exito = await Venta.deleteMany({user:req.user.id});
      if (exito)
        res
          .status(202)
          .send("se han borrado todos los documentos de la coleccion");
    } catch (error) {
      console.log("error verraco");
      console.log(error);
      res.status(500).send("error en el servidor");
    }
  }
}
