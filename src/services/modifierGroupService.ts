import { Service } from 'typedi';
import ModifierGroupORM, { IModifierGroup } from "../models/ModifierGroups";

@Service()
export class ModifierGroupService {

    private validateModifier(modifier: IModifierGroup): boolean {
        const { name, product, restaurant, rules } = modifier;
        if (!product || !name || !restaurant || !rules) {
            return false;
        }
        return true;
    }

    async addModifierGroup(modifierData: IModifierGroup) {
        const { name, notes, restaurant, product, rules } = modifierData;
        const modifier = await ModifierGroupORM.findOne({ name });
        if (modifier) {
            throw new Error("the modifier is duplicated please check again");
        }
        if (!this.validateModifier(modifierData)) {
            throw new Error("Complete all the fields");
        }
        const newModifer = new ModifierGroupORM({ name, notes, restaurant, product, rules });
        return await newModifer.save();
    }

    async viewAllModifierGroup() {
        return await ModifierGroupORM.find({});
    }

    async viewModiferById(id: string) {
        const modifier = await ModifierGroupORM.findById(id);
        if (!modifier) {
            throw new Error("modifier not found");
        }
        return modifier;
    }

    async updateModifierGroup(id: string, modifierData: IModifierGroup) {
        const modifier = await ModifierGroupORM.findById(id);
        if (!modifier) {
            throw new Error("modifier not found");
        }
        const { name, notes, restaurant, product, rules } = modifierData;
        if (!this.validateModifier(modifierData)) {
            throw new Error("Complete all the fields");
        }
        modifier.name = name;
        if (notes) {
            modifier.notes = notes;
        }
        modifier.product = product;
        modifier.restaurant = restaurant;
        modifier.rules = rules;
        return await modifier.save();
    }

    async deleteModifierGroup(id: string) {
        const modifier = await ModifierGroupORM.findById(id);
        if (!modifier) {
            throw new Error("modifier not found");
        }
        await modifier.remove();
        return { msg: "deleted succesfully" };
    }
} 