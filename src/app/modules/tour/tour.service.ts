import { ITour, ITourType } from "./tour.interface"
import { Tour, TourType } from "./tour.model"
/* --------------------- TOUR TYPE SERVICE ---------------------- */
const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create(payload);
}

const getAllTourTypes = async () => {
    return await TourType.find();
}

const updateTourType = async (id: string, payload: ITourType) => {

    const existingTourType = await TourType.findById(id);

    if (!existingTourType) throw new Error("Tour type not found.");

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });

    return updatedTourType;
}

const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) throw new Error("Tour type not found.");

    return await TourType.findByIdAndDelete(id);
}

/* --------------------- TOUR SERVICE ---------------------- */
const createTour = async (payload: ITour) => {

    console.log('payload tour===>', payload);

    const existingTour = await Tour.findOne({ title: payload.title });

    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    const baseSlug = payload.title.toLocaleLowerCase().split(" ").join('-')
    let slug = ` ${baseSlug}-division`

    let counter = 0;
    while (await Tour.exists({ slug })) {
        slug = `${slug}-${counter++}`
    }

    payload.slug = slug;

    const tour = await Tour.create(payload);

    return tour;
}

export const TourService = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
    createTour
}