import * as Mongoose from "mongoose";
import {Schema, Document, Types} from 'mongoose';
import { IUser } from './Cajero';

interface Producto {
    product_name:  String;
    product_category:  String;
    product_quantity:  Number;
    product_total:  Number;
}
type ID = Types.ObjectId;

export interface IVentas extends Document{
    user: ID | IUser;
    cajero:string;
    totalventa:number;
    productos:Producto[];
    date:Date;    
}
const ventasSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'Cajero'
      },
      cajero: {
        type: String,
        required: false,
      },
      totalventa: {
        type: Number,
        required: true,
      },
      productos: [
        {
          product_name: {type: String},
          product_category: {type: String},
          product_quantity: {type: Number},
          product_total: {type: Number},
        },
      ],
      date: {
        type: String,
        required: true,
      },
      user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cajero',
        required: false,
      },
})

export default Mongoose.model<IVentas>('Venta',ventasSchema);



























