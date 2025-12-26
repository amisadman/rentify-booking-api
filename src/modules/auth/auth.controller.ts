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
    return sendResponse(res, 404, false, error.message, null);
  }
};

export const authController = {
  signup,
};
