import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./db/index.js";

dotenv.config({
  path: "./.env",
  quiet: true,
});

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("error in connect db ", error);
      throw error;
    });

    app.listen(process.env.PORT || 5000, () => {
      console.log(`server is running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongo db connection failed !!!", error);
  });
