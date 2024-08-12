import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/InvertisCare_db").then(() => {
      console.log("Connected to the database.");
    });
  } catch (error) {
    console.log(`Database not Connected: ${error}`);
  }
};

export default connectDB;
