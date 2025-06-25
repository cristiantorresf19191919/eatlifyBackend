import { Router } from "express";
import { PreventasController } from "../controllers/PreventasController";
import { Authenticated } from "../middlewares/authenticated";

/**
 * @swagger
 * components:
 *   schemas:
 *     PreSale:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *         - quantity
 *       properties:
 *         user:
 *           type: string
 *           description: ID of the user who created the pre-sale
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Product name
 *           example: "Custom Cake"
 *         price:
 *           type: number
 *           description: Product price
 *           example: 25.99
 *         description:
 *           type: string
 *           description: Product description
 *           example: "Custom birthday cake with chocolate frosting"
 *         category:
 *           type: string
 *           description: Product category
 *           example: "Cakes"
 *         quantity:
 *           type: number
 *           description: Quantity ordered
 *           example: 1
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the pre-sale was created
 *     
 *     PreSaleResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Pre-sale unique ID
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         quantity:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 */

class PreventaRouter {
  private preventasController: PreventasController = new PreventasController();
  private seguridad: Authenticated = new Authenticated();
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    /**
     * @swagger
     * /preventas:
     *   get:
     *     summary: Get all pre-sales
     *     description: Retrieve a list of all pre-sales
     *     tags: [Pre-Sales]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Pre-sales retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PreSaleResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.get(
      "/",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.preventasController.verVentas
    );

    /**
     * @swagger
     * /preventas:
     *   post:
     *     summary: Create new pre-sale
     *     description: Add a new pre-sale to the system
     *     tags: [Pre-Sales]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PreSale'
     *     responses:
     *       200:
     *         description: Pre-sale created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PreSaleResponse'
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
      this.preventasController.agregarVenta
    );

    /**
     * @swagger
     * /preventas/{id}:
     *   delete:
     *     summary: Delete pre-sale
     *     description: Delete a pre-sale from the system
     *     tags: [Pre-Sales]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Pre-sale's unique ID
     *     responses:
     *       200:
     *         description: Pre-sale deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PreSaleResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Pre-sale not found
     *       500:
     *         description: Server error
     */
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.seguridad.isadmin,
      this.preventasController.eliminarVenta
    );

    /**
     * @swagger
     * /preventas/borretodo:
     *   get:
     *     summary: Delete all pre-sales
     *     description: Delete all pre-sales from the system (Super User only)
     *     tags: [Pre-Sales]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: All pre-sales deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: "All pre-sales deleted successfully"
     *       401:
     *         description: Unauthorized - Super User access required
     *       500:
     *         description: Server error
     */
    this.router.get(
      "/borretodo",
      this.seguridad.superUserAuthenticated,
      this.preventasController.deleteAllSales
    );

    /**
     * @swagger
     * /preventas/{id}:
     *   put:
     *     summary: Update pre-sale
     *     description: Update an existing pre-sale's information
     *     tags: [Pre-Sales]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Pre-sale's unique ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PreSale'
     *     responses:
     *       200:
     *         description: Pre-sale updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PreSaleResponse'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Pre-sale not found
     *       500:
     *         description: Server error
     */
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.preventasController.actualizarVenta
    );
  }
}

const preventasRouter = new PreventaRouter();
export default preventasRouter.router;
