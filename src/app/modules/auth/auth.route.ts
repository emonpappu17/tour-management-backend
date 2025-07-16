import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import passport from "passport";
// import AppError from "../../errorHelpers/AppError";
// import httpStatus from 'http-status-codes';
// import { createUserToken } from "../../utils/userTokens";
// import { setAuthCookie } from "../../utils/setCookie";
// import { envVars } from "../../config/env";


const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)

// /booking -> /login -> successful google login -> /booking frontend
// /login -> successful google login -> / frontend
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    console.log('/google hit 1st');
    const redirect = req.query.redirect || "/"

    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)



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

