
import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';

class OrderRoutes {
    private orderController:OrdersController = new OrdersController;

    router:Router;

    constructor(){
        this.router = Router();
        this.routes();

    }

    routes(){
        this.router.post("/",this.orderController.addOrder);
        this.router.get("/",this.orderController.viewOrder);
        this.router.get("/:id",this.orderController.viewOrderById);
        this.router.put("/:id",this.orderController.updateOrder);
        this.router.delete("/:id",this.orderController.deleteOrder);
        
    }

}

const orderRouter:OrderRoutes = new OrderRoutes();
    export default orderRouter.router;