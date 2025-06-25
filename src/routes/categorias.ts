import Container from '../container';
import { Router } from "express";
import { CategoriasController } from "../controllers/CategoriasController";
import { Authenticated } from '../middlewares/authenticated';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         user:
 *           type: string
 *           description: ID of the user who created the category
 *           example: "507f1f77bcf86cd799439011"
 *         restaurante:
 *           type: string
 *           description: ID of the restaurant this category belongs to
 *           example: "507f1f77bcf86cd799439012"
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Pizza"
 *         taxable:
 *           type: boolean
 *           description: Whether this category is taxable
 *           example: true
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the category was created
 *     
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Category unique ID
 *         name:
 *           type: string
 *         taxable:
 *           type: boolean
 *         date:
 *           type: string
 *           format: date-time
 */

class CategoriaRouter {
  private seguridad:Authenticated = new Authenticated();
  router: Router;
  constructor(private readonly categoriasController: CategoriasController) {
    this.router = Router();
    this.routes();
  }

  routes() {
    /**
     * @swagger
     * /categorias:
     *   get:
     *     summary: Get all categories
     *     description: Retrieve a list of all categories
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Categories retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/CategoryResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       500:
     *         description: Server error
     */
    this.router.get(
      "/",
      this.seguridad.adminAuthenticated,
      this.categoriasController.getCategorias.bind(this.categoriasController)
    );

    /**
     * @swagger
     * /categorias:
     *   post:
     *     summary: Create new category
     *     description: Add a new category to the system
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Category'
     *     responses:
     *       200:
     *         description: Category created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryResponse'
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
      this.categoriasController.postCategorias.bind(this.categoriasController)
    );

    /**
     * @swagger
     * /categorias/{id}:
     *   delete:
     *     summary: Delete category
     *     description: Delete a category from the system
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Category's unique ID
     *     responses:
     *       200:
     *         description: Category deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryResponse'
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Category not found
     *       500:
     *         description: Server error
     */
    this.router.delete(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.categoriasController.deleteCategorias.bind(this.categoriasController)
    );

    /**
     * @swagger
     * /categorias/{id}:
     *   put:
     *     summary: Update category
     *     description: Update an existing category's information
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Category's unique ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Category'
     *     responses:
     *       200:
     *         description: Category updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CategoryResponse'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized - Admin access required
     *       404:
     *         description: Category not found
     *       500:
     *         description: Server error
     */
    this.router.put(
      "/:id",
      this.seguridad.adminAuthenticated,
      this.categoriasController.UpdateCategorias.bind(this.categoriasController)
    );
  }
}

const categoriasController = Container.get(CategoriasController);
const categoriasRouter = new CategoriaRouter(categoriasController);
export default categoriasRouter.router;
