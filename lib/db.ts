import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jaxicloud";

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 3000,
      })
      .catch((err) => {
        console.warn("MongoDB connection deferred:", err?.message || err);
        cached.promise = null;
        return null as unknown as typeof mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
