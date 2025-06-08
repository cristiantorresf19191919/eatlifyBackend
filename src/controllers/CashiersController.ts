import { Service } from 'typedi';
import { Request, Response } from "express";
import { CashierService } from '../services/cashierService';
import { IUser } from '../models/Cajero';

@Service()
export class CashiersController {

  constructor(private readonly cashierService: CashierService) { }

  public async verCajeros(req: Request, res: Response) {
    res.send("Hello Darling");
  }

  public async registerMasterUser(req: Request, res: Response) {
    try {
      const savedUser = await this.cashierService.registerMasterUser(req.body as IUser);
      if (savedUser) {
        return res.status(200).json({
          msg: "super user registered remember to delete controller later"
        });
      }
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }

  public async ResetAdmin(req: Request, res: Response) {
    //todo later
  }

  public async RegisterCashier(req: Request, res: Response) {
    try {
      const token = await this.cashierService.registerCashier(req.body as IUser);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ msg: error.message });
    }
  }

  public async addCashier(req: Request, res: Response) {
    try {
      const exito = await this.cashierService.addCashier(req.body as IUser);
      if (exito) res.status(200).json(exito);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
  public async loginCashier(req: Request, res: Response) {
    try {
      const result = await this.cashierService.loginCashier(req.body as IUser);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  public async updateCashier(req: Request, res: Response) {
    try {
      const cajero = await this.cashierService.updateCashier(req.params.id, req.body as IUser);
      res.json(cajero);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);

    }
  }

  public async seeCashier(req: Request, res: Response) {
    try {
      const cajeros = await this.cashierService.seeCashier();
      res.json(cajeros);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  public async compareEmail(req: Request, res: Response) {
    try {
      const emailQuery = req.query["email"] as string;
      const result = await this.cashierService.compareEmail(emailQuery);
      return res.send(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error);
    }
  }

  public async deleteCashier(req: Request, res: Response) {
    try {
      const cashier = await this.cashierService.deleteCashier(req.params.id);
      res.json(cashier);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}
