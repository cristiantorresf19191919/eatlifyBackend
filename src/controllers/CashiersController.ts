import { Request, Response } from "express";
import Cajero from "../models/Cajero";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as config from "config";

function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export class CashiersController {

  public async verCajeros(req: Request, res: Response) {
    res.send("Hello Darling");
  }

  //???
  public async registerMasterUser(req:Request, res:Response){
    const {password, name, email} = req.body;
    if (!password || !name || !email) return res.status(400).json({msg:"All fields are required"});
    const existingSuperUser = await Cajero.findOne({ email });
    if (existingSuperUser) {
      return res.status(400).json({ msg: "A super user already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed =  await bcrypt.hash(password, salt);
    const cashier = new Cajero({ name:'admin', email:'admin', admin:true, superuser:true, password:hashed });
    const cajerosaved = await cashier.save();
    if (cajerosaved) {
      return res.status(200).json({
        msg:"super user registered remember to delete controller later"
      });
    }
  }

  public async ResetAdmin(req:Request, res:Response){
    //todo later
  }

  public async RegisterCashier(req: Request, res: Response) {
    const {name, email, password, admin, superuser} = req.body;
    try {
      if (!name || !email || !password || !admin || !superuser) {
        return res.status(400).json({ msg: "All fields are required" });
      }
      const cashier = new Cajero({ name, email, admin, superuser, password });
      const salt = await bcrypt.genSalt(10);
      cashier.password = await bcrypt.hash(password, salt);
      const cajerosaved = await cashier.save();
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
        const secret = process.env.SECRET;//openssl rand -base64 64
        jwt.sign(payload, secret, jwtoptions, (err, token) => {
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

  public async addCashier(req: Request, res: Response) {
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
  public async loginCashier(req: Request, res: Response) {
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
        const user = {id: cajero.id,
          name: cajero.name,
          admin: cajero.admin,
          superuser: cajero.superuser,}
        const payload = { user };
        const jwtoptions = {
          expiresIn: minutesToSeconds(120), // 2 hours
        };
        const secret = process.env.SECRET;
        jwt.sign(payload, secret, jwtoptions, (err, token) => {
          if (err) throw err;
          return res.status(200).json({
            token,
            usuarioenviar: user,
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

  public async updateCashier(req: Request, res: Response) {
    try {
      const { name, email, admin, superuser, password } = req.body;
      const cajero = await Cajero.findById(req.params.id);
      if (!cajero)
        return res
          .status(404)
          .json({ msg: "Cashier not found on DB" });
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

  public async seeCashier(req: Request, res: Response) {
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

  public async deleteCashier(req: Request, res: Response) {
    try {

      const cashier = await Cajero.findById(req.params.id);
      if (!cashier) {
        return res.status(401).json({ msg: "Cashier not Found" });
      }
      // remove Cajero by id
      await cashier.remove();
      res.json(cashier);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}
