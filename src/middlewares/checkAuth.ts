import { NextFunction, Request, Response } from "express";
import { envVars } from "../app/config/env";
import { verifyToken } from "../app/utils/jwt";
import AppError from "../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../app/modules/user/user.model";
import { IsActive } from "../app/modules/user/user.interface";
import httpStatus from 'http-status-codes'


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) throw new AppError(403, "No Token Received")

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User doest not exist")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!")
        }

        req.user = verifiedToken;

        next()

    } catch (error) {
        next(error)
    }
}