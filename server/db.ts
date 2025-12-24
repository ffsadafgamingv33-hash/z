import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn("⚠️  MONGODB_URI not set. Using in-memory storage.");
      console.warn("To use MongoDB:");
      console.warn("1. Create free account at https://www.mongodb.com/cloud/atlas");
      console.warn("2. Get your connection string");
      console.warn("3. Set MONGODB_URI environment variable with your connection string");
      return;
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("✓ Connected to MongoDB");
  } catch (error) {
    console.warn("⚠️  MongoDB connection failed. Using in-memory storage.");
    console.warn("Error:", error);
  }
}

export function isMongoDBConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
