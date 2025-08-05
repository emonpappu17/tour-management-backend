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
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.changePassword);
// For google user only who never set their password yet
router.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.setPassword);
router.post("/forgot-password", auth_controller_1.AuthControllers.forgotPassword);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.resetPassword);
// Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=saminisrar1@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password   
// /booking -> /login -> successful google login -> /booking frontend
// /login -> successful google login -> / frontend
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", { scope: ["profile", "email"], state: redirect })(req, res, next);
}));
// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=There is some issue with your account. Please contact with out support team!` }), auth_controller_1.AuthControllers.googleCallbackController);
// // Start Google auth
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// // Google callback
// router.get(
//     "/google/callback",
//     passport.authenticate("google", { session: false }),
//     (req, res) => {
//         // Generate JWT token
//         // const user = req.user as any;
//         // const token = generateToken(user);
//         // Option 1: Send as JSON (ideal for frontend apps)
//         // res.json({ token, user });
//         // Option 2: Redirect with token in query string
//         // res.redirect(`http://localhost:3000?token=${token}`);
//         console.log('/google/callback hit 3rd');
//         const user = req.user;
//         console.log("user--->", user);
//         if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
//         }
//         const tokenInfo = createUserToken(user)
//         setAuthCookie(res, tokenInfo)
//         // sendResponse(res, {
//         //     success: true,
//         //     statusCode: httpStatus.OK,
//         //     message: "Password Changed Successfully",
//         //     data: null
//         // })
//         res.redirect(`${envVars.FRONTEND_URL}/booking`)
//     }
// );
exports.AuthRoutes = router;
