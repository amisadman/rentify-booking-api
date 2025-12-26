import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/response";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req.body);
    return sendResponse(
      res,
      201,
      true,
      "User registered successfully",
      result.rows[0]
    );
  } catch (error: any) {
    if (error.message.includes("duplicate key"))
      return sendResponse(res, 400, false, error.message, null);
    return sendResponse(res, 500, false, error.message, null);
  }
};
const signin = async (req: Request, res: Response) => {
  try {
    const result = await authService.signin(req.body);

    if (result === null)
      return sendResponse(res, 404, false, "User not Found", null);
    else if (result === false)
      return sendResponse(res, 400, false, "Incorrect Password", null);
    else return sendResponse(res, 201, true, "Login successful", result);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

export const authController = {
  signup,
  signin,
};
