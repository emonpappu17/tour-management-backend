import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GuideService } from "./guide.service";
import { IGuide } from "./guide.interface";
import { JwtPayload } from "jsonwebtoken";

const applyForGuide = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const payload: IGuide = {
        division: req.body,
        nidPhoto: req.file?.path as string
    }
    const result = await GuideService.applyForGuide(decodedToken.userId, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide application submitted successfully!",
        data: result
    })
})

const approveGuide = catchAsync(async (req: Request, res: Response) => {
    const result = await GuideService.approveGuide();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide application processed!",
        data: result
    })
})

const getAllGuides = catchAsync(async (req: Request, res: Response) => {
    const result = await GuideService.getAllGuides();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All guide applications retrieved!",
        data: result
    })
})

export const GuideController = {
    applyForGuide,
    approveGuide,
    getAllGuides
}
