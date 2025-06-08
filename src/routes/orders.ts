import Container from '../container';
import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';

class OrderRoutes {
    router: Router;

    constructor(private readonly orderController: OrdersController) {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post("/", this.orderController.addOrder.bind(this.orderController));
        this.router.get("/", this.orderController.viewOrder.bind(this.orderController));
        this.router.get("/:id", this.orderController.viewOrderById.bind(this.orderController));
        this.router.put("/:id", this.orderController.updateOrder.bind(this.orderController));
        this.router.delete("/:id", this.orderController.deleteOrder.bind(this.orderController));
    }
}

const orderController = Container.get(OrdersController);
const orderRouter: OrderRoutes = new OrderRoutes(orderController);
export default orderRouter.router;