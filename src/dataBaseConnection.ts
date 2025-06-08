import mongoose from "mongoose";

class DataBaseConnection {
    private user: string = process.env.USER_DB;
    private pass: string = process.env.PASS_DB;
    private db_name: string = process.env.DB_NAME;

    private MONGODB_URI: string = `mongodb+srv://${this.user}:${this.pass}@cluster0.o9fbl.mongodb.net/${this.db_name}?retryWrites=true&w=majority`;

    public async connect() {
        try {
            await mongoose.connect(this.MONGODB_URI);
            console.log("\n\n\n   🥳🥳🥳CONECTADO A LA BASE DE DATOS CON EXITO");
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async disconnect() {
        await mongoose.disconnect();
    }
}

export default DataBaseConnection;