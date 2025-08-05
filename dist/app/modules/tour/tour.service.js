"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourService = void 0;
const tour_contant_1 = require("./tour.contant");
const tour_model_1 = require("./tour.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const contants_1 = require("../../contants");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("../booking/booking.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
/* --------------------- TOUR TYPE SERVICE ---------------------- */
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    return yield tour_model_1.TourType.create(payload);
});
const getAllTourTypes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.TourType.find(), query);
    const tourTypes = queryBuilder.search(tour_contant_1.tourTypeSearchableFields).filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        tourTypes.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findById(id);
    return {
        data: tourType
    };
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType)
        throw new Error("Tour type not found.");
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUsed = yield tour_model_1.Tour.exists({ tourType: id });
    if (isUsed)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot delete tourType — it's still used in tours");
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType)
        throw new Error("Tour type not found.");
    return yield tour_model_1.TourType.findByIdAndDelete(id);
});
/* --------------------- TOUR SERVICE ---------------------- */
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new Error("A tour with this title already exists.");
    const existingTour = yield tour_model_1.Tour.findOne({ title: payload.title });
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
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const getAllToursOld = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('query ====>', query);
    const filter = query;
    const searchTerm = query.searchTerm || "";
    const sort = query.sort || "-createdAt";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    // field filtering
    const fields = ((_a = query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
    // delete filter["searchTerm"]
    // delete filter["sort"]
    for (const field of contants_1.excludeField) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field];
    }
    const searchQuery = {
        $or: tour_contant_1.tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
    };
    // const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);
    const filterQuery = tour_model_1.Tour.find(filter);
    const tours = filterQuery.find(searchQuery);
    const allTours = yield tours.sort(sort).select(fields).skip(skip).limit(limit);
    const totalTours = yield tour_model_1.Tour.countDocuments();
    const totalPage = Math.ceil(totalTours / limit);
    const meta = {
        page: page,
        limit: limit,
        total: totalTours,
        totalPage: totalPage
    };
    return {
        data: allTours,
        meta: meta
    };
});
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = queryBuilder
        .search(tour_contant_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
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
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter(imageUrl => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatedPayloadImages];
        // payload.images = [...restDBImages, ...(payload.images || [])]
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true });
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findOne({ slug });
    if (!tour)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour not Found");
    return {
        date: tour
    };
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found.");
    }
    const isUsed = yield booking_model_1.Booking.exists({ tour: id });
    if (isUsed)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot delete Tour — it's still used in booking");
    return yield tour_model_1.Tour.findByIdAndDelete(id);
});
exports.TourService = {
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
};
