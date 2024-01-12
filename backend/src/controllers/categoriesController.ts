import {CustomRequest} from "../types/models/Request";
import {NextFunction, Response, Request} from "express";
import type {AddCategoryBody, UpdateCategoryBody} from "../types/models/Category";
import {validateCategoryBody} from "../utils/validators/categoryValidators";
import {BodyFieldsValidationError, createMongoDBError, NotFoundError} from "../utils/errors/AppError";
import Category from "../models/Category";
import {getFacets, getMatchFilters} from "../utils/api/aggregateFeatures";
import mongoose from "mongoose";
import {GetCategoriesQuery} from "../types/models/Category";
import {getNow} from "../utils/date/DateUtils";

const addCategory = async (req: CustomRequest<{}, AddCategoryBody>, res: Response, next: NextFunction) => {
    const {description, name, color} = req.body;
    const invalidFields = validateCategoryBody(req.body);
    if (invalidFields.length > 0) {
        return next(new BodyFieldsValidationError('Add category wrong data', invalidFields))
    }
    let category
    try {
        category = new Category({description, name, color, userId: req.user.id});
        await category.save();
    } catch (e) {
        return next(createMongoDBError(e));
    }
    res.status(201).json({
        status: 'created',
        message: 'Added new category',
        data: {
            category
        }
    })
};
const updateCategory = async (req: CustomRequest<{
    id: string;
}, UpdateCategoryBody>, res: Response, next: NextFunction) => {
    const categoryID = req.params.id;
    const {description, name, color} = req.body;
    let category;
    try {
        category = await Category.findOneAndUpdate({_id: categoryID}, {description, name, color, updatedAt: getNow()});
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
    res.status(200).json({
        status: 'success',
        message: 'Successfully deleted category',
        deletedCategory: category
    })
};
const getCategory = async (req: CustomRequest<{ id: string; }>, res: Response, next: NextFunction) => {
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

const getCategories = async (req: CustomRequest<{}, {}, GetCategoriesQuery>, res: Response, next: NextFunction) => {
    const {
        page = '1',
        pageSize = '10',
        sortOrder = '-1',
        searchText = '',
        sortParameter,
        getAll
    } = req.query;

    const filters = getMatchFilters({searchText}, {
        searchText: ['name', 'description']
    })

    const facets = getFacets({
        pageSize,
        page,
        sortOrder,
        fields: {
            name: 1,
            description: 1,
            color: 1
        },
        sortParameter,
        getAll: getAll === 'y'
    })

    const matchFilters = {
        $and: [
            {userId: new mongoose.Types.ObjectId(req.user.id)}
        ],
        ...filters
    }
    const aggregationPipeline = [
        {
            $match: matchFilters
        },
        {
            $facet: facets
        }
    ];

    const [result] = await Category.aggregate(aggregationPipeline);
    const {paginatedResults, totalCount} = result;

    const total = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(total / parseInt(pageSize));

    res.status(200).json({
        status: 'success',
        results: paginatedResults,
        totalPages,
        totalCount: total,
        currentPage: Number(page)
    })
}

export {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategories
}