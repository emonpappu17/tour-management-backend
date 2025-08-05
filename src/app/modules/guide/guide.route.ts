import { Router } from "express";
import { GuideController } from "./guide.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { guideApplyZodSchema } from "./guide.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
    "/apply",
    checkAuth(Role.USER),
    multerUpload.single("file"),
    validateRequest(guideApplyZodSchema),
    GuideController.applyForGuide
)

router.post(
    "/approve/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    GuideController.approveGuide
)

router.post(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    GuideController.getAllGuides
)

export const GuideRoutes = router;