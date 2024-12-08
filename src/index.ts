import express from "express";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import cookieParse from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

import router from "./router";

dotenv.config();

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParse());
app.use(bodyParser.json());

const server = http.createServer(app);
server.listen(8080, () => {
  console.log("Server running on localhost:8080");
});

const MONGO_URL = process.env.MONGO_URI;

mongoose.Promise = Promise;
if (!MONGO_URL) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
