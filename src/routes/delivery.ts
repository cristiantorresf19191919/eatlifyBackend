import { Request, Response, Router, NextFunction } from "express";
import { Authenticated } from "../middlewares/authenticated";
import { DeliveryController } from "../controllers/DeliveryController";
import Cloudinary from "cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from "multer";
class DeliveryRouter {
  private deliverController: DeliveryController = new DeliveryController();
  public seguridad: Authenticated = new Authenticated();
  public cloudinary = Cloudinary;
  public parser:any;
  router: Router;
  constructor() {
    this.router = Router();
    this.configCloduinary();
    this.routes();
  }
  configCloduinary() {
    // configurando librerias para subir imagenes    
    this.cloudinary.v2.config({
      cloud_name: "dzkewxe2v",
      api_key: "335177668663129",
      api_secret: "i-8zhI9fU4BYQXo8v95mH2hNjsk",
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
    this.router.get("/:category", this.deliverController.verBakery);
    this.router.post(
      "/uploadPic/:productId",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.parser.single("image"),
      this.deliverController.uploadPic
    );
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.seguridad.isadmin,
      this.deliverController.actualizarProducto
    );
  }
}

const deliveryRoutes: DeliveryRouter = new DeliveryRouter();

export default deliveryRoutes.router;
