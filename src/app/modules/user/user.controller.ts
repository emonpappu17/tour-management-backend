/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
import AppError from "../../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
        message: "User Created Successfully",
        user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();

    res.status(httpStatus.OK).json({
        message: "All Users Retrieved Successfully",
        data: users
    })
})

export const UserController = {
    createUser,
    getAllUsers
}

// route matching -> controller -> service -> model -> DB
// i have to make service first
// i have to make controller second
// i have to make matching third