import { Response, Request, NextFunction } from "express";
import FinalUser from "../models/FinalUsers";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { hashPassword, signToken } from "../auth/AuthService";
const db = "secretTokenScriptEncription";

export interface RequestModified {  
  file?:{
    url?:string
    public_id?:string
    
  }
}

export type RequestPersonalized = Request & RequestModified;

export class FinalUsersController {
  
    // register a new user
  async addFinalUser(req: Request, res: Response) {
    try {
      const {email,password } = req.body;
      const yaexisteusuario = await FinalUser.findOne({
        email: email.trim(),
      });
      if (!email || !password )
        return res
          .status(404)
          .json({ msg: "bad request no email or password" });
      if (yaexisteusuario)
        return res.status(404).json({ msg: "EMAIL_EXISTS" });
        const finalUser = new FinalUser({email,password});
        
        finalUser.password = await hashPassword(password); 
        const finalUserSaved = await finalUser.save();
        const token = signToken(finalUserSaved);
        return res.status(200).json({token});         
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async loginFinalUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const userFound = await FinalUser.findOne({ email: email });
        if (!userFound)
          return res
            .status(404)
            .json({ msg: "EMAIL_NOT_FOUND" });
        const match = await bcrypt.compare(password, userFound.password);
        if (match) {
        const token = signToken(userFound);
        return res.status(200).json({token});
        } else {
          return res.status(404).json({msg:'INVALID_PASSWORD'});
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
      }
  }

  async viewAllUsers(req: Request, res: Response) {
    try {
      const users = await FinalUser.find({});
      res.json(users);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async viewFinalUserbyId(req: Request, res: Response) {
    try {
      const userById = await FinalUser.findById(req.params.id);
      res.json(userById);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async updateFinalUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await FinalUser.findById(req.params.id);
      user.email = email;
      user.password = password;
      await user.save();
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }



  async deleteFinalUser(req: Request, res: Response) {
    try {
      const user = await FinalUser.findById(req.params.id);
      if (!user) {
        return res.status(401).json({ msg: "user not found" });
      }
      // remove user by id
      await user.remove();
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

 

 
}
