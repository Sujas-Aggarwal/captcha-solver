import { assert } from "console";
import mongoose from "mongoose";
const MONGO_CONNECT_URI =
  process.env.MONGO_CONNECT_URI || "";
assert(MONGO_CONNECT_URI, "MONGO_CONNECT_URI is required");
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_CONNECT_URI);
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