/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
// import { IUser } from "../user/user.interface"
import httpStatus from 'http-status-codes'
import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken, } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";
import { name } from "ejs";


// const credentialsLogin = async (payload: Partial<IUser>) => {

//     const { email, password } = payload;

//     const isUserExist = await User.findOne({ email })

//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
//     }

//     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

//     if (!isPasswordMatched) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
//     }

//     // const jwtPayload = {
//     //     userId: isUserExist._id,
//     //     email: isUserExist.email,
//     //     role: isUserExist.role
//     // }

//     // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

//     // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

//     const userTokens = createUserToken(isUserExist);

//     // delete isUserExist.password;

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject();

//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     }
// }

const getNewAccessToken = async (refreshToken: string) => {

    // const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    // const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    // if (!isUserExist) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User doest not exist")
    // }

    // if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    //     throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    // }

    // if (isUserExist.isDeleted) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    // }

    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // }

    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    }
}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password doest not match")
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();
}

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id !== decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)

    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save();
}

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) throw new AppError(404, "User not found")

    if (user.password && user.auths.some(providerObject => providerObject.provider === 'google')) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password form your profile password update")
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auths, credentialProvider]

    user.password = hashedPassword

    user.auths = auths;

    await user.save()
}

const forgotPassword = async (email: string) => {

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doest not exist")
    }

    if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }

    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

    // http://localhost:5173/reset-password?id=6883793ce4a1db5bb1a4f0f3&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODgzNzkzY2U0YTFkYjViYjFhNGYwZjMiLCJlbWFpbCI6ImVtb25iYWZzZEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MzQ0Njc5OSwiZXhwIjoxNzUzNDQ3Mzk5fQ.GLwwD08D3Pdi5IZrUS7WvXEYfRXs8qHk_foT7y3yX4w
}

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword
}