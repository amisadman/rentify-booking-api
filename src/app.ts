import express, { Request, Response } from "express";
import morgan from "morgan";
import { initDB } from "./database/db";
import { authRouter } from "./modules/auth/auth.routes";
import { vehiclesRouter } from "./modules/vehicles/vehicles.routes";
import { userRouter } from "./modules/user/user.routes";
import { bookingRouter } from "./modules/booking/booking.routes";
import { sendResponse } from "./utils/response";
const app = express();
app.use(express.json());
app.use(morgan("combined"));
initDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehiclesRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouter);



app.get("/", (req: Request, res: Response) => {
  return sendResponse(res,200,true,"Hello from Rentify!!!");
});

app.use((req: Request, res: Response) => {
  return sendResponse(res, 404, false, "Route not found.");
});

export default app;
