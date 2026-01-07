import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { sendResponse } from "../../utils/response";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);
    return sendResponse(res, 201, true, "Booking created successfully", result);
  } catch (error: any) {
    if (
      error.message.includes("not found") ||
      error.message.includes("not available")
    ) {
      return sendResponse(res, 400, false, error.message);
    }
    return sendResponse(res, 500, false, error.message);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.id);
    const currentUser = req.user!;
    const { status } = req.body;

    const existingBooking = await bookingService.getBookingById(bookingId);
    if (!existingBooking) {
      return sendResponse(res, 404, false, "Booking not found");
    }

    if (existingBooking.status !== "active") {
      return sendResponse(
        res,
        400,
        false,
        `Booking is already ${existingBooking.status}`
      );
    }

    if (!["cancelled", "returned"].includes(status)) {
      return sendResponse(
        res,
        400,
        false,
        "Invalid status. Must be 'cancelled' or 'returned'"
      );
    }

    if (status === "returned" && currentUser.role !== "admin") {
      return sendResponse(
        res,
        403,
        false,
        "Only admin can mark booking as returned"
      );
    }

    if (
      currentUser.role === "customer" &&
      existingBooking.customer_id !== currentUser.id
    ) {
      return sendResponse(
        res,
        403,
        false,
        "You can only cancel your own bookings"
      );
    }

    const result = await bookingService.updateBookingStatus(
      bookingId,
      status,
      existingBooking.vehicle_id
    );

    const message =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    return sendResponse(res, 200, true, message, result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user!;
    const result = await bookingService.getAllBookings(
      currentUser.id,
      currentUser.role
    );

    if (result.length === 0) {
      const message =
        currentUser.role === "admin"
          ? "No bookings found"
          : "Your bookings retrieved successfully";
      return sendResponse(res, 200, true, message, []);
    }

    const message =
      currentUser.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    return sendResponse(res, 200, true, message, result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const bookingController = {
  createBooking,
  updateBooking,
  getAllBookings
};
