/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs';
// import AppError from "../errorHelpers/AppError";
// import httpStatus from "http-status-codes";



passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password"
    },
    async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email })

            // if (!isUserExist) {
            //     return done(null, false, { message: "User doest not exist" })
            // }

            if (!isUserExist) {
                return done("User doest not exist")
            }

            if (!isUserExist.isVerified) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
                return done("User is not verified")
            }

            if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                return done(`User is ${isUserExist.isActive}`)
            }

            if (isUserExist.isDeleted) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
                return done("User is deleted")
            }

            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == 'google')

            if (isGoogleAuthenticated && !isUserExist.password) {
                return done("You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.")
            }

            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password doest not match" })
            }

            return done(null, isUserExist)
        } catch (error) {
            console.log(error);
            done(error)
        }
    }
))

passport.use(new GoogleStrategy(
    {
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            // console.log('GoogleStrategy hit 2nd');
            // console.log('GoogleStrategy profile-->', profile);

            const email = profile.emails?.[0].value;

            if (!email) {
                return done(null, false, { message: "No email found" })
            }

            let isUserExist = await User.findOne({ email })

            if (isUserExist && isUserExist.isVerified) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
                // done("User is not verified")
                return done(null, false, { message: "User is not verified" })
            }

            if (isUserExist && (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE)) {
                // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
                return done(`User is ${isUserExist.isActive}`)
            }

            if (isUserExist && isUserExist.isDeleted) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
                // done("User is deleted")

                return done(null, false, { message: "User is deleted" })
            }

            if (!isUserExist) {
                isUserExist = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                })
            }

            return done(null, isUserExist);

        } catch (error) {
            console.log('Google Strategy Error', error);
            return done(error);
        }
    }
))

// frontend location:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent screen -> gmail login -> successful -> callback url localhost:5000/api/v1/auth/google/callback -> db store -> token

// Bridge == Google -> user db store -> token
// CUstom -> email, password, role: USER, name... -> register -> DB -> 1 User create
// Google -> req -> google -> successful : jwt Token : Role, email -> DB - Store -> token -> api access


// Store session data. Saves the user info after login 
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    console.log('serializeUser hit');
    console.log('serializeUser user -->', user);
    //Send session ID cookie. Sends ID to browser to identify the user on future requests
    done(null, user._id)
})

//Enable req.user	Brings back the user data on every request 
passport.deserializeUser(async (id: string, done: any) => {
    try {
        console.log('deserializeUser hit');
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})