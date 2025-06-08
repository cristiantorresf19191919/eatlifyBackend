import { Service } from 'typedi';
import { IModifierGroup } from '../models/ModifierGroups';
import { Response, Request } from "express";
import { ModifierGroupService } from '../services/modifierGroupService';

@Service()
export class ModifierGroupController {

    constructor(private readonly modifierGroupService: ModifierGroupService) { }

    async addModifierGroup(req: Request, res: Response) {
        try {
            const newModifer = await this.modifierGroupService.addModifierGroup(req.body as IModifierGroup);
            return res.status(202).json(newModifer);
        } catch (error) {
            console.error(error.message);
            res.status(500).send(error.message);
        }
    }
    async viewAllModifierGroup(req: Request, res: Response) {
        try {
            const allModifiers = await this.modifierGroupService.viewAllModifierGroup();
            return res.status(200).json(allModifiers);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    }
    async viewModiferById(req: Request, res: Response) {
        try {
            const modifier = await this.modifierGroupService.viewModiferById(req.params.id);
            return res.status(200).json({ modifier });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
    async updateModifierGroup(req: Request, res: Response) {
        try {
            const modifier = await this.modifierGroupService.updateModifierGroup(req.params.id, req.body as IModifierGroup);
            return res.status(200).json(modifier);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
    async deleteModifierGroup(req: Request, res: Response) {
        try {
            const result = await this.modifierGroupService.deleteModifierGroup(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}