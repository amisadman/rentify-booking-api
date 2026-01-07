import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middleware/auth";
import { access } from "../../middleware/role";

const router = Router();

router.post(
  "/",
  auth,
  access(["admin", "customer"]),
  bookingController.createBooking
);
router.put(
  "/:id",
  auth,
  access(["admin", "customer"]),
  bookingController.updateBooking
);
router.get(
  "/",
  auth,
  access(["admin", "customer"]),
  bookingController.getAllBookings
);
export const bookingRouter = router;
