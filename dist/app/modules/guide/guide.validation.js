"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideApprovalZodSchema = exports.guideApplyZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const guide_interface_1 = require("./guide.interface");
exports.guideApplyZodSchema = zod_1.default.object({
    division: zod_1.default.string()
});
exports.guideApprovalZodSchema = zod_1.default.object({
    status: zod_1.default.enum([guide_interface_1.GuideStatus.APPROVED, guide_interface_1.GuideStatus.REJECTED])
});
