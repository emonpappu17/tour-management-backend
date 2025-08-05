import { model, Schema } from "mongoose";
import { GuideStatus, IGuide } from "./guide.interface";

const guideSchema = new Schema<IGuide>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    nidPhoto: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(GuideStatus),
        default: GuideStatus.PENDING
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Guide = model<IGuide>("Guide", guideSchema);