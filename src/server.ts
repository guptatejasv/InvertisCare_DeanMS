import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/official.db";
import router from "./routes/dean.routes";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();
connectDB();
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", router);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
