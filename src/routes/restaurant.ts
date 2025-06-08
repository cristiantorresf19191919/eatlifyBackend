import { Request, Response, Router, NextFunction } from "express";
import { CashiersController } from "../controllers/CashiersController";
import { Authenticated } from "../middlewares/authenticated";
import { RestaurantController } from '../controllers/RestaurantController';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import Cloudinary from "cloudinary";
import multer from "multer";


class RestaurantRoute {
  private restaurantController: RestaurantController = new RestaurantController();
  public seguridad: Authenticated = new Authenticated();
  router: Router;
  public parser:any;

  public cloudinary = Cloudinary;
  constructor() {
    this.router = Router();
    this.configCloduinary();
    this.routes();
  }
  configCloduinary() {

    this.cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const storage = new CloudinaryStorage({
      cloudinary: this.cloudinary.v2,
      params:(req,file) => ({
        folder:'demo',
        allowed_formats: ['jpg','png'],
        transformation: [{width:500, height:500, crop:'limit'}]
      })
    })
    this.parser = multer({storage});
  }

  routes() {
    this.router.post(
      "/",
      this.seguridad.adminAuthenticated,
      this.restaurantController.saveRestaurant
    );
    this.router.post(
      "/login",
      this.restaurantController.login
    );
    this.router.post(
      "/uploadPic/:productId",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.parser.single("image"),
      this.restaurantController.uploadPic
    );
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.restaurantController.deleteRestaurant
    );
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.seguridad.isadmin,
      this.restaurantController.updateRestaurant
    );
    this.router.get(
        "/",
        this.seguridad.adminAuthenticated,
        this.restaurantController.getAllRestaurants);
  }
}
const restaurantRoute: RestaurantRoute = new RestaurantRoute();
export default restaurantRoute.router;
