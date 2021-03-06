import * as mongoose from 'mongoose';
import { Document, Model } from "mongoose";

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    admin:boolean;
    superuser:boolean;
    date:Date;    
      
}
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
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
  admin: {
    type: Boolean,
    required: true,
  },
  superuser: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model<IUser>('Cajero', UserSchema);

