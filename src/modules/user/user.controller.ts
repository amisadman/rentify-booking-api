import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    if (result.length === 0) {
      return sendResponse(res, 200, true, "No users found", []);
    }
    return sendResponse(res, 200, true, "Users retrieved successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user!;

    const existingUser = await userService.getUserById(Number(req.params.id));
    if (!existingUser) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (
      currentUser.role !== "admin" &&
      currentUser.id !== Number(req.params.id)
    ) {
      return sendResponse(
        res,
        403,
        false,
        "You can only update your own profile"
      );
    }

    if (req.body.role && currentUser.role !== "admin") {
      return sendResponse(res, 403, false, "Only admin can update user roles");
    }

    const result = await userService.updateUser(
      Number(req.params.id),
      req.body
    );
    if (!result) {
      return sendResponse(res, 400, false, "No valid fields to update");
    }

    return sendResponse(res, 200, true, "User updated successfully", result);
  } catch (error: any) {
    if (error.message.includes("duplicate key")) {
      return sendResponse(res, 400, false, "Email already exists");
    }
    return sendResponse(res, 500, false, error.message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const existingUser = await userService.getUserById(userId);
    if (!existingUser) {
      return sendResponse(res, 404, false, "User not found");
    }

    await userService.deleteUser(userId);
    return sendResponse(res, 200, true, "User deleted successfully");
  } catch (error: any) {
    if (error.message.includes("active bookings")) {
      return sendResponse(res, 400, false, error.message);
    }
    return sendResponse(res, 500, false, error.message);
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
