import { Service } from 'typedi';
import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { IOrders } from '../models/Orders';

@Service()
export class OrdersController {

    constructor(private readonly orderService: OrderService) { }

    async addOrder(req: Request, res: Response) {
        try {
            const newOrder = await this.orderService.addOrder(req.body as IOrders);
            return res.status(200).json({ msg: 'order has been created succesfully', order: newOrder });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'error in the server sorry', error: error });
        }
    }

    async viewOrder(req: Request, res: Response) {
        try {
            const allOrders = await this.orderService.viewOrder();
            return res.status(200).json({
                msg: "Orders loaded succesfully :)",
                order: allOrders
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'error del servidor', error: error });
        }
    }
    async viewOrderById(req: Request, res: Response) {
        try {
            const order = await this.orderService.viewOrderById(req.params.id);
            return res.status(200).json({ msg: "order found succesfully", order });
        } catch (error) {
            return res.status(404).json({ msg: error.message });
        }
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const result = await this.orderService.updateOrder(req.params.id, req.body as IOrders);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'sorry server error :(', error: error });
        }
    }

    async deleteOrder(req: Request, res: Response) {
        try {
            await this.orderService.deleteOrder(req.params.id);
            return res.status(200).json({ msg: "order deleted succesfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'sorry server error :(', error: error });
        }
    }
}

