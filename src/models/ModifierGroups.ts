import { Document, Schema, Types } from "mongoose";
import * as Mongoose from "mongoose";
import { IUser } from "./Cajero";
import { IRestaurant } from './Restaurantes';
import { IProductos } from './Productos';
type ID = Types.ObjectId;


export interface IModifierGroup extends Document {
    name:string;
    notes:string;
    restaurant: ID | IRestaurant;    
    product: ID[] | Array<IProductos>;
    rules: {
        required: boolean;
        maximum_items: number;
    }
}
const ModifierGroupSchema = new Schema({
  
  restaurante:{
    type: Schema.Types.ObjectId,
    ref:'Restaurant'
  },
  product:[
    {
        type: Schema.Types.ObjectId,
        ref:'Products'
      }

  ],
  rules:{
    required: {
        type:Boolean
    },
    maximum_items:{
        type: Number
    }

  },
  name: {
    type: String,
    unique:true,
    required: true,
  },
  notes:{
      type: String,
      required: false
  }
});

export default Mongoose.model<IModifierGroup>('ModifierGroupd', ModifierGroupSchema);

