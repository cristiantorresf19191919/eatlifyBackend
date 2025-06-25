import Container from '../container';
import { Request, Response, Router, NextFunction } from "express";
import { CashiersController } from "../controllers/CashiersController";
import { Authenticated } from "../middlewares/authenticated";
import { RestaurantController } from '../controllers/RestaurantController';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import Cloudinary from "cloudinary";
import multer from "multer";

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Restaurant name
 *           example: "Pizza Palace"
 *         user:
 *           type: string
 *           description: ID of the user who owns the restaurant
 *           example: "507f1f77bcf86cd799439011"
 *         address:
 *           type: string
 *           description: Restaurant address
 *           example: "123 Main St, City, State 12345"
 *         email:
 *           type: string
 *           format: email
 *           description: Restaurant email address
 *           example: "info@pizzapalace.com"
 *         password:
 *           type: string
 *           description: Restaurant password
 *           example: "securePassword123"
 *         description:
 *           type: string
 *           description: Restaurant description
 *           example: "Best pizza in town with fresh ingredients"
 *         phone:
 *           type: string
 *           description: Restaurant phone number
 *           example: "+1-555-123-4567"
 *         image:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Image ID from cloud storage
 *               example: "restaurant_123"
 *             url:
 *               type: string
 *               description: Image URL
 *               example: "https://example.com/restaurant.jpg"
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               topProduct:
 *                 type: boolean
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: object
 *         ventas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ventaTotal:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     
 *     RestaurantLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Restaurant email address
 *           example: "info@pizzapalace.com"
 *         password:
 *           type: string
 *           description: Restaurant password
 *           example: "securePassword123"
 *     
 *     RestaurantLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         restaurant:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *     
 *     RestaurantResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Restaurant unique ID
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         description:
 *           type: string
 *         phone:
 *           type: string
 *         image:
 *           type: object
 *         productos:
 *           type: array
 *         ventas:
 *           type: array
 */

class RestaurantRoute {
  public seguridad: Authenticated = new Authenticated();
  router: Router;
  public parser:any;

  public cloudinary = Cloudinary;
  constructor(private readonly restaurantController: RestaurantController) {
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
    /**
     * @swagger
     * /restaurants:
     *   post:
     *     summary: Create new restaurant
     *     description: Add a new restaurant to the system
     *     tags: [Restaurants]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Restaurant'
     *     responses:
     *       200:
     *         description: Restaurant created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RestaurantResponse'
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.post(
      "/",
      this.seguridad.adminAuthenticated,
      this.restaurantController.saveRestaurant
    );

    /**
     * @swagger
     * /restaurants/login:
     *   post:
     *     summary: Login restaurant
     *     description: Authenticate a restaurant with email and password
     *     tags: [Restaurants]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RestaurantLoginRequest'
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RestaurantLoginResponse'
     *       400:
     *         description: Invalid credentials
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Server error
     */
    this.router.post(
      "/login",
      this.restaurantController.login.bind(this.restaurantController)
    );

    /**
     * @swagger
     * /restaurants/uploadPic/{productId}:
     *   post:
     *     summary: Upload restaurant image
     *     description: Upload an image for a restaurant using Cloudinary
     *     tags: [Restaurants]
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
      this.restaurantController.uploadPic
    );

    /**
     * @swagger
     * /restaurants/{id}:
     *   delete:
     *     summary: Delete restaurant
     *     description: Delete a restaurant from the system
     *     tags: [Restaurants]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Restaurant's unique ID
     *     responses:
     *       200:
     *         description: Restaurant deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RestaurantResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Restaurant not found
     *       500:
     *         description: Server error
     */
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.restaurantController.deleteRestaurant
    );

    /**
     * @swagger
     * /restaurants/{id}:
     *   put:
     *     summary: Update restaurant
     *     description: Update an existing restaurant's information
     *     tags: [Restaurants]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Restaurant's unique ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Restaurant'
     *     responses:
     *       200:
     *         description: Restaurant updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RestaurantResponse'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Restaurant not found
     *       500:
     *         description: Server error
     */
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.seguridad.isadmin,
      this.restaurantController.updateRestaurant.bind(this.restaurantController)
    );

    /**
     * @swagger
     * /restaurants:
     *   get:
     *     summary: Get all restaurants
     *     description: Retrieve a list of all restaurants
     *     tags: [Restaurants]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Restaurants retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/RestaurantResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.get(
        "/",
        this.seguridad.adminAuthenticated,
        this.restaurantController.getAllRestaurants.bind(this.restaurantController));
  }
}

const restaurantController = Container.get(RestaurantController);
const restaurantRoute: RestaurantRoute = new RestaurantRoute(restaurantController);
export default restaurantRoute.router;
