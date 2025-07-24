import mongoose from "mongoose";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Tour } from "../tour/tour.model";
import { divisionSearchableFields } from "./division.constant";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes"

const createDivision = async (payload: IDivision) => {
    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new Error("A division with this name already exists.");
    }

    // const baseSlug = payload.name.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`

    // let counter = 0;
    // while (await Division.exists({ slug })) {
    //     slug = `${slug}-${counter++}` // dhaka-division-2
    // }

    // payload.slug = slug;

    const division = await Division.create(payload);

    return division
}

const getAllDivisions = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Division.find(), query)

    const divisionsData = queryBuilder
        .search(divisionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        divisionsData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const updateDivision = async (id: string, payload: Partial<IDivision>) => {

    // const existingDivision = await Division.findById(id);

    // if (!existingDivision) throw new Error("Division not found.");

    // const duplicateDivision = await Division.findOne({
    //     name: payload.name,
    //     _id: { $ne: id }
    // })

    // if (duplicateDivision) {
    //     throw new Error("A division with this name already exists.");
    // }

    // // if (payload.name) {
    // //     const baseSlug = payload.name.toLowerCase().split(" ").join("-")
    // //     let slug = `${baseSlug}-division`

    // //     let counter = 0;
    // //     while (await Division.exists({ slug })) {
    // //         slug = `${slug}-${counter++}`
    // //     }

    // //     payload.slug = slug;
    // // }

    // const updateDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    // if (payload.thumbnail && existingDivision.thumbnail) {
    //     await deleteImageFromCloudinary(existingDivision.thumbnail)
    // }

    // return updateDivision

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const existingDivision = await Division.findById(id).session(session);

        if (!existingDivision) throw new Error("Division not found.");

        const duplicateDivision = await Division.findOne({
            name: payload.name,
            _id: { $ne: id }
        }).session(session);

        if (duplicateDivision) {
            throw new Error("A division with this name already exists.");
        }

        // if (payload.name) {
        //     const baseSlug = payload.name.toLowerCase().split(" ").join("-")
        //     let slug = `${baseSlug}-division`

        //     let counter = 0;
        //     while (await Division.exists({ slug })) {
        //         slug = `${slug}-${counter++}`
        //     }

        //     payload.slug = slug;
        // }

        const updateDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).session(session);

        if (payload.thumbnail && existingDivision.thumbnail) {
            await deleteImageFromCloudinary(existingDivision.thumbnail)
        }

        await session.endSession();
        session.commitTransaction();

        return updateDivision;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
}




const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return {
        data: division,
    }
}

const deleteDivision = async (id: string) => {

    const isUsed = await Tour.exists({ division: id });

    if (isUsed) throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete division — it's still used in tours");

    await Division.findByIdAndDelete(id);

    return null;
}

export const DivisionService = {
    createDivision,
    getAllDivisions,
    updateDivision,
    getSingleDivision,
    deleteDivision
}