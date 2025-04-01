import mongoose from "mongoose";
import {User} from "./DBModels/User";


// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI;

// Prevent multiple connections in development
let dbConnection: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose;

if (!dbConnection) {
  dbConnection = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("dbConnect called");
  
  if (dbConnection.conn) {
    return dbConnection.conn;
  }

  if (!dbConnection.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }
    
    console.log("Connecting to MongoDB...");
    dbConnection.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Successfully connected to MongoDB");
      return mongoose;
    });
  }

  try {
    dbConnection.conn = await dbConnection.promise;
  } catch (e) {
    dbConnection.promise = null;
    throw e;
  }

  return dbConnection.conn;
}

export { dbConnect };

