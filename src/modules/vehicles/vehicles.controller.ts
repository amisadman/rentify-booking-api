import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    return sendResponse(
      res,
      201,
      true,
      "Vehicle created successfully",
      result.rows[0]
    );
  } catch (error: any) {
    if (error.message.includes("duplicate key"))
      return sendResponse(res, 400, false, error.message, null);
    return sendResponse(res, 404, false, error.message, null);
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    if (result.length === 0)
      return sendResponse(res, 200, true, "No vehicles found", []);
    else
      sendResponse(res, 200, true, "Vehicles retrieved successfully", result);
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message, null);
  }
};
const getVehiclesById = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    const result = await vehicleService.getVehiclesById(Number(req.params.id));
    if (result.length === 0)
      return sendResponse(res, 200, true, "No vehicles found", []);
    else
      sendResponse(res, 200, true, "Vehicles retrieved successfully", result);
  } catch (error: any) {
    return sendResponse(res, 404, false, error.message, null);
  }
};

export const vehiclesController = {
  createVehicle,
  getAllVehicles,
  getVehiclesById,
};
