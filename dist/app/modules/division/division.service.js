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
exports.DivisionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_model_1 = require("../tour/tour.model");
const division_constant_1 = require("./division.constant");
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findOne({ name: payload.name });
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
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const getAllDivisions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const divisionsData = queryBuilder
        .search(division_constant_1.divisionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        divisionsData.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const existingDivision = yield division_model_1.Division.findById(id).session(session);
        if (!existingDivision)
            throw new Error("Division not found.");
        const duplicateDivision = yield division_model_1.Division.findOne({
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
        const updateDivision = yield division_model_1.Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).session(session);
        if (payload.thumbnail && existingDivision.thumbnail) {
            yield (0, cloudinary_config_1.deleteImageFromCloudinary)(existingDivision.thumbnail);
        }
        yield session.endSession();
        session.commitTransaction();
        return updateDivision;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug });
    return {
        data: division,
    };
});
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUsed = yield tour_model_1.Tour.exists({ division: id });
    if (isUsed)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot delete division — it's still used in tours");
    yield division_model_1.Division.findByIdAndDelete(id);
    return null;
});
exports.DivisionService = {
    createDivision,
    getAllDivisions,
    updateDivision,
    getSingleDivision,
    deleteDivision
};
