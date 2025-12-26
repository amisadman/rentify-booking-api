import { Request, Response } from "express";
import { sendResponse } from "../../utils/response";
import { userService } from "./user.service";

const getAllUsers = async(req:Request,res:Response)=>{
   try {
    const result = await userService.getAllUsers();
    if (result.length === 0) {
      return sendResponse(res, 200, true, "No users found", []);
    }
    return sendResponse(res, 200, true, "Users retrieved successfully", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message);
  }

}

export const userController ={
    getAllUsers
}