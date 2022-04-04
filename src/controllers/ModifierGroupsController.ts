import { RequestPersonalized } from './DeliveryController';
import ModifierGroupORM from "../models/ModifierGroups";
import { IModifierGroup } from '../models/ModifierGroups';
import ModiferGr from "../models/ModifierGroups";
import { Response, Request, NextFunction } from "express";
import { validateModifier } from '../utils/validate';

// crud

export class ModifierGroupController {

    async addModifierGroup(req:RequestPersonalized, res:Response){
       
        try {
            const frontEndBody = req.body as IModifierGroup;
            const {name, notes, restaurant, product, rules } = frontEndBody;  
            //find product if it already exist

            const modifier = await ModiferGr.findOne({name});
             if (modifier){
                 return res.status(404).json({msg:"the modifier is duplicated please check again"});
             }

             if(!validateModifier(frontEndBody)){
                return res.status(404).json({msg:"Complete all the fields"});

             }

          

             const newModifer =  new ModiferGr({name,notes,restaurant,product,rules});
             await newModifer.save();
             return res.status(202).json(newModifer);


          } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
          }  


    }
    async viewAllModifierGroup(req:RequestPersonalized, res:Response){
        try {
            const allModifiers = await ModiferGr.find({});
        if (!allModifiers){
            return res.status(404).json({msg:"error with the transaction"});
        }
        return res.status(200).json(allModifiers);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    }
    async viewModiferById(req:RequestPersonalized, res:Response){

        try {

               // find by id 
        const modifier = await ModiferGr.findById(req.params.id);

        // send

        if (!modifier){
            return res.status(404).json({msg:"modifier not found"});
        }
        return res.status(200).json({modifier});    
            
        } catch (error) {

            return res.status(500).json({msg:"server errror"});
            
        }
     

    }
    async updateModifierGroup(req:RequestPersonalized, res:Response){

        try {

               // find by id 
        const modifier = await ModiferGr.findById(req.params.id);


        // get frontend body
        const frontEndBody = req.body as IModifierGroup;
        const {name, notes, restaurant, product, rules } = frontEndBody; 
        

        //validate
        if (validateModifier(frontEndBody)){
            return res.status(404).json({msg:"Complete all the fields"});

        }
        // save
        modifier.name = name;
        if (notes){
            modifier.notes = notes;
        }
        modifier.product = product;
        modifier.restaurant = restaurant;
        modifier.rules = rules;

        await modifier.save();


        // send

        return res.status(200).json(modifier);
            
        } catch (error) {

            return res.status(500).json({msg:"server errror"});
            
        }
     

    }
    async deleteModifierGroup(req:RequestPersonalized, res:Response){

      try {
            // find by id

            const modifier = await ModiferGr.findById(req.params.id);

        // delete

        await modifier.remove();

        res.status(200).json({msg:"deleted succesfully"});

      } catch (error) {
        return res.status(500).json({msg:"server errror"});
          
      }
    }




}