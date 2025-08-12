"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guide = void 0;
const mongoose_1 = require("mongoose");
const guide_interface_1 = require("./guide.interface");
const guideSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    nidPhoto: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(guide_interface_1.GuideStatus),
        default: guide_interface_1.GuideStatus.PENDING
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Guide = (0, mongoose_1.model)("Guide", guideSchema);
