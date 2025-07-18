import { ITourType } from "./tour.interface"
import { TourType } from "./tour.model"

const createTourType = async (payload: ITourType) => {
    console.log('payload====>', payload);
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create(payload);
}

const getAllTourTypes = async () => {
    return await TourType.find();
}

export const TourService = {
    createTourType,
    getAllTourTypes
}