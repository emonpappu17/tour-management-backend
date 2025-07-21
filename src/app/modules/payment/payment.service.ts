import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async () => {

}


const successPayment = async (query: Record<string, string>) => {
    // Update Booking Status to CONFIRM
    // Update Payment Status to PAID

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: PAYMENT_STATUS.PAID }, { runValidators: true, session })

        await Booking.findByIdAndUpdate(updatedPayment?.booking, { status: BOOKING_STATUS.COMPLETE }, { runValidators: true, session })

        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
    }
};

const failPayment = async (query: Record<string, string>) => {
    // Update Booking Status to FAIL
    // Update Payment Status to FAIL

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: PAYMENT_STATUS.FAILED }, { runValidators: true, session })

        await Booking.findByIdAndUpdate(updatedPayment?.booking, { status: BOOKING_STATUS.FAILED }, { runValidators: true, session })

        await session.commitTransaction();
        session.endSession();

        return { success: false, message: "Payment Failed" }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
    }

};

const cancelPayment = async (query: Record<string, string>) => {
    // Update Booking Status to CANCEL
    // Update Payment Status to CANCEL

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: PAYMENT_STATUS.CANCELED }, { runValidators: true, session })

        await Booking.findByIdAndUpdate(updatedPayment?.booking, { status: BOOKING_STATUS.CANCEL }, { runValidators: true, session })

        await session.commitTransaction();
        session.endSession();

        return { success: false, message: "Payment Cancelled" }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
    }
};

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};