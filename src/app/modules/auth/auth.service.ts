import AppError from "../../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import httpStatus from 'http-status-codes'
import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    // const accessToken = jwt.sign(jwtPayload, "secret", {
    //     expiresIn: "1d"
    // })

    return {
        // email: isUserExist.email
        accessToken
    }
}

export const AuthServices = {
    credentialsLogin
}