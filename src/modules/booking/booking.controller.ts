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

export const bookingController = {
  createBooking,
};
