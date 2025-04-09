import mongoose from 'mongoose';
import { db_url } from '.';

export const connectDb = async () => {
    try {
        await mongoose.connect(db_url)
        mongoose.connection.on('error', (error: Error) => console.log(error));
        console.log('Database connection established ');
    } catch (error) {
        console.error('Error connecting to Database:', error);
        process.exit(1);
    }
}