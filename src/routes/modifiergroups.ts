import { Router } from 'express';
import { Authenticated } from "../middlewares/authenticated";
import { ModifierGroupController } from "../controllers/ModifierGroupsController";


export class ModifierGroupRoute{

    router:Router;
  public seguridad: Authenticated = new Authenticated();
  public modifierController:ModifierGroupController = new ModifierGroupController();

    constructor(){
        this.router = Router();

    }

    private routes(){
        this.router.post("",this.seguridad.adminAuthenticated,this.modifierController.addModifierGroup);
        this.router.get("",this.modifierController.viewAllModifierGroup);
        this.router.get("/:id",this.modifierController.viewModiferById);
        this.router.put("/:id",this.seguridad.adminAuthenticated,this.modifierController.updateModifierGroup);
        this.router.delete("/:id",this.seguridad.adminAuthenticated, this.modifierController.deleteModifierGroup);
    }

}


const modifierRouter:ModifierGroupRoute = new ModifierGroupRoute();
    export default modifierRouter.router;