import { Service } from 'typedi';
import Orders, { IOrders } from '../models/Orders';

@Service()
export class OrderService {

    async addOrder(orderData: IOrders) {
        const { amount, dateTime, products } = orderData;
        const newOrder = new Orders({ amount, dateTime, products });
        return await newOrder.save();
    }

    async viewOrder() {
        return await Orders.find({});
    }

    async viewOrderById(id: string) {
        const order = await Orders.findById(id);
        if (!order) {
            throw new Error("order not found in db");
        }
        return order;
    }

    async updateOrder(id: string, orderData: IOrders) {
        // The logic here seems incomplete in the controller, so I'm leaving it empty.
        // It can be implemented later.
        return { msg: "updateOrder not implemented" };
    }

    async deleteOrder(id: string) {
        const order = await Orders.findByIdAndRemove(id);
        if (!order) {
            throw new Error("order not found in db");
        }
        return order;
    }
} 