import Container from '../container';
import { Router } from "express";
import { FinalUsersController } from "../controllers/FinalUsersController";

/**
 * @swagger
 * components:
 *   schemas:
 *     FinalUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: User's last name
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: User's password
 *           example: "securePassword123"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the user was created
 *     
 *     FinalUserLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: User's password
 *           example: "securePassword123"
 *     
 *     FinalUserLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 */

class FinalUserRouter {
  router: Router;
  constructor(private readonly finalUserController: FinalUsersController) {
    this.router = Router();
    this.routes();
  }

  routes() {
    /**
     * @swagger
     * /finalUsers:
     *   post:
     *     summary: Register new final user
     *     description: Create a new final user account with JWT token generation
     *     tags: [Final Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FinalUser'
     *     responses:
     *       200:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FinalUserLoginResponse'
     *       400:
     *         description: Validation error or email already exists
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(
      "/",
      this.finalUserController.addFinalUser.bind(this.finalUserController)
    );

    /**
     * @swagger
     * /finalUsers/login:
     *   post:
     *     summary: Login final user
     *     description: Authenticate a final user with email and password
     *     tags: [Final Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FinalUserLoginRequest'
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FinalUserLoginResponse'
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
      "/login",
      this.finalUserController.loginFinalUser.bind(this.finalUserController)
    );

    /**
     * @swagger
     * /finalUsers:
     *   get:
     *     summary: Get all final users
     *     description: Retrieve a list of all final users
     *     tags: [Final Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of users retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/FinalUser'
     *       500:
     *         description: Server error
     */
    this.router.get(
      "/",
      this.finalUserController.viewAllUsers.bind(this.finalUserController)
    );

    /**
     * @swagger
     * /finalUsers/{id}:
     *   get:
     *     summary: Get final user by ID
     *     description: Retrieve a specific final user by their ID
     *     tags: [Final Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User's unique ID
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FinalUser'
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.get(
      "/:id",
      this.finalUserController.viewFinalUserbyId.bind(this.finalUserController)
    );

    /**
     * @swagger
     * /finalUsers/{id}:
     *   put:
     *     summary: Update final user
     *     description: Update an existing final user's information
     *     tags: [Final Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User's unique ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FinalUser'
     *     responses:
     *       200:
     *         description: User updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FinalUser'
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.put(
      "/:id",
      this.finalUserController.updateFinalUser.bind(this.finalUserController)
    );

    /**
     * @swagger
     * /finalUsers/{id}:
     *   delete:
     *     summary: Delete final user
     *     description: Delete a final user from the system
     *     tags: [Final Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User's unique ID
     *     responses:
     *       200:
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/FinalUser'
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.delete(
      "/:id",
      this.finalUserController.deleteFinalUser.bind(this.finalUserController)
    );
  }
}

const finalUserController = Container.get(FinalUsersController);
const finalUserRouter = new FinalUserRouter(finalUserController);
export default finalUserRouter.router;
