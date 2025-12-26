import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";

type Role = "admin" | "customer";

export const access = (role: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(res, 401, false, "Unauthorized", null);
    }
    if (!role.includes(req.user.role)) {
      return sendResponse(res, 403, false, "Forbidden", null);
    }

    next();
  };
};
