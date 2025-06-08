import Container from '../container';
import { Request, Response, Router, NextFunction } from "express";
import { Authenticated } from "../middlewares/authenticated";
import { DeliveryController } from "../controllers/DeliveryController";
import Cloudinary from "cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from "multer";
class DeliveryRouter {
  public seguridad: Authenticated = new Authenticated();
  public cloudinary = Cloudinary;
  public parser:any;
  router: Router;
  constructor(private readonly deliverController: DeliveryController) {
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
      params: (req,file) => ({
        folder:'demo',
        allowed_formats: ['jpg','png'],
        transformation: [{width:500, height:500, crop:'limit'}]
      })
    })
    this.parser = multer({storage});
  }
  routes() {
    this.router.get("/:category", this.deliverController.verBakery.bind(this.deliverController));
    this.router.post(
      "/uploadPic/:productId",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.parser.single("image"),
      this.deliverController.uploadPic.bind(this.deliverController)
    );
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.seguridad.isadmin,
      this.deliverController.actualizarProducto.bind(this.deliverController)
    );
  }
}

const deliveryController = Container.get(DeliveryController);
const deliveryRoutes: DeliveryRouter = new DeliveryRouter(deliveryController);

export default deliveryRoutes.router;
