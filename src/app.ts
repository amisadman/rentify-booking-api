import express, { Request, Response } from "express";
import morgan from "morgan";
import { initDB } from "./database/db";
const app = express();
app.use(express.json());
app.use(morgan("combined"));
initDB();





app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Hello from Rentify!!!",
  });
});

export default app;