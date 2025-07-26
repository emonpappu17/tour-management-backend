// /* eslint-disable @typescript-eslint/no-explicit-any */
// // Frontend -> Form Data with Image File -> Multer -> Form data -> Req (Body + File)
// // Amader folder -> image -> form data -> File -> Multer -> Amader project / pc te Nijer ekta folder(temporary) -> Req.file
// //req.file -> cloudinary(req.file) -> url -> mongoose -> mongodb

// import { v2 as cloudinary } from 'cloudinary';
// import { envVars } from './env';
// import AppError from '../errorHelpers/AppError';
// import stream from "stream";

// export interface ICloudinaryResult {
//     url: string,
//     secure_url: string,
//     asset_folder: string,
//     display_name: string,
//     original_filename: string,
// }


// cloudinary.config({
//     cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
//     api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
//     api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
// })

// export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
//     try {
//         return new Promise((resolve, reject) => {
//             const public_id = `pdf/${fileName}-${Date.now()}`

//             const bufferStream = new stream.PassThrough();

//             bufferStream.end(buffer);

//             cloudinary.uploader.upload_stream(
//                 {
//                     resource_type: "auto",
//                     public_id: public_id,
//                     folder: "pdf"
//                 },
//                 (error, result) => {
//                     if (error) {
//                         return reject(error);
//                     }
//                     resolve(result)
//                 }
//             ).end(buffer)
//         })
//     } catch (error: any) {
//         console.log(error);
//         throw new AppError(401, `Error uploading file ${error.message}`)
//     }
// }

// export const deleteImageFromCloudinary = async (url: string) => {
//     try {
//         // https://res.cloudinary.com/do8p0imvw/image/upload/v1753288063/z1ll6emsx6-1753288057436-bernard-hermant-kqolr8oiqlu-unsplash-jpg.jpg.jpg

//         const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

//         console.log('url===>', url);

//         const match = url.match(regex);

//         console.log("match==>", match);

//         if (match && match[1]) {
//             const public_id = match[1];
//             await cloudinary.uploader.destroy(public_id)
//             console.log(`File ${public_id} is deleted from cloudinary`);
//         }

//     } catch (error: any) {
//         throw new AppError(401, "Cloudinary image deletion failed", error.message)
//     }
// }

// export const cloudinaryUpload = cloudinary;

/* eslint-disable @typescript-eslint/no-explicit-any */

// Frontedn -> Form Data with Image File -> Multer -> Form data -> Req (Body + File)

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import stream from "stream";
import AppError from "../errorHelpers/AppError";
import { envVars } from "./env";

// Amader folder -> image -> form data -> File -> Multer -> Amader project / pc te Nijer ekta folder(temporary) -> Req.file

//req.file -> cloudinary(req.file) -> url -> mongoose -> mongodb


cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})

export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
    try {
        return new Promise((resolve, reject) => {

            const public_id = `pdf/${fileName}-${Date.now()}`

            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer)

            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    public_id: public_id,
                    folder: "pdf"
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result)
                }
            ).end(buffer)


        })

    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `Error uploading file ${error.message}`)
    }
}

export const deleteImageFromCLoudinary = async (url: string) => {
    try {
        //https://res.cloudinary.com/djzppynpk/image/upload/v1753126572/ay9roxiv8ue-1753126570086-download-2-jpg.jpg.jpg

        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

        const match = url.match(regex);

        console.log({ match });

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            console.log(`File ${public_id} is deleted from cloudinary`);

        }
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletion failed", error.message)
    }
}

export const cloudinaryUpload = cloudinary



// const uploadToCloudinary = cloudinary.uploader.upload()

//

//Multer storage cloudinary
//Amader folder -> image -> form data -> File -> Multer -> storage in cloudinary -> url ->  req.file  -> url  -> mongoose -> mongodb