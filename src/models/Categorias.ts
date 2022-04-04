import { Document, Schema, Types } from "mongoose";
import * as Mongoose from "mongoose";
import { IUser } from "./Cajero";
import { IRestaurant } from './Restaurantes';

type ID = Types.ObjectId;
export interface ICategory  extends Document {
    user: ID | IUser;
    restaurante: ID | IRestaurant;
    name:string;
    taxable:boolean;
    date: Date;
}
const CategorySchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref:'Cajero'
  },
  restaurante:{
    type: Schema.Types.ObjectId,
    ref:'Restaurante'
  },
  name: {
    type: String,
    required: true,
  },
  taxable: {
    type: Boolean,

  },
  date: {
    type: Date,
    default: Date.now,
  },


});

export default Mongoose.model<ICategory>('Categorias', CategorySchema);

