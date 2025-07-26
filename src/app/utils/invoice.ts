/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";

import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 })

            const buffer: Uint8Array[] = [];

            doc.on("data", (chunk) => buffer.push(chunk))
            doc.on("end", () => resolve(Buffer.concat(buffer)))
            doc.on("error", (err) => reject(err))

            //PDF Content
            doc.fontSize(20).text("Invoice", { align: "center" })
            doc.moveDown()
            doc.fontSize(14).text(`Transaction ID:${invoiceData.transactionId}`)
            doc.text(`Booking Date: ${invoiceData.bookingDate}`)
            doc.text(`Customer : ${invoiceData.userName}`)

            doc.moveDown();

            doc.text(`Tour: ${invoiceData.tourTitle}`);
            doc.text(`Guests: ${invoiceData.guestCount}`);
            doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);

            doc.moveDown();

            doc.text("Thank you for booking with us!", { align: "center" });

            doc.end()
        })
    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `Pdf creation error ${error.message}`)
    }
}

// import PDFDocument from "pdfkit";
// import AppError from "../errorHelpers/AppError";

// export interface IInvoiceData {
//     transactionId: string;
//     bookingDate: Date;
//     userName: string;
//     tourTitle: string;
//     guestCount: number;
//     totalAmount: number;
// }

// GPT
// export const generatePdf = async (
//     invoiceData: IInvoiceData
// ): Promise<Buffer> => {
//     try {
//         return new Promise((resolve, reject) => {
//             const doc = new PDFDocument({ size: "A4", margin: 50 });

//             const buffers: Uint8Array[] = [];

//             doc.on("data", (chunk) => buffers.push(chunk));
//             doc.on("end", () => resolve(Buffer.concat(buffers)));
//             doc.on("error", (err) => reject(err));

//             // ==== Styling Constants ====
//             const primaryColor = "#0D6FEC";
//             const labelColor = "#555";
//             const textColor = "#000";

//             // ==== Title ====
//             doc
//                 .fontSize(26)
//                 .fillColor(primaryColor)
//                 .text("🧾 Booking Invoice", { align: "center" });

//             doc.moveDown(1.5);
//             doc
//                 .moveTo(50, doc.y)
//                 .lineTo(545, doc.y)
//                 .strokeColor("#ccc")
//                 .lineWidth(1)
//                 .stroke();

//             doc.moveDown();

//             // ==== Section 1: Transaction Info ====
//             doc
//                 .fontSize(14)
//                 .fillColor(labelColor)
//                 .text("Transaction ID:", { continued: true })
//                 .fillColor(textColor)
//                 .text(` ${invoiceData.transactionId}`);

//             doc
//                 .fillColor(labelColor)
//                 .text("Booking Date:", { continued: true })
//                 .fillColor(textColor)
//                 .text(` ${new Date(invoiceData.bookingDate).toLocaleDateString()}`);

//             doc.moveDown();

//             // ==== Section 2: Customer Info ====
//             doc
//                 .fontSize(16)
//                 .fillColor(primaryColor)
//                 .text("👤 Customer Info", { underline: true });

//             doc
//                 .moveDown(0.5)
//                 .fontSize(14)
//                 .fillColor(labelColor)
//                 .text("Name:", { continued: true })
//                 .fillColor(textColor)
//                 .text(` ${invoiceData.userName}`);

//             doc.moveDown();

//             // ==== Section 3: Tour Details ====
//             doc
//                 .fontSize(16)
//                 .fillColor(primaryColor)
//                 .text("🗺️ Tour Details", { underline: true });

//             doc
//                 .moveDown(0.5)
//                 .fontSize(14)
//                 .fillColor(labelColor)
//                 .text("Tour Title:", { continued: true })
//                 .fillColor(textColor)
//                 .text(` ${invoiceData.tourTitle}`);

//             doc
//                 .fillColor(labelColor)
//                 .text("Guest Count:", { continued: true })
//                 .fillColor(textColor)
//                 .text(` ${invoiceData.guestCount}`);

//             doc.moveDown();

//             // ==== Section 4: Payment Info ====
//             doc
//                 .fontSize(16)
//                 .fillColor(primaryColor)
//                 .text("💳 Payment Summary", { underline: true });

//             doc
//                 .moveDown(0.5)
//                 .fontSize(14)
//                 .fillColor(labelColor)
//                 .text("Total Amount:", { continued: true })
//                 .fillColor("#27ae60")
//                 .text(` $${invoiceData.totalAmount.toFixed(2)}`, { continued: false });

//             doc.moveDown(2);

//             // ==== Footer ====
//             doc
//                 .fontSize(12)
//                 .fillColor("#888")
//                 .text("Thank you for booking with us!", { align: "center" })
//                 .moveDown(0.5)
//                 .fontSize(10)
//                 .text("For inquiries, contact support@yourdomain.com", {
//                     align: "center",
//                 });

//             doc.end();
//         });
//     } catch (error: any) {
//         console.log(error);
//         throw new AppError(401, `Pdf creation error ${error.message}`);
//     }
// };

// GROK
// import PDFDocument from "pdfkit";
// import AppError from "../errorHelpers/AppError";

// export interface IInvoiceData {
//     transactionId: string;
//     bookingDate: Date;
//     userName: string;
//     tourTitle: string;
//     guestCount: number;
//     totalAmount: number;
// }

// export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
//     try {
//         return new Promise((resolve, reject) => {
//             const doc = new PDFDocument({ size: 'A4', margin: 40 });
//             const buffer: Uint8Array[] = [];

//             doc.on("data", (chunk) => buffer.push(chunk));
//             doc.on("end", () => resolve(Buffer.concat(buffer)));
//             doc.on("error", (err) => reject(err));

//             // Register fonts (assuming default PDFKit fonts or available fonts)
//             doc.registerFont('Bold', 'Helvetica-Bold');
//             doc.registerFont('Regular', 'Helvetica');
//             doc.registerFont('Oblique', 'Helvetica-Oblique');

//             // Colors
//             const primaryColor = '#1E3A8A'; // Deep Blue
//             const secondaryColor = '#E5E7EB'; // Light Gray
//             const textColor = '#111827'; // Dark Gray

//             // Header
//             doc.rect(0, 0, 595, 80).fill(primaryColor);
//             doc.font('Bold').fontSize(24).fillColor('#FFFFFF').text('Travel Co.', 40, 25);
//             doc.font('Regular').fontSize(12).fillColor('#FFFFFF').text('Your Trusted Travel Partner', 40, 55);

//             // Invoice Title and Details
//             doc.font('Bold').fontSize(20).fillColor(textColor).text('Invoice', 400, 30, { align: 'right' });
//             doc.font('Regular').fontSize(10).fillColor('#FFFFFF');
//             doc.text(`Transaction ID: ${invoiceData.transactionId}`, 400, 50, { align: 'right' });
//             doc.text(`Date: ${invoiceData.bookingDate.toLocaleDateString()}`, 400, 65, { align: 'right' });

//             // Customer Info Section
//             doc.moveDown(3);
//             doc.rect(40, doc.y, 515, 30).fill(secondaryColor);
//             doc.font('Bold').fontSize(12).fillColor(textColor).text('Customer Information', 50, doc.y + 10);
//             doc.moveDown(0.5);
//             doc.font('Regular').fontSize(10);
//             doc.text(`Name: ${invoiceData.userName}`, 50, doc.y + 10);
//             doc.moveDown(1);

//             // Invoice Details Table
//             const tableTop = doc.y;
//             const tableWidth = 515;
//             const col1 = 50;
//             const col2 = 300;
//             const col3 = 400;

//             // Table Header
//             doc.rect(40, tableTop, tableWidth, 25).fill(primaryColor);
//             doc.font('Bold').fontSize(10).fillColor('#FFFFFF');
//             doc.text('Description', col1, tableTop + 8);
//             doc.text('Guests', col2, tableTop + 8);
//             doc.text('Amount', col3, tableTop + 8);

//             // Table Row
//             const rowTop = tableTop + 25;
//             doc.rect(40, rowTop, tableWidth, 25).fill('#FFFFFF').stroke(secondaryColor);
//             doc.font('Regular').fontSize(10).fillColor(textColor);
//             doc.text(invoiceData.tourTitle, col1, rowTop + 8);
//             doc.text(invoiceData.guestCount.toString(), col2, rowTop + 8);
//             doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, col3, rowTop + 8);

//             // Table Footer (Total)
//             const footerTop = rowTop + 25;
//             doc.rect(40, footerTop, tableWidth, 25).fill(secondaryColor);
//             doc.font('Bold').fontSize(10).fillColor(textColor);
//             doc.text('Total', col2, footerTop + 8);
//             doc.text(`$${invoiceData.totalAmount.toFixed(2)}`, col3, footerTop + 8);

//             // Thank You Note
//             doc.moveDown(3);
//             doc.font('Oblique').fontSize(12).fillColor(textColor);
//             doc.text('Thank you for booking with us!', { align: 'center' });

//             // Footer
//             const footerY = 750;
//             doc.rect(0, footerY, 595, 92).fill(primaryColor);
//             doc.font('Regular').fontSize(10).fillColor('#FFFFFF');
//             doc.text('Travel Co. | 123 Adventure Lane, Wanderlust City', 40, footerY + 20);
//             doc.text('Email: support@travelco.com | Phone: (123) 456-7890', 40, footerY + 35);
//             doc.text('Website: www.travelco.com', 40, footerY + 50);

//             doc.end();
//         });
//     } catch (error: any) {
//         console.log(error);
//         throw new AppError(401, `PDF creation error: ${error.message}`);
//     }
// };

// DEEPSEEK
/* eslint-disable @typescript-eslint/no-explicit-any */
// import PDFDocument from "pdfkit";
// import AppError from "../errorHelpers/AppError";

// export interface IInvoiceData {
//     transactionId: string;
//     bookingDate: Date;
//     userName: string;
//     userEmail?: string;
//     tourTitle: string;
//     guestCount: number;
//     totalAmount: number;
//     companyName?: string;
//     companyLogo?: string; // Base64 encoded image
//     companyAddress?: string;
//     companyPhone?: string;
// }

// export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer> => {
//     try {
//         return new Promise((resolve, reject) => {
//             // Document setup with better margins
//             const doc = new PDFDocument({
//                 size: 'A4',
//                 margin: 50,
//                 bufferPages: true
//             });

//             const buffers: Uint8Array[] = [];

//             doc.on("data", (chunk) => buffers.push(chunk));
//             doc.on("end", () => resolve(Buffer.concat(buffers)));
//             doc.on("error", (err) => reject(err));

//             // Colors
//             const primaryColor = '#3498db';
//             const secondaryColor = '#7f8c8d';
//             const accentColor = '#e74c3c';
//             const lightGray = '#f5f5f5';
//             const darkGray = '#333333';

//             // Header
//             if (invoiceData.companyLogo) {
//                 doc.image(invoiceData.companyLogo, 50, 45, { width: 100 });
//             } else {
//                 doc.fontSize(20)
//                     .fillColor(primaryColor)
//                     .text(invoiceData.companyName || 'Travel Booking', 50, 50);
//             }

//             // Invoice title and details
//             doc.fontSize(10)
//                 .fillColor(secondaryColor)
//                 .text('INVOICE', 450, 50, { align: 'right' })
//                 .text(`#${invoiceData.transactionId}`, 450, 65, { align: 'right' })
//                 .text(`Date: ${formatDate(invoiceData.bookingDate)}`, 450, 80, { align: 'right' });

//             // Divider
//             doc.moveTo(50, 120)
//                 .lineTo(550, 120)
//                 .lineWidth(1)
//                 .strokeColor(lightGray)
//                 .stroke();

//             // Customer information
//             doc.fontSize(12)
//                 .fillColor(darkGray)
//                 .text('BILLED TO:', 50, 140)
//                 .fontSize(10)
//                 .fillColor(secondaryColor)
//                 .text(invoiceData.userName, 50, 160);

//             if (invoiceData.userEmail) {
//                 doc.text(invoiceData.userEmail, 50, 175);
//             }

//             // Invoice summary
//             const summaryTop = 140;

//             doc.fontSize(12)
//                 .fillColor(darkGray)
//                 .text('INVOICE SUMMARY', 380, summaryTop)
//                 .moveTo(380, summaryTop + 20)
//                 .lineTo(550, summaryTop + 20)
//                 .stroke();

//             // Summary items
//             doc.fontSize(10)
//                 .fillColor(secondaryColor)
//                 .text('Tour Package:', 380, summaryTop + 30)
//                 .text(invoiceData.tourTitle, { align: 'right' })
//                 .moveDown(0.5)
//                 .text('Guests:', 380)
//                 .text(invoiceData.guestCount.toString(), { align: 'right' })
//                 .moveDown(0.5)
//                 .text('Booking Date:', 380)
//                 .text(formatDate(invoiceData.bookingDate), { align: 'right' });

//             // Items table header
//             const itemsTop = 260;

//             doc.fontSize(12)
//                 .fillColor(darkGray)
//                 .text('BOOKING DETAILS', 50, itemsTop)
//                 .moveTo(50, itemsTop + 20)
//                 .lineTo(550, itemsTop + 20)
//                 .stroke();

//             // Table header
//             doc.fontSize(10)
//                 .fillColor(primaryColor)
//                 .text('Description', 50, itemsTop + 30)
//                 .text('Quantity', 400, itemsTop + 30)
//                 .text('Amount', 500, itemsTop + 30, { align: 'right' });

//             // Table row
//             doc.fontSize(10)
//                 .fillColor(darkGray)
//                 .text(invoiceData.tourTitle, 50, itemsTop + 50)
//                 .text(invoiceData.guestCount.toString(), 400, itemsTop + 50)
//                 .text(`$${invoiceData.totalAmount.toFixed(2)}`, 500, itemsTop + 50, { align: 'right' });

//             // Divider
//             doc.moveTo(50, itemsTop + 70)
//                 .lineTo(550, itemsTop + 70)
//                 .stroke();

//             // Total
//             doc.fontSize(12)
//                 .fillColor(darkGray)
//                 .text('Total:', 400, itemsTop + 90)
//                 .fontSize(14)
//                 .fillColor(accentColor)
//                 .text(`$${invoiceData.totalAmount.toFixed(2)}`, 500, itemsTop + 90, { align: 'right' });

//             // Footer
//             const footerY = 750;

//             doc.fontSize(10)
//                 .fillColor(secondaryColor)
//                 .text('Thank you for your booking!', 50, footerY, { align: 'center' })
//                 .text('If you have any questions, please contact us at:', 50, footerY + 20, { align: 'center' })
//                 .text(invoiceData.companyPhone || 'support@example.com', 50, footerY + 35, { align: 'center' })
//                 .text(invoiceData.companyName || 'Travel Booking Co.', 50, footerY + 60, { align: 'center' });

//             // Page numbers
//             doc.fontSize(8)
//                 .fillColor(secondaryColor)
//                 .text(`Page ${doc.bufferedPageRange().count}`, 50, 780, { align: 'center' });

//             doc.end();
//         });
//     } catch (error: any) {
//         console.error('PDF generation error:', error);
//         throw new AppError(500, `PDF creation error: ${error.message}`);
//     }
// };

// // Helper function to format dates
// function formatDate(date: Date): string {
//     return new Intl.DateTimeFormat('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     }).format(date);
// }