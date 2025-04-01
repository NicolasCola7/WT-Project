import { connect, connection } from 'mongoose';

const connectToMongo = async (): Promise<void> => {
  let mongodbURI: string;
  mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/selfie';
  await connect(mongodbURI);
  console.log(`Connected to MongoDB (db: ${mongodbURI.split('/').pop()})`);
};

const disconnectMongo = async (): Promise<void> => {
  await connection.close();
};

export { connectToMongo, disconnectMongo };