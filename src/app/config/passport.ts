/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";

passport.use(new GoogleStrategy(
    {
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            console.log('GoogleStrategy hit 2nd');
            console.log('GoogleStrategy profile-->', profile);

            const email = profile.emails?.[0].value;

            if (!email) {
                return done(null, false, { message: "No email found" })
            }

            let user = await User.findOne({ email })

            if (!user) {
                user = await User.create({
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

            return done(null, user);

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