import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../utils/response"

export const access = (role: "admin"|"customer") =>{
    return (req:Request,res:Response,next:NextFunction) =>{

        if(req.user?.role !== role) return sendResponse(res, 403, false, "Unauthorized",null);

        next();
    };

};