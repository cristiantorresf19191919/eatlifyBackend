import Container from '../container';
import { Router } from 'express';
import { Authenticated } from "../middlewares/authenticated";
import { ModifierGroupController } from "../controllers/ModifierGroupsController";

/**
 * @swagger
 * components:
 *   schemas:
 *     ModifierGroupRules:
 *       type: object
 *       properties:
 *         required:
 *           type: boolean
 *           description: Whether modifiers are required for this group
 *           example: true
 *         maximum_items:
 *           type: number
 *           description: Maximum number of items that can be selected
 *           example: 3
 *     
 *     ModifierGroup:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Modifier group name
 *           example: "Pizza Toppings"
 *         notes:
 *           type: string
 *           description: Additional notes about the modifier group
 *           example: "Choose your favorite toppings"
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant this modifier group belongs to
 *           example: "507f1f77bcf86cd799439012"
 *         product:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product IDs that can use this modifier group
 *           example: ["507f1f77bcf86cd799439013"]
 *         rules:
 *           $ref: '#/components/schemas/ModifierGroupRules'
 *     
 *     ModifierGroupResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Modifier group unique ID
 *         name:
 *           type: string
 *         notes:
 *           type: string
 *         restaurant:
 *           type: string
 *         product:
 *           type: array
 *           items:
 *             type: string
 *         rules:
 *           $ref: '#/components/schemas/ModifierGroupRules'
 */

export class ModifierGroupRoute {

    router: Router;
    public seguridad: Authenticated = new Authenticated();

    constructor(private readonly modifierController: ModifierGroupController) {
        this.router = Router();
        this.routes();
    }

    private routes() {
        /**
         * @swagger
         * /modifier:
         *   post:
         *     summary: Create new modifier group
         *     description: Add a new modifier group to the system
         *     tags: [Modifier Groups]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ModifierGroup'
         *     responses:
         *       200:
         *         description: Modifier group created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ModifierGroupResponse'
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
        this.router.post("", this.seguridad.adminAuthenticated, this.modifierController.addModifierGroup.bind(this.modifierController));

        /**
         * @swagger
         * /modifier:
         *   get:
         *     summary: Get all modifier groups
         *     description: Retrieve a list of all modifier groups
         *     tags: [Modifier Groups]
         *     responses:
         *       200:
         *         description: Modifier groups retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/ModifierGroupResponse'
         *       500:
         *         description: Server error
         */
        this.router.get("", this.modifierController.viewAllModifierGroup.bind(this.modifierController));

        /**
         * @swagger
         * /modifier/{id}:
         *   get:
         *     summary: Get modifier group by ID
         *     description: Retrieve a specific modifier group by its ID
         *     tags: [Modifier Groups]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Modifier group's unique ID
         *     responses:
         *       200:
         *         description: Modifier group retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ModifierGroupResponse'
         *       404:
         *         description: Modifier group not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       500:
         *         description: Server error
         */
        this.router.get("/:id", this.modifierController.viewModiferById.bind(this.modifierController));

        /**
         * @swagger
         * /modifier/{id}:
         *   put:
         *     summary: Update modifier group
         *     description: Update an existing modifier group's information
         *     tags: [Modifier Groups]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Modifier group's unique ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ModifierGroup'
         *     responses:
         *       200:
         *         description: Modifier group updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ModifierGroupResponse'
         *       400:
         *         description: Validation error
         *       401:
         *         description: Unauthorized - Admin access required
         *       404:
         *         description: Modifier group not found
         *       500:
         *         description: Server error
         */
        this.router.put("/:id", this.seguridad.adminAuthenticated, this.modifierController.updateModifierGroup.bind(this.modifierController));

        /**
         * @swagger
         * /modifier/{id}:
         *   delete:
         *     summary: Delete modifier group
         *     description: Delete a modifier group from the system
         *     tags: [Modifier Groups]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Modifier group's unique ID
         *     responses:
         *       200:
         *         description: Modifier group deleted successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ModifierGroupResponse'
         *       401:
         *         description: Unauthorized - Admin access required
         *       404:
         *         description: Modifier group not found
         *       500:
         *         description: Server error
         */
        this.router.delete("/:id", this.seguridad.adminAuthenticated, this.modifierController.deleteModifierGroup.bind(this.modifierController));
    }

}

const modifierController = Container.get(ModifierGroupController);
const modifierRouter: ModifierGroupRoute = new ModifierGroupRoute(modifierController);
export default modifierRouter.router;