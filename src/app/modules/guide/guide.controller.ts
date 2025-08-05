import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GuideService } from "./guide.service";
import { IGuide } from "./guide.interface";
import { JwtPayload } from "jsonwebtoken";

const applyForGuide = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;

    const payload: IGuide = {
        ...req.body,
        user: decodedToken.userId,
        nidPhoto: req.file?.path
    }

    const result = await GuideService.applyForGuide(payload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide application submitted successfully!",
        data: result
    })
})

const approveGuide = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await GuideService.approveGuide(id, status);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Guide ${status} successfully`,
        data: result
    })
})

const getAllGuides = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await GuideService.getAllGuides(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All guide retrieved successfully!",
        data: result.data,
        meta: result.meta
    })
})

export const GuideController = {
    applyForGuide,
    approveGuide,
    getAllGuides
}
