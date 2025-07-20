import express from "express"
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingZodSchema),
    BookingController.createBooking
)

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    BookingController.getAllBookings
)

router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    BookingController.getUserBooking
);

export const BookingRoutes = router