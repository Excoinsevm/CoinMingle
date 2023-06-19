import mongoose from "mongoose";

export const connectToDB = async () => {
  const URL = process.env.MONGODB_URL;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(URL as string);
  }
};
