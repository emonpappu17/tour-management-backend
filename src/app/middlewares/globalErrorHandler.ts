/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { handlerCastError } from "../helpers/handleCastError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { TErrorSources } from "../interfaces/error.types";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";
// import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.NODE_ENV === "development") console.log(err);

    if (req.file) {
        await deleteImageFromCloudinary(req.file.path)
    }

    if (req.files && Array.isArray(req.files) && req.files.length) {

        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

        await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))
    }

    let errorSources: TErrorSources[] = []
    let statusCode = 500;
    let message = 'Something went wrong!!'

    // Duplicate Error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }

    // Object Id Error/ Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handlerCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }

    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }

    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}