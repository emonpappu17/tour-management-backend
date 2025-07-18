import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema } from "./tour.validation";
import { TourController } from "./tour.controller";

const router = Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */
router.get("/tour-types", TourController.getAllTourTypes)
router.post("/create-tour-type", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourController.createTourType)
router.patch("/tour-types/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(createTourTypeZodSchema),TourController.updateTourType)
router.delete("/tour-types/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),TourController.deleteTourType)

/* --------------------- TOUR ROUTES ---------------------- */
router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourZodSchema),TourController.createTour)

export const TourRoutes = router;