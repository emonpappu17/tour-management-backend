import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { TourController } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */
router.get(
    "/tour-types",
    TourController.getAllTourTypes
)

router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType
)

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.updateTourType
)

router.get(
    "/tour-types/:id",
    TourController.getSingleTourType
);

router.delete(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TourController.deleteTourType
)

/* --------------------- TOUR ROUTES ---------------------- */
router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validateRequest(createTourZodSchema),
    TourController.createTour
)

router.get(
    "/",
    TourController.getAllTours
)

router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    TourController.updateTour
)

router.get(
    "/:slug",
    TourController.getSingleTour
)

router.delete(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TourController.deleteTour
)

export const TourRoutes = router;