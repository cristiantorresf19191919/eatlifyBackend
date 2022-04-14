import { Request, Response } from "express";
import {RestaurantService} from "../services/restaurantService"
import Restaurant, { IRestaurant } from "../models/Restaurantes";
import { TokenRequest } from './TokenRequestInterface';


export interface RequestModified {  
  file?:{
    url?:string
    public_id?:string
    
  }
}
type RequestPersonalized = Request & TokenRequest;

export class RestaurantController {

  private restaurantService: RestaurantService =  new RestaurantService();

  async login(req: RequestPersonalized, res: Response){
    return res.status(200).json(this.restaurantService.login(res,req.body as IRestaurant));
  }   

  async uploadPic(req: RequestPersonalized, res: Response) {
    try {
      console.log('llego el archivo que queria si o no carajo');
      console.log(req.file);
      const imageCloud = {
        url: req.file.path,
        id: req.file.filename,
      };
      /* return updated item {"new":true} */
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.productId,
        { $set: { image: imageCloud } },
        { new: true }
      );
      if (restaurant) return res.status(202).json(restaurant);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send(error.message);
    }
  }



  async getAllRestaurants(req: RequestPersonalized, res: Response) {
    try {
      // iode deusuario autenticado
      let user_id = req.user.id;
      //consulta en la base de datos y devuelve con el mismo id de
      // usuario
      const restaurant = await Restaurant.find({
        
        user: user_id,
      });
      return res.status(202).json(restaurant);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("server error");
    }
  }

  async saveRestaurant(req: RequestPersonalized, res: Response) {
    try {

      let a :IRestaurant;
      let user = req.user.id;
      const { name, address, description, phone } = req.body;
      const ya_existe_restaurante = await Restaurant.findOne({
        name: name,
      });
      if (!name || !phone || !address)
        return res
          .status(404)
          .json({ msg: "te falto llenar todos los campos del restaurante" });
      if (ya_existe_restaurante)
        return res.status(404).json({ msg: "el restaurante ya existe" });
      const restaurante = new Restaurant({ name, address, description, phone, user });
    
      const exito = await restaurante.save();
      if (exito) res.status(200).json(exito);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async deleteRestaurant(req: Request, res: Response) {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(401).json({ msg: "Restaurant not found" });
      }
      // remove product by id
      await restaurant.remove();
      res.json(restaurant);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async updateRestaurant(req: RequestPersonalized, res: Response) {
    try {    
      const { name, address, description, phone } = req.body;
      // el backend recive el id del post
      // lo encuentra
      const restaurant = await Restaurant.findById(req.params.id);
      // actualiza el objeto
      restaurant.name = name;     
      restaurant.description = description;
      restaurant.address = address;
      restaurant.phone = phone;
    
      let response = await restaurant.save();
      res.json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }

  async getRestaurantbyId(req: Request, res: Response) {
    try {
      const restaurantes = await Restaurant.find().sort({ data: -1 });
      res.json(restaurantes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
}
