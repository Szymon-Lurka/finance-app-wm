import {CustomRequest} from "../types/models/Request";
import {NextFunction, Response, Request} from "express";
import type {AddCategoryBody, UpdateCategoryBody} from "../types/models/Category";
import {validateCategoryBody} from "../utils/validators/categoryValidators";
import {BodyFieldsValidationError, createMongoDBError, NotFoundError} from "../utils/errors/AppError";
import Category from "../models/Category";
import {ApiFeatures} from "../utils/api/apiFeatures";

const addCategory = async (req: CustomRequest<AddCategoryBody>, res: Response, next: NextFunction) => {
    const {description, name, color} = req.body;
    const invalidFields = validateCategoryBody({
        description,
        name,
        color
    });
    if (invalidFields.length > 0) {
        return next(new BodyFieldsValidationError('Add category wrong data', invalidFields))
    }
    let category
    try {
        category = new Category({description, name, color, userId: req.user.id});
        await category.save();
    } catch (e) {
        next(createMongoDBError(e));
    }
    res.status(201).json({
        status: 'created',
        message: 'Added new category',
        data: {
            category
        }
    })
};
const updateCategory = async (req: CustomRequest<UpdateCategoryBody>, res: Response, next: NextFunction) => {
    const categoryID = req.params.id;
    const {description, name, color} = req.body;
    let category;
    try {
        category = await Category.findOneAndUpdate({_id: categoryID}, {description, name, color});
    } catch (e) {
        return next(createMongoDBError(e));
    }
    res.status(200).json({
        status: 'success',
        message: 'Successfully update category',
        updatedCategory: category
    })
};
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categoryID = req.params.id;
    const category = await Category.findOneAndDelete({_id: categoryID});
    if (!category) {
        return res.status(200).json({
            status: 'success',
            message: 'Category not exists.'
        })
    }
    res.status(410).json({
        status: 'success',
        message: 'Successfully deleted category',
        deletedCategory: category
    })
};
const getCategory = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const categoryID = req.params.id;
    const category = await Category.findOne({_id: categoryID, userId: req.user.id})
    if (!category) {
        return next(new NotFoundError('Not found category', 'Not found category with provided ID'))
    }
    res.status(200).json({
        status: 'success',
        category
    })
};

const getCategories = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const counter = await Category.countDocuments({userId: req.user.id});
    const features = new ApiFeatures(Category.find({userId: req.user.id}), req.query as any)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const categories = await features.query;
    res.status(200).json({
        status: 'success',
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        categories
    })
}

export {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategories
}