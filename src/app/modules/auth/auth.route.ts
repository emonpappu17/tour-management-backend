import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router()

router.post(
    "/login",
    AuthControllers.credentialsLogin
)
router.post(
    "/refresh-token",
    AuthControllers.getNewAccessToken
)
router.post(
    "/logout",
    AuthControllers.logout
)
router.post(
    "/change-password",
    checkAuth(...Object.values(Role)),
    AuthControllers.changePassword
)
router.post(
    "/set-password",
    checkAuth(...Object.values(Role)),
    AuthControllers.setPassword
)
router.post(
    "/forgot-password",
    AuthControllers.forgotPassword
)
router.post(
    "/reset-password",
    checkAuth(...Object.values(Role)),
    AuthControllers.resetPassword
)


// Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=saminisrar1@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password   


// /booking -> /login -> successful google login -> /booking frontend
// /login -> successful google login -> / frontend
router.get(
    "/google",
    async (req: Request, res: Response, next: NextFunction) => {
        const redirect = req.query.redirect || "/"
        passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
    }
)

// api/v1/auth/google/callback?state=/booking
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issue with your account. Please contact with out support team!` }),
    AuthControllers.googleCallbackController
)


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

export const AuthRoutes = router;

