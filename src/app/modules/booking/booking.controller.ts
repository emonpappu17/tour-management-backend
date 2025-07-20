import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookingService } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;

    const booking = await BookingService.createBooking(req.body, decodedToken.userId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking
    })
})

const getUserBooking = catchAsync(async (req: Request, res: Response) => {
    const booking = await BookingService.getUserBooking();

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking retrieved successfully",
        data: booking
    })
})

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const booking = await BookingService.getSingleBooking();

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking retrieved successfully",
        data: booking
    })
})

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const booking = await BookingService.getAllBookings();

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Bookings retrieved successfully",
        data: booking
    })
})

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const updated = await BookingService.updateBookingStatus();

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Bookings updated successfully",
        data: updated
    })
})

export const BookingController = {
    createBooking,
    getUserBooking,
    getSingleBooking,
    getAllBookings,
    updateBookingStatus
}