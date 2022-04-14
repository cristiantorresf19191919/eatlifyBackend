import { Request, Response } from "express";
import Cajero from "../models/Cajero";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as config from "config";
import { RestaurantService } from "src/services/restaurant.service";
const db = "secretTokenScriptEncription";

export class CajerosController {
 
  public async verCajeros(req: Request, res: Response) {
    res.send("hola pedejo");
  }

  //???
  public async RegisterMasterUser(req:Request, res:Response){
    const {password, name, email} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed =  await bcrypt.hash(password, salt);
    const cajero = new Cajero({ name:'admin', email:'admin', admin:true, superuser:true, password:hashed });
    const cajerosaved = await cajero.save();
    if (cajerosaved) {
      return res.status(200).json({
        msg:"super user registered remember to delete controller later"
      });
    }
  }

  public async ResetAdmin(req:Request, res:Response){
    //todo later
  }

  public async RegistrarCajero(req: Request, res: Response) {
    // probarEntrada(req);
    const {name, email, password, admin, superuser} = req.body;
    try {
      const cajero = new Cajero({ name, email, admin, superuser, password });
      const salt = await bcrypt.genSalt(10);
      cajero.password = await bcrypt.hash(password, salt);
      const cajerosaved = await cajero.save();
      if (cajerosaved) {
        const payload = {
          user: {
            id: cajerosaved.id,
            name: cajerosaved.name,
            admin: cajerosaved.admin,
            superuser: cajerosaved.superuser,
          },
        };
        const jwtoptions = {
          expiresIn: 108000,
        };
        jwt.sign(payload, db, jwtoptions, (err, token) => {
          if (err) throw err;
          return res.status(200).json({
            token,
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async agregarCajero(req: Request, res: Response) {
    try {
      const { name, email, admin, superuser, password } = req.body;
      const yaexiste = await Cajero.findOne({ email });
      if (yaexiste) return res.status(404).json({ msg: "El Cajero ya existe" });
      const cajero = new Cajero({ name, email, admin, superuser, password });
      const saltos = await bcrypt.genSalt(10);
      cajero.password = await bcrypt.hash(password, saltos);
      const exito = await cajero.save();
      if (exito) res.status(200).json(exito);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
  public async loginCajero(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("🚀 ~ file: CajerosController.ts ~ line 67 ~ CajerosController ~ loginCajero ~ email", email)
      
      const cajero = await Cajero.findOne({ email });

      if (!cajero)
        return res
          .status(404)
          .json({ msg: "usuario no se encuentra en la base de datos" });
      const match = await bcrypt.compare(password, cajero.password);
      if (true) { // solo para probar toca crear un super usuario
        const payload = {
          user: {
            id: cajero.id,
            name: cajero.name,
            admin: cajero.admin,
            superuser: cajero.superuser,
          },
        };
        const usuarioenviar = payload.user;
        const jwtoptions = {
          expiresIn: 240, 
        };
        jwt.sign(payload, db, jwtoptions, (err, token) => {
          if (err) throw err;
          return res.status(200).json({
            token,
            usuarioenviar,
          });
        });
      } else {
        return res.status(404).send("Password Invalid");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  public async actualizarCajero(req: Request, res: Response) {
    try {
      const { name, email, admin, superuser, password } = req.body;
      const cajero = await Cajero.findById(req.params.id);
      if (!cajero)
        return res
          .status(404)
          .json({ msg: "El cajero no se encuentra en la base de datos" });
      cajero.name = name;
      cajero.email = email;
      cajero.admin = admin;
      cajero.superuser = superuser;
      const saltos = await bcrypt.genSalt(10);
      
      cajero.password = await bcrypt.hash(password, saltos);
      await cajero.save();
      res.json(cajero);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    
    }
  }

  public async verCajero(req: Request, res: Response) {
    try {
      const cajeros = await Cajero.find()
        .select("-password")
        .sort({ date: -1 });
      res.json(cajeros);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  public async compareEmail(req: Request, res: Response) {
    try {
      const emailQuery = req.query["email"] as string;
      const query = await Cajero.findOne({ email: emailQuery });
      if (query) return res.send(true);
      return res.send(false);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }

  public async eliminarCajero(req: Request, res: Response) {
    try {
     
      const cajero = await Cajero.findById(req.params.id);
      if (!cajero) {
        return res.status(401).json({ msg: "Cajero not Found" });
      }
      // remove Cajero by id
      await cajero.remove();
      res.json(cajero);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}



// // keyof
// interface PizzaMenu {
//   starter: string;
//   pizza: string;
//   drink : string;
//   dessert: string;
// }

// const margaritaMenu: PizzaMenu = {
//   starter: "Salad",
//   pizza: "Margarita",
//   drink: "Coke",
//   dessert: "Vanilla ice cream"
// }
// function changeMenu (
//   menu:PizzaMenu,
//   menuEntry: keyof PizzaMenu, // 'starter' | 'pizza' | 'drink' | 'dessert'
//   change: string
// ) {
//   menu[menuEntry] = change;
// }