/* This code ensures an efficient MongoDB connection in a Next.js app by caching the connection globally to prevent multiple connections.
 */

import mongoose, { Mongoose } from "mongoose";

import logger from "./logger";

const MONGODB_URI = (process.env.MONGODB_URI || "") as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  /* `global.mongoose` is a global variable used to share the connection between different parts of the application. It is used to prevent multiple connections to the same database.
   */

  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global?.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached?.conn) {
    logger.info("Using mongoose cached connection");
    return cached.conn;
  }

  if (!cached?.promise) {
    cached.promise = (async () => {
      try {
        const result = await mongoose.connect(MONGODB_URI, {
          dbName: "asyncawaits",
        });

        logger.info("Connected to MongoDB");
        return result;
      } catch (error) {
        logger.error("Error connecting to MongoDB", error);
        throw error;
      }
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
