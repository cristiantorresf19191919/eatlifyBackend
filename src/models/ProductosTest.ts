import * as Mongoose from "mongoose";
import {Schema, Document} from 'mongoose';


export interface IProductosTest extends Document{

    price: boolean;
    description: string;
    title: string;
    imageUrl: string;
    isFavorite: boolean;
}



const productosTestSchema = new Schema({

    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    isFavorite:{
        type: Boolean,
        default: false
        
    },

});


const ProductosTest =  Mongoose.model<IProductosTest>("ProductosTest",productosTestSchema );

export default ProductosTest;