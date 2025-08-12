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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const guide_service_1 = require("./guide.service");
const applyForGuide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const decodedToken = req.user;
    const payload = Object.assign(Object.assign({}, req.body), { user: decodedToken.userId, nidPhoto: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const result = yield guide_service_1.GuideService.applyForGuide(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Guide application submitted successfully!",
        data: result
    });
}));
const approveGuide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield guide_service_1.GuideService.approveGuide(id, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Guide ${status} successfully`,
        data: result
    });
}));
const getAllGuides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield guide_service_1.GuideService.getAllGuides(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "All guide retrieved successfully!",
        data: result.data,
        meta: result.meta
    });
}));
exports.GuideController = {
    applyForGuide,
    approveGuide,
    getAllGuides
};
