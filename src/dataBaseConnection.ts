import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class DataBaseConnection {
  private uri: string = process.env.MONGO_URI!;

  public async connect() {
    if (!this.uri) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
      throw new Error(
        'DB_USERNAME or DB_PASSWORD environment variables are not set'
      );
    }

    const connectionUri = this.uri
      .replace('<db_username>', process.env.DB_USERNAME!)
      .replace('<db_password>', process.env.DB_PASSWORD!);

    await mongoose.connect(connectionUri);
    console.log('🥳 Connected to database successfully');
  }

  public async disconnect() {
    await mongoose.disconnect();
  }
}

export default DataBaseConnection;