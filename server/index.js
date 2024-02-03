import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import db from "./configs/database.js";

dotenv.config();

// (async () => {
//   await db.sync();
// })();

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRoute);

// app.use("/", (req, res) => {
//   res.send("tes...");
// });

const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log("Server running on port...:", port);
});
