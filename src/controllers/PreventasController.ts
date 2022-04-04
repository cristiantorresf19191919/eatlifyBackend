import { Response, Request } from "express";
import moment from "moment";
import Preventa from "../models/Preventas";
import { TokenRequest } from "./TokenRequestInterface";
import Mongoose from "mongoose";
type RequestPersonalized = Request & TokenRequest;

export class PreventasController {
  async agregarVenta(req: RequestPersonalized, res: Response) {
    try {
      /*       probarEntrada(req);
              const {name, price, description,category,quantity} = req.body;
              let id = req.body.id || 'no hay id';
              const yaexiste =  await Preventa.findOne({id:id});
              if (yaexiste) return res.status(404).json({msg:'La preventa ya existe'});
              const preventa = new Preventa({name, price, description,category,quantity});  */
      const  {arreglo_ventas}  = req.body;
      //   const frontEnd_array = req.body;
      const dateList = arreglo_ventas.map((obj) => {
        const objeto = {
          name: obj.name,
          description: obj.description,
          image: obj.image,
          price: obj.price,
          category: obj.category,
          quantity: obj.quantity,
          date: null,
          user:new Mongoose.Types.ObjectId(req.user.id)
        };
        objeto.date = moment().format();
        return objeto;
      });
      const preventa = await Preventa.collection.insertMany(dateList);
      res.status(200).json(preventa);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async eliminarVenta(req: RequestPersonalized, res: Response) {
    try {
      const venta = await Preventa.findById(req.params.id);
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

  async actualizarVenta(req: RequestPersonalized, res: Response) {
    try {
      const { name, price, description, category, quantity } = req.body;
      const venta = await Preventa.findById(req.params.id);
      if (!venta)
        return res
          .status(404)
          .json({ msg: "La preventa no se encuentra en la base de datos" });
      venta.name = name;
      venta.price = price;
      venta.description = description;
      venta.category = category;
      venta.quantity = quantity;
      await venta.save();
      res.json(venta);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async verVentas(req: RequestPersonalized, res: Response) {
    try {
      const venta = await Preventa.find({user:req.user.id}).sort({ date: -1 });
      res.json(venta);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async deleteAllSales(req: RequestPersonalized, res: Response) {
    try {
      const exito = await Preventa.deleteMany({user:req.user.id});
      if (exito) console.log("exito");
      console.log(
        "client wanna delete all the sales ********************************"
      );
      return res.status(202).send("ok");
      /*  probarEntrada(req);
              const ventasDeleted = await Preventa.deleteMany();
              if (ventasDeleted) res.json(ventasDeleted);     */
    } catch (error) {
      console.log("erroooooooooooooooooooooooooooooooooooooooooooooooooooooor");
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}
