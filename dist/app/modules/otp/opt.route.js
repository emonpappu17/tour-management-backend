"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
// src/modules/otp/otp.routes.ts
const express_1 = __importDefault(require("express"));
const opt_controller_1 = require("./opt.controller");
// import { OTPController } from "./otp.controller";
const router = express_1.default.Router();
router.post("/send", opt_controller_1.OTPController.sendOTP);
router.post("/verify", opt_controller_1.OTPController.verifyOTP);
exports.OtpRoutes = router;
