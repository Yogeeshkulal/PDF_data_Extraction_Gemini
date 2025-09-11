import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let db: mongoose.Connection;
let bucket: GridFSBucket;

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    db = mongoose.connection;
    if (!db.db) {
      throw new Error("MongoDB database object is undefined.");
    }
    bucket = new GridFSBucket(db.db, { bucketName: 'pdfs' });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export const getBucket = () => {
  if (!bucket) {
    throw new Error('GridFSBucket not initialized. Call connectDB first.');
  }
  return bucket;
};
