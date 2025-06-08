import Container from '../container';
import { Router } from 'express';
import { Authenticated } from "../middlewares/authenticated";
import { ModifierGroupController } from "../controllers/ModifierGroupsController";


export class ModifierGroupRoute {

    router: Router;
    public seguridad: Authenticated = new Authenticated();

    constructor(private readonly modifierController: ModifierGroupController) {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post("", this.seguridad.adminAuthenticated, this.modifierController.addModifierGroup.bind(this.modifierController));
        this.router.get("", this.modifierController.viewAllModifierGroup.bind(this.modifierController));
        this.router.get("/:id", this.modifierController.viewModiferById.bind(this.modifierController));
        this.router.put("/:id", this.seguridad.adminAuthenticated, this.modifierController.updateModifierGroup.bind(this.modifierController));
        this.router.delete("/:id", this.seguridad.adminAuthenticated, this.modifierController.deleteModifierGroup.bind(this.modifierController));
    }

}


const modifierController = Container.get(ModifierGroupController);
const modifierRouter: ModifierGroupRoute = new ModifierGroupRoute(modifierController);
export default modifierRouter.router;