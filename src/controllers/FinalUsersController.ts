import { Service } from 'typedi';
import { Response, Request } from "express";
import { FinalUsersService } from '../services/finalUsersService';
import { IFinalUsers } from '../models/FinalUsers';

@Service()
export class FinalUsersController {

    constructor(private readonly finalUsersService: FinalUsersService) { }

    async addFinalUser(req: Request, res: Response) {
        try {
            const token = await this.finalUsersService.addFinalUser(req.body as IFinalUsers);
            return res.status(200).json({ token });
        } catch (error) {
            console.error(error.message);
            res.status(500).send(error.message);
        }
    }

    async loginFinalUser(req: Request, res: Response) {
        try {
            const token = await this.finalUsersService.loginFinalUser(req.body as IFinalUsers);
            return res.status(200).json({ token });
        } catch (error) {
            console.error(error.message);
            res.status(404).json({ msg: error.message });
        }
    }

    async viewAllUsers(req: Request, res: Response) {
        try {
            const users = await this.finalUsersService.viewAllUsers();
            res.json(users);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    }

    async viewFinalUserbyId(req: Request, res: Response) {
        try {
            const userById = await this.finalUsersService.viewFinalUserbyId(req.params.id);
            res.json(userById);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    }

    async updateFinalUser(req: Request, res: Response) {
        try {
            const user = await this.finalUsersService.updateFinalUser(req.params.id, req.body as IFinalUsers);
            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    }

    async deleteFinalUser(req: Request, res: Response) {
        try {
            const user = await this.finalUsersService.deleteFinalUser(req.params.id);
            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    }
}
