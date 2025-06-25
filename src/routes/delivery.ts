import Container from '../container';
import { Request, Response, Router, NextFunction } from "express";
import { Authenticated } from "../middlewares/authenticated";
import { DeliveryController } from "../controllers/DeliveryController";
import Cloudinary from "cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from "multer";

/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryProduct:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *           example: "Fresh Bread"
 *         price:
 *           type: number
 *           description: Product price
 *           example: 3.99
 *         category:
 *           type: string
 *           description: Product category
 *           example: "Bakery"
 *         description:
 *           type: string
 *           description: Product description
 *           example: "Freshly baked bread"
 *         image:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Image ID from cloud storage
 *             url:
 *               type: string
 *               description: Image URL
 *     
 *     DeliveryProductResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Product unique ID
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: object
 */

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
    /**
     * @swagger
     * /deliver/{category}:
     *   get:
     *     summary: Get products by category
     *     description: Retrieve products filtered by category (e.g., bakery items)
     *     tags: [Delivery]
     *     parameters:
     *       - in: path
     *         name: category
     *         required: true
     *         schema:
     *           type: string
     *         description: Product category to filter by
     *         example: "bakery"
     *     responses:
     *       200:
     *         description: Products retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/DeliveryProductResponse'
     *       404:
     *         description: Category not found
     *       500:
     *         description: Server error
     */
    this.router.get("/:category", this.deliverController.verBakery.bind(this.deliverController));

    /**
     * @swagger
     * /deliver/uploadPic/{productId}:
     *   post:
     *     summary: Upload delivery product image
     *     description: Upload an image for a delivery product using Cloudinary
     *     tags: [Delivery]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: productId
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID to associate the image with
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *                 description: Image file to upload (jpg, png)
     *     responses:
     *       200:
     *         description: Image uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 url:
     *                   type: string
     *                   description: URL of uploaded image
     *                 id:
     *                   type: string
     *                   description: Cloudinary image ID
     *       400:
     *         description: Invalid file format or validation error
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.post(
      "/uploadPic/:productId",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.parser.single("image"),
      this.deliverController.uploadPic.bind(this.deliverController)
    );

    /**
     * @swagger
     * /deliver/{id}:
     *   put:
     *     summary: Update delivery product
     *     description: Update an existing delivery product's information
     *     tags: [Delivery]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product's unique ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/DeliveryProduct'
     *     responses:
     *       200:
     *         description: Product updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/DeliveryProductResponse'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Product not found
     *       500:
     *         description: Server error
     */
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
