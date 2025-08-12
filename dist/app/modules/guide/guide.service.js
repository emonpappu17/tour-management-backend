"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const guide_interface_1 = require("./guide.interface");
const guide_model_1 = require("./guide.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const applyForGuide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistGuide = yield guide_model_1.Guide.findOne({ user: payload.user });
    if (isExistGuide)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Already applied for guide!");
    const guide = yield guide_model_1.Guide.create(payload);
    return guide;
});
const approveGuide = (guideId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const guide = yield guide_model_1.Guide.findById(guideId).session(session);
        if (!guide)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Guide not found");
        if (guide.status === guide_interface_1.GuideStatus.APPROVED && status === guide_interface_1.GuideStatus.REJECTED)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot reject an already approved guide");
        if (guide.status === status)
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Guide is already ${status}`);
        guide.status = status;
        yield guide.save({ session });
        if (status === guide_interface_1.GuideStatus.APPROVED) {
            yield user_model_1.User.findByIdAndUpdate(guide.user, { role: user_interface_1.Role.GUIDE }, { runValidators: true, session });
        }
        yield session.commitTransaction();
        session.endSession();
        return guide;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllGuides = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(guide_model_1.Guide.find(), query);
    const guides = queryBuilder.filter().paginate();
    const [data, meta] = yield Promise.all([
        guides.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
exports.GuideService = {
    applyForGuide,
    approveGuide,
    getAllGuides
};
