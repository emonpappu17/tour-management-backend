import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

/* ------------------ TOUR TYPE CONTROLLER -------------------- */
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

const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await TourService.updateTourType(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type updated successfully",
        data: result
    })
})

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await TourService.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour type deleted successfully",
        data: result
    })
})

/* --------------------- TOUR CONTROLLER ---------------------- */
const createTour = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.createTour(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour created successfully",
        data: result
    })
})

const getAllTours = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await TourService.getAllTours(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Tour retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const updateTour = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await TourService.updateTour(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour updated successfully",
        data: result
    })
})

export const TourController = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTours,
    updateTour
}
