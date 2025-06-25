import Container from '../container';
import { Request, Response, Router, NextFunction } from "express";
import { CashiersController } from "../controllers/CashiersController";
import { Authenticated } from "../middlewares/authenticated";

/**
 * @swagger
 * components:
 *   schemas:
 *     Cashier:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - admin
 *         - superuser
 *       properties:
 *         name:
 *           type: string
 *           description: Cashier's full name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Cashier's email address
 *           example: "john.doe@restaurant.com"
 *         password:
 *           type: string
 *           description: Cashier's password
 *           example: "securePassword123"
 *         admin:
 *           type: boolean
 *           description: Whether the cashier has admin privileges
 *           example: true
 *         superuser:
 *           type: boolean
 *           description: Whether the cashier has superuser privileges
 *           example: false
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the cashier was created
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Cashier's email address
 *           example: "john.doe@restaurant.com"
 *         password:
 *           type: string
 *           description: Cashier's password
 *           example: "securePassword123"
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         usuarioenviar:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Cashier's unique ID
 *             name:
 *               type: string
 *               description: Cashier's name
 *             admin:
 *               type: boolean
 *               description: Admin privileges
 *             superuser:
 *               type: boolean
 *               description: Superuser privileges
 */

class CashierRoutes {
  public authenticated: Authenticated = new Authenticated();
  router: Router;

  constructor(private readonly cashierController: CashiersController) {
    this.router = Router();
    this.routes();
  }
  routes() {
    /**
     * @swagger
     * /cajeros/loginCajero:
     *   post:
     *     summary: Login cashier
     *     description: Authenticate a cashier with email and password
     *     tags: [Cashiers]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       400:
     *         description: User not found or invalid credentials
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Server error
     */
    this.router.post(
      "/loginCajero",
      this.cashierController.loginCashier.bind(this.cashierController)
    );

    /**
     * @swagger
     * /cajeros/registerMasterUser:
     *   post:
     *     summary: Register master user
     *     description: Register a super user (admin) account
     *     tags: [Cashiers]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Admin User"
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "admin@restaurant.com"
     *               password:
     *                 type: string
     *                 example: "adminPassword123"
     *     responses:
     *       200:
     *         description: Master user registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Success'
     *       400:
     *         description: Validation error or user already exists
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(
      "/registerMasterUser",
      this.cashierController.registerMasterUser.bind(this.cashierController)
    );

    /**
     * @swagger
     * /cajeros/registerCashier:
     *   post:
     *     summary: Register new cashier
     *     description: Register a new cashier with JWT token generation
     *     tags: [Cashiers]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Cashier'
     *     responses:
     *       200:
     *         description: Cashier registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: JWT token for the new cashier
     *       400:
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(
      "/registerCashier",
      this.cashierController.RegisterCashier.bind(this.cashierController)
    );

    /**
     * @swagger
     * /cajeros/addCashier:
     *   post:
     *     summary: Add new cashier
     *     description: Add a new cashier to the system
     *     tags: [Cashiers]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Cashier'
     *     responses:
     *       200:
     *         description: Cashier added successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cashier'
     *       500:
     *         description: Server error
     */
    this.router.post(
      "/addCashier",
      this.cashierController.addCashier.bind(this.cashierController)
    );

    /**
     * @swagger
     * /cajeros:
     *   get:
     *     summary: Get all cashiers
     *     description: Retrieve a list of all cashiers (passwords excluded)
     *     tags: [Cashiers]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of cashiers retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Cashier'
     *       500:
     *         description: Server error
     */
    this.router.get(
      "/",
      this.cashierController.seeCashier.bind(this.cashierController)
    );

    /**
     * @swagger
     * /cajeros/{id}:
     *   put:
     *     summary: Update cashier
     *     description: Update an existing cashier's information
     *     tags: [Cashiers]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Cashier's unique ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Cashier'
     *     responses:
     *       200:
     *         description: Cashier updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cashier'
     *       500:
     *         description: Server error
     */
    this.router.put(
      "/:id",
      this.cashierController.updateCashier.bind(this.cashierController)
    );

    /**
     * @swagger
     * /cajeros/{id}:
     *   delete:
     *     summary: Delete cashier
     *     description: Delete a cashier from the system
     *     tags: [Cashiers]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Cashier's unique ID
     *     responses:
     *       200:
     *         description: Cashier deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cashier'
     *       500:
     *         description: Server error
     */
    this.router.delete(
      "/:id",
      this.cashierController.deleteCashier.bind(this.cashierController)
    );

    /**
     * @swagger
     * /cajeros/compareEmail:
     *   get:
     *     summary: Check email existence
     *     description: Check if an email address is already registered
     *     tags: [Cashiers]
     *     parameters:
     *       - in: query
     *         name: email
     *         required: true
     *         schema:
     *           type: string
     *           format: email
     *         description: Email address to check
     *     responses:
     *       200:
     *         description: Email check result
     *         content:
     *           application/json:
     *             schema:
     *               type: boolean
     *               description: true if email exists, false otherwise
     *       500:
     *         description: Server error
     */
    this.router.get(
      "/compareEmail",
      this.cashierController.compareEmail.bind(this.cashierController)
    );
  }
}

const cashierController = Container.get(CashiersController);
const cajerosRoutes = new CashierRoutes(cashierController);

export default cajerosRoutes.router;
