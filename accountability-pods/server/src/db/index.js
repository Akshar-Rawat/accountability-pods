import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`,
    );
    try {
      await connectionInstance.connection.db.collection("pods").dropIndex("name_1");
    } catch (error) {
      if (error.codeName !== "IndexNotFound") {
        console.log("pod name index cleanup skipped:", error.message);
      }
    }
    // console.log(connectionInstance);
    
    console.log(
      `\n mongodb connected || db host ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("connection failed ", error);
    process.exit(1);
  }
};

export default connectDb;
