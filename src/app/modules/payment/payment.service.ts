/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found. You have not booked this tour')
    }

    const booking = await Booking.findById(payment.booking)
        .populate("user", "name email phone address")
        .populate("tour", "title costFrom")
        .populate("payment")

    console.log('booking===>', booking);

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    return {
        paymentUrl: sslPayment.GatewayPageURL,
    }
}


const successPayment = async (query: Record<string, string>) => {
    // Update Booking Status to CONFIRM
    // Update Payment Status to PAID

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { runValidators: true, session }
        )

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            { status: BOOKING_STATUS.COMPLETE },
            { runValidators: true, session }
        )

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