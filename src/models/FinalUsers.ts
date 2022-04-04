import * as mongoose from 'mongoose';
import { Document, Model } from "mongoose";

export interface IFinalUsers extends Document{
    firstName:string;
    lastName:string;
    email:string;
    password:string;   
    date:Date;    
}
const Schema = mongoose.Schema;
const FinalUserSchema = new Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },  
  date: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model<IFinalUsers>('FinalUsers', FinalUserSchema);

