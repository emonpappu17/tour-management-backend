import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

const createTourType = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.createTourType(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour type created successfully",
        data: result
    })
})
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.getAllTourTypes();
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour types retrieved successfully",
        data: result
    })
})

export const TourController = {
    createTourType,
    getAllTourTypes
}
