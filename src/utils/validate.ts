import { IModifierGroup } from "../models/ModifierGroups";

export const  validateModifier = ({name, notes, restaurant, product, rules}:IModifierGroup):boolean => {

    if (!product || !name || !restaurant || !rules){
        return false;
    }
    return true;

}