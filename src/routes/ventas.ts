import { Router } from "express";
import { VentaController } from "../controllers/VentaController";
import { Authenticated } from '../middlewares/authenticated';

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleProduct:
 *       type: object
 *       required:
 *         - product_name
 *         - product_category
 *         - product_quantity
 *         - product_total
 *       properties:
 *         product_name:
 *           type: string
 *           description: Product name
 *           example: "Margherita Pizza"
 *         product_category:
 *           type: string
 *           description: Product category
 *           example: "Pizza"
 *         product_quantity:
 *           type: number
 *           description: Quantity sold
 *           example: 2
 *         product_total:
 *           type: number
 *           description: Total price for this product
 *           example: 25.98
 *     
 *     Sale:
 *       type: object
 *       required:
 *         - totalventa
 *         - productos
 *         - date
 *       properties:
 *         user:
 *           type: string
 *           description: ID of the user who made the sale
 *           example: "507f1f77bcf86cd799439011"
 *         cajero:
 *           type: string
 *           description: Cashier name
 *           example: "John Doe"
 *         totalventa:
 *           type: number
 *           description: Total sale amount
 *           example: 45.99
 *         productos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleProduct'
 *           description: Array of products in the sale
 *         date:
 *           type: string
 *           format: date-time
 *           description: Sale date and time
 *           example: "2024-01-15T10:30:00Z"
 *         user_id:
 *           type: string
 *           description: User ID reference
 *           example: "507f1f77bcf86cd799439011"
 *     
 *     SaleResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Sale unique ID
 *         cajero:
 *           type: string
 *         totalventa:
 *           type: number
 *         productos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleProduct'
 *         date:
 *           type: string
 *           format: date-time
 */

class VentasRouter {
  router: Router;
  private ventasController: VentaController;
  private seguridad: Authenticated;
  constructor() {
    this.router = Router();
    this.ventasController = new VentaController();
    this.seguridad = new Authenticated();
    this.routes();
  }

  routes() {
    /**
     * @swagger
     * /ventas/eliminarInformesVentas:
     *   get:
     *     summary: Delete sales reports
     *     description: Delete all sales reports from the system (Super User only)
     *     tags: [Sales]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Sales reports deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: "Sales reports deleted successfully"
     *       401:
     *         description: Unauthorized - Super User access required
     *       500:
     *         description: Server error
     */
    this.router.get(
      "/eliminarInformesVentas",
      this.seguridad.superUserAuthenticated,
      this.ventasController.eliminarInformesVentas
    );

    /**
     * @swagger
     * /ventas:
     *   get:
     *     summary: Get all sales
     *     description: Retrieve a list of all sales
     *     tags: [Sales]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Sales retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/SaleResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.get("/", this.seguridad.adminAuthenticated, this.ventasController.verVentas);

    /**
     * @swagger
     * /ventas:
     *   post:
     *     summary: Create new sale
     *     description: Add a new sale to the system
     *     tags: [Sales]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Sale'
     *     responses:
     *       200:
     *         description: Sale created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SaleResponse'
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
      this.ventasController.agregarVenta
    );

    /**
     * @swagger
     * /ventas/{id}:
     *   put:
     *     summary: Update sale
     *     description: Update an existing sale's information (Super User only)
     *     tags: [Sales]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Sale's unique ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Sale'
     *     responses:
     *       200:
     *         description: Sale updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SaleResponse'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized - Super User access required
     *       404:
     *         description: Sale not found
     *       500:
     *         description: Server error
     */
    this.router.put(
      "/:id",
      this.seguridad.superUserAuthenticated,
      this.ventasController.actualizarVenta
    );
  }
}

const ventarRouter = new VentasRouter();
export default ventarRouter.router;
