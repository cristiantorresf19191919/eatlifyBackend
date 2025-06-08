import mongoose from 'mongoose';

export default class DataBaseConnection {
    constructor() {
        const { DB_USERNAME, DB_PASSWORD } = process.env;

        if (!DB_USERNAME || !DB_PASSWORD) {
            console.error('FATAL ERROR: Make sure DB_USERNAME and DB_PASSWORD are defined in your .env file.');
            process.exit(1);
        }

        // Using a template and replacing credentials from environment variables
        const MONGO_URI_TEMPLATE = "mongodb+srv://<DB_USERNAME>:<DB_PASSWORD>@cluster0.1ijuu.azure.mongodb.net/eatlify?retryWrites=true&w=majority";
        const MONGO_URI = MONGO_URI_TEMPLATE
            .replace('<DB_USERNAME>', DB_USERNAME)
            .replace('<DB_PASSWORD>', DB_PASSWORD);

        mongoose.connect(MONGO_URI, {})
            .then(db => console.log('\n\n\n\t 🥳🥳🥳CONECTADO A LA BASE DE DATOS CON EXITO\n'))
            .catch(err => {
                console.error('Database connection error:', err.message);
                process.exit(1);
            });
    }
}