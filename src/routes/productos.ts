import { Request, Response, Router, NextFunction } from "express";
import { CashiersController } from "../controllers/CashiersController";
import { Authenticated } from "../middlewares/authenticated";
import { ProductsController } from "../controllers/ProductsController";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *       properties:
 *         user:
 *           type: string
 *           description: ID of the user who created the product
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Product name
 *           example: "Margherita Pizza"
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant this product belongs to
 *           example: "507f1f77bcf86cd799439012"
 *         groupModifiers:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of modifier group IDs
 *           example: ["507f1f77bcf86cd799439013"]
 *         topProduct:
 *           type: boolean
 *           description: Whether this is a top/favorite product
 *           example: true
 *         description:
 *           type: string
 *           description: Product description
 *           example: "Classic tomato sauce with mozzarella cheese"
 *         category:
 *           type: string
 *           description: Product category
 *           example: "Pizza"
 *         isModifierItem:
 *           type: boolean
 *           description: Whether this is a modifier/addon item
 *           example: false
 *         addonProduct:
 *           type: boolean
 *           description: Whether this is an addon product
 *           example: false
 *         price:
 *           type: number
 *           description: Product price
 *           example: 12.99
 *         image:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Image ID from cloud storage
 *               example: "image_123"
 *             url:
 *               type: string
 *               description: Image URL
 *               example: "https://example.com/image.jpg"
 *     
 *     ProductResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Product unique ID
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         image:
 *           type: object
 *         topProduct:
 *           type: boolean
 *         isModifierItem:
 *           type: boolean
 *         addonProduct:
 *           type: boolean
 */

class ProductosRoutes {
  private productosController: ProductsController = new ProductsController();
  public seguridad: Authenticated = new Authenticated();
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  
  routes() {
    /**
     * @swagger
     * /products/addons:
     *   get:
     *     summary: Get addon products
     *     description: Retrieve all products that are marked as addons
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Addon products retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ProductResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.get("/addons", this.seguridad.adminAuthenticated, this.productosController.getAddonsProducts);

    /**
     * @swagger
     * /products:
     *   post:
     *     summary: Create new product
     *     description: Add a new product to the system
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Product'
     *     responses:
     *       200:
     *         description: Product created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductResponse'
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
      this.productosController.agregarProducto
    );

    /**
     * @swagger
     * /products/{id}:
     *   delete:
     *     summary: Delete product
     *     description: Delete a product from the system
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product's unique ID
     *     responses:
     *       200:
     *         description: Product deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Product not found
     *       500:
     *         description: Server error
     */
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.seguridad.isadmin,
      this.productosController.eliminarProducto
    );

    /**
     * @swagger
     * /products/{id}:
     *   put:
     *     summary: Update product
     *     description: Update an existing product's information
     *     tags: [Products]
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
     *             $ref: '#/components/schemas/Product'
     *     responses:
     *       200:
     *         description: Product updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductResponse'
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
      this.productosController.actualizarProducto
    );

    /**
     * @swagger
     * /products:
     *   get:
     *     summary: Get all products
     *     description: Retrieve a list of all products
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Products retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ProductResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.get("/", this.seguridad.adminAuthenticated, this.productosController.verProducto);

    /**
     * @swagger
     * /products/{id}:
     *   get:
     *     summary: Get product by ID
     *     description: Retrieve a specific product by its ID
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product's unique ID
     *     responses:
     *       200:
     *         description: Product retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ProductResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Product not found
     *       500:
     *         description: Server error
     */
    this.router.get("/:id", this.seguridad.adminAuthenticated, this.productosController.getProductById);
  }
}

const productosRoutes: ProductosRoutes = new ProductosRoutes();
export default productosRoutes.router;
