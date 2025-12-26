import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { sendResponse } from "../utils/response";
import { AuthUser } from "../../types/auth/auth";

export const auth = (req: Request,res:Response,next:NextFunction) =>{

    const token = req.headers.authorization?.split(" ")[1];

    if(!token)return sendResponse(res, 401, false, "Token not found",null);


    const decoded = jwt.verify(token as string,config.jwt_secret as string) as AuthUser;

    req.user = decoded;
    next();

}

