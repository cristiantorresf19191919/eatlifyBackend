import * as Mongoose from 'mongoose';
import { Document,Model, Types } from 'mongoose';
import { IUser } from './Cajero';
import { IRestaurant } from './Restaurantes';
import { IModifierGroup } from './ModifierGroups';
// isModifierItem si es verdadero este solo va a aparecer solamente en addons y acompañamientos
type ID = Types.ObjectId;
export interface IProductos extends Document{
    user:ID | IUser;
    name:string;
    restaurant?: ID | IRestaurant ;
    groupModifiers ?: ID | IModifierGroup;
    topProduct:boolean;
    description:string;
    category:string;
    isModifierItem:boolean;
    addonProduct:boolean;
    price:string;
    image:{
        id:string,
        url:string
    };
}
const Schema = Mongoose.Schema;
const ProductSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'Cajero'
    },
    restaurant:{
        type:Schema.Types.ObjectId,
        ref:'Restaurant'
    },
    isModifierItem:{
        type:Boolean
    },
    groupModifiers:[
        {
            type: Schema.Types.ObjectId,
            ref:'ModifierGroupd'
        }
    ],
    name:{
        type:String,
        required:true
    },
    
    topProduct: {
        type: String,
        require: false,
      },
    description: String,
    category:{
        type:String,    
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:Object,
        id:String,
        url:String
    },
    addonProduct:{
        type:Boolean
    }

})

export default Mongoose.model<IProductos>('Products',ProductSchema);