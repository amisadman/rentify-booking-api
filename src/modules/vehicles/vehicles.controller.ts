import { Request, Response } from "express"
import { sendResponse } from "../../utils/response"

const getVehicles = (req:Request, res:Response) =>{

    return sendResponse(res,200,true,"YOooooo");
}

export const vehiclesController={
    getVehicles
}