import { Types } from "mongoose";

export enum GuideStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING = "PENDING"
}

export interface IGuide {
    user?: Types.ObjectId,
    division: Types.ObjectId,
    nidPhoto: string,
    status?: GuideStatus
}