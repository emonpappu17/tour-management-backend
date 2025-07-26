import { Router } from "express";
import { UserController } from "./user.controller";
import { updateUserZodSchema } from './user.validation'
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router()

router.post(
    "/register",
    // validateRequest(createUserZodSchema),
    UserController.createUser
)

router.get(
    "/all-users",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.getAllUsers
)

router.get(
    "/me",
    checkAuth(...Object.values(Role)),
    UserController.getMe
)

router.patch(
    "/:id",
    validateRequest(updateUserZodSchema),
    checkAuth(...Object.values(Role)),
    UserController.updateUser
)

router.get(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.getSingleUser
)

export const UserRoutes = router