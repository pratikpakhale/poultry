import express from "express";
import cors from "cors";

import router from "./routes";
import { errorMiddleware } from "./middlewares/error";
import env from "./config/env";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: env.NODE_ENV === "production" ? env.FRONTEND_ORIGIN : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", router);

app.use(errorMiddleware);

export default app;
