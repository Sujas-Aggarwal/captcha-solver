import { assert } from "console";
import mongoose from "mongoose";
const NEXT_PUBLIC_MONGO_CONNECT_URI =
  process.env.NEXT_PUBLIC_MONGO_CONNECT_URI || "";
assert(NEXT_PUBLIC_MONGO_CONNECT_URI, "NEXT_PUBLIC_MONGO_CONNECT_URI is required");
export const connectDB = async () => {
  try {
    await mongoose.connect(NEXT_PUBLIC_MONGO_CONNECT_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection failed", error);
  }
};
export default mongoose;