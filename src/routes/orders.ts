import Container from '../container';
import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProduct:
 *       type: object
 *       required:
 *         - title
 *         - quantity
 *         - price
 *       properties:
 *         title:
 *           type: string
 *           description: Product name
 *           example: "Margherita Pizza"
 *         quantity:
 *           type: number
 *           description: Quantity of the product
 *           example: 2
 *         price:
 *           type: number
 *           description: Price per unit
 *           example: 12.99
 *         imgUrl:
 *           type: string
 *           description: Product image URL
 *           example: "https://example.com/pizza.jpg"
 *     
 *     Order:
 *       type: object
 *       required:
 *         - amount
 *         - products
 *       properties:
 *         amount:
 *           type: number
 *           description: Total order amount
 *           example: 25.98
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *           description: Array of products in the order
 *         dateTime:
 *           type: string
 *           format: date-time
 *           description: Order date and time
 *           example: "2024-01-15T10:30:00Z"
 *     
 *     OrderResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Order unique ID
 *         amount:
 *           type: number
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *         dateTime:
 *           type: string
 *           format: date-time
 */

class OrderRoutes {
    router: Router;

    constructor(private readonly orderController: OrdersController) {
        this.router = Router();
        this.routes();
    }

    routes() {
        /**
         * @swagger
         * /orders:
         *   post:
         *     summary: Create new order
         *     description: Add a new order to the system
         *     tags: [Orders]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Order'
         *     responses:
         *       200:
         *         description: Order created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/OrderResponse'
         *       400:
         *         description: Validation error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       500:
         *         description: Server error
         */
        this.router.post("/", this.orderController.addOrder.bind(this.orderController));

        /**
         * @swagger
         * /orders:
         *   get:
         *     summary: Get all orders
         *     description: Retrieve a list of all orders
         *     tags: [Orders]
         *     responses:
         *       200:
         *         description: Orders retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/OrderResponse'
         *       500:
         *         description: Server error
         */
        this.router.get("/", this.orderController.viewOrder.bind(this.orderController));

        /**
         * @swagger
         * /orders/{id}:
         *   get:
         *     summary: Get order by ID
         *     description: Retrieve a specific order by its ID
         *     tags: [Orders]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Order's unique ID
         *     responses:
         *       200:
         *         description: Order retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/OrderResponse'
         *       404:
         *         description: Order not found
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Error'
         *       500:
         *         description: Server error
         */
        this.router.get("/:id", this.orderController.viewOrderById.bind(this.orderController));

        /**
         * @swagger
         * /orders/{id}:
         *   put:
         *     summary: Update order
         *     description: Update an existing order's information
         *     tags: [Orders]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Order's unique ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Order'
         *     responses:
         *       200:
         *         description: Order updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/OrderResponse'
         *       400:
         *         description: Validation error
         *       404:
         *         description: Order not found
         *       500:
         *         description: Server error
         */
        this.router.put("/:id", this.orderController.updateOrder.bind(this.orderController));

        /**
         * @swagger
         * /orders/{id}:
         *   delete:
         *     summary: Delete order
         *     description: Delete an order from the system
         *     tags: [Orders]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Order's unique ID
         *     responses:
         *       200:
         *         description: Order deleted successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/OrderResponse'
         *       404:
         *         description: Order not found
         *       500:
         *         description: Server error
         */
        this.router.delete("/:id", this.orderController.deleteOrder.bind(this.orderController));
    }
}

const orderController = Container.get(OrdersController);
const orderRouter: OrderRoutes = new OrderRoutes(orderController);
export default orderRouter.router;