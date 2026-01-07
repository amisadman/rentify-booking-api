import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middleware/auth";
import { access } from "../../middleware/role";

const router = Router();

router.post("/",auth, access(["admin" , "customer"]), bookingController.createBooking);

export const bookingRouter = router;
