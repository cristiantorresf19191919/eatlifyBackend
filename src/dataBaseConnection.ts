import mongoose from 'mongoose';

export default class DataBaseConnection {
    constructor (){
        const MONGO_URI = "mongodb+srv://cristiantorresf:Rnc4x4HPYIgP1EPy@cluster0.1ijuu.azure.mongodb.net/eatlify?retryWrites=true&w=majority";
        mongoose.connect(MONGO_URI,{       
        }).then(db=>console.log('\n\n\n\t 🥳🥳🥳CONECTADO A LA BASE DE DATOS CON EXITO\n'));  

    }
}