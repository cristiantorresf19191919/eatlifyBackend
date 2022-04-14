import { Request, Response, Router, NextFunction } from "express";
import RestaurantDb, { IRestaurant } from "../models/Restaurantes";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as config from "config";
import { CommonServices } from "./commonService";
const db = "secretTokenScriptEncription";

export class RestaurantService extends CommonServices {
  async login(res: Response, restaurantBody: IRestaurant) {
    try {
      const { email, password } = restaurantBody;
      const restaurant = await RestaurantDb.findOne({ email }).exec();
      if (!restaurant) return this.handleCustomException(res,400,"badReq");
      const match = await bcrypt.compare(password, restaurant.password);
      if (!match) return this.handleCustomException(res,404,"invalidPass")
      const token = await this.handleJWT(restaurant);
      if (token) return token;
      return ""
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}
