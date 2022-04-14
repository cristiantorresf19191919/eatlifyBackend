import * as mongoose from 'mongoose';
import { Document,Model,Types } from 'mongoose';
import { IUser } from './Cajero';
import { IProductos } from './Productos';

type ID = Types.ObjectId;

export interface IRestaurant extends Document{
    name:string;
    user?:ID | IUser;    
    address?:string;
    email:string;
    password:string;
    description?: string; 
    phone: string;
    image?:{id:string,url:string};
    productos?: IProductos[];   
    ventas?:[]
}
const Schema = mongoose.Schema;
const RestaurantSchema = new Schema({  
    user:{
        type: Schema.Types.ObjectId,
        ref:'Cajero'
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address: {
        type: String,
        require: false,
      },
    description: String,
    phone: String,
    image:{
        type:Object,
        id:String,
        url:String
    },
    productos: [
        {   
            name:{type: String},
            topProduct:{type: Boolean},
            description:{type: String},
            category:{type: String},
            price:{type: Number},
            image:{
                type:Object,
                id:String,
                url:String
            },
        }
    ],
    ventas:[
        {
            ventaTotal:{type:String},
            date: {type: Date, default: Date.now}
        }
    ]
    
  

})

export default mongoose.model<IRestaurant>('Restaurants',RestaurantSchema);