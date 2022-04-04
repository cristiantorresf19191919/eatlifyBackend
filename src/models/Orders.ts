import * as Mongoose from "mongoose";
import {Schema, Document} from 'mongoose';


export interface IOrders extends Document{

    amount: number;
    products: [];
    dateTime: string; 
}



const ordersSchema = new Schema({

 
    amount: {
        type: Number

    },
    products: [
        {
            title:{type:String},
            quantity:{type:Number},
            price:{type:Number},
            imgUrl:{type:String},

        }
    ],
    dateTime: {
        type:String
    },

});


const Orders =  Mongoose.model<IOrders>("Orders",ordersSchema );

export default Orders;