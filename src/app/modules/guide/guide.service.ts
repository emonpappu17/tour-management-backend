import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { GuideStatus, IGuide } from "./guide.interface"
import { Guide } from "./guide.model"
import httpStatus from "http-status-codes"


const applyForGuide = async (payload: Partial<IGuide>) => {
    const isExistGuide = await Guide.findOne({ user: payload.user });

    if (isExistGuide) throw new AppError(httpStatus.BAD_REQUEST, "Already applied for guide!")

    const guide = await Guide.create(payload);

    return guide;
}

const approveGuide = async (guideId: string, status: Partial<GuideStatus>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const guide = await Guide.findById(guideId).session(session);

        if (!guide) throw new AppError(httpStatus.NOT_FOUND, "Guide not found");

        if (guide.status === GuideStatus.APPROVED && status === GuideStatus.REJECTED) throw new AppError(httpStatus.BAD_REQUEST, "Cannot reject an already approved guide");

        if (guide.status === status) throw new AppError(httpStatus.BAD_REQUEST, `Guide is already ${status}`)

        guide.status = status;
        await guide.save({ session });

        if (status === GuideStatus.APPROVED) {
            await User.findByIdAndUpdate(
                guide.user,
                { role: Role.GUIDE },
                { runValidators: true, session }
            )
        }

        await session.commitTransaction();
        session.endSession();

        return guide;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
}

const getAllGuides = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Guide.find(), query);

    const guides = queryBuilder.filter().paginate()

    const [data, meta] = await Promise.all([
        guides.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}


export const GuideService = {
    applyForGuide,
    approveGuide,
    getAllGuides
}