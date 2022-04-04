import * as Mongoose from "mongoose";
import {Schema, Document, Types} from "mongoose";
import { IUser } from './Cajero';
type ID = Types.ObjectId;
export interface IPreventas extends Document {
    user: ID | IUser;
    name:string;
    price:number;
    description:string;
    category:string;
    quantity:number;
    date:Date;
}

const preventasSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref:'Cajero'
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,

  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }

  // etc
});

export default Mongoose.model<IPreventas>('Preventa', preventasSchema);
