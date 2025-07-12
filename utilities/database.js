import mongoose from "mongoose";

const Dbconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.error("There is an issue connecting MongoDb: ", error);
    throw error;
  }
};

export default Dbconnection;