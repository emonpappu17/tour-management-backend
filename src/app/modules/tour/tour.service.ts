import { tourSearchableFields, tourTypeSearchableFields } from "./tour.contant";
import { ITour, ITourType } from "./tour.interface"
import { Tour, TourType } from "./tour.model"
import { QueryBuilder } from "../../utils/QueryBuilder";
import { excludeField } from "../../contants";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { Booking } from "../booking/booking.model";

/* --------------------- TOUR TYPE SERVICE ---------------------- */
const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create(payload);
}

const getAllTourTypes = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(TourType.find(), query);

    const tourTypes = queryBuilder.search(tourTypeSearchableFields).filter().sort().fields().paginate()

    const [data, meta] = await Promise.all([
        tourTypes.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleTourType = async (id: string) => {
    const tourType = await TourType.findById(id);
    return {
        data: tourType
    };
};

const updateTourType = async (id: string, payload: ITourType) => {

    const existingTourType = await TourType.findById(id);

    if (!existingTourType) throw new Error("Tour type not found.");

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });

    return updatedTourType;
}

const deleteTourType = async (id: string) => {

    const isUsed = await Tour.exists({ tourType: id });

    if (isUsed) throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete tourType — it's still used in tours");

    const existingTourType = await TourType.findById(id);

    if (!existingTourType) throw new Error("Tour type not found.");

    return await TourType.findByIdAndDelete(id);
}

/* --------------------- TOUR SERVICE ---------------------- */
const createTour = async (payload: ITour) => {

    const existingTour = await Tour.findOne({ title: payload.title });

    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    // const baseSlug = payload.title.toLocaleLowerCase().split(" ").join('-')
    // let slug = ` ${baseSlug}`

    // let counter = 0;
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }

    // payload.slug = slug;

    const tour = await Tour.create(payload);

    return tour;
}

const getAllToursOld = async (query: Record<string, string>) => {

    console.log('query ====>', query);

    const filter = query;

    const searchTerm = query.searchTerm || "";

    const sort = query.sort || "-createdAt";

    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    // field filtering
    const fields = query.fields?.split(",").join(" ") || "";

    // delete filter["searchTerm"]
    // delete filter["sort"]

    for (const field of excludeField) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field]
    }

    const searchQuery = {
        $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
    }

    // const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);

    const filterQuery = Tour.find(filter)

    const tours = filterQuery.find(searchQuery)

    const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)

    const totalTours = await Tour.countDocuments();

    const totalPage = Math.ceil(totalTours / limit)

    const meta = {
        page: page,
        limit: limit,
        total: totalTours,
        totalPage: totalPage
    }

    return {
        data: allTours,
        meta: meta
    }
}

const getAllTours = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Tour.find(), query);

    const tours = queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    // if (payload.title) {
    //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}`

    //     let counter = 0;
    //     while (await Tour.exists({ slug })) {
    //         slug = `${slug}-${counter++}`
    //     }

    //     payload.slug = slug
    // }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true })

    return updatedTour;
}

const getSingleTour = async (slug: string) => {
    const tour = await Tour.findOne({ slug });

    if (!tour) throw new AppError(httpStatus.NOT_FOUND, "Tour not Found")

    return {
        date: tour
    }
}

const deleteTour = async (id: string) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    const isUsed = await Booking.exists({ tour: id });

    if (isUsed) throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete Tour — it's still used in booking");

    return await Tour.findByIdAndDelete(id);
}

export const TourService = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    getSingleTourType,
    deleteTourType,
    createTour,
    getAllTours,
    updateTour,
    getAllToursOld,
    getSingleTour,
    deleteTour
}