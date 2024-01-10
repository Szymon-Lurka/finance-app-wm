import {CustomRequest} from "../types/models/Request";
import {NextFunction, Response} from "express";
import type {
    AddFinancialEntryBody,
    GetFinancialEntriesQuery,
    UpdateFinancialEntryBody
} from "../types/models/FinancialEntries";
import {financialEntriesValidator, updateFinancialEntryValidator} from "../utils/validators/financialEntriesValidator";
import {BodyFieldsValidationError, createMongoDBError, NotFoundError} from "../utils/errors/AppError";
import FinancialEntry from "../models/FinancialEntry";
import Category from "../models/Category";
import mongoose from "mongoose";
import {getFacets, getMatchFilters} from "../utils/api/aggregateFeatures";
import {getNow} from "../utils/date/DateUtils";

const addFinancialEntry = async (req: CustomRequest<{}, AddFinancialEntryBody>, res: Response, next: NextFunction) => {
    const {description, name, amount, date, type, categoryId} = req.body;
    const invalidFields = financialEntriesValidator(req.body);
    if (invalidFields.length > 0) {
        return next(new BodyFieldsValidationError('Add financial entry wrong data', invalidFields));
    }
    let category;
    if (categoryId) {
        category = Category.findOne({_id: categoryId, userId: req.user.id})
    }
    if (categoryId && !category) {
        return next(new NotFoundError('Category does not exists - add financial entry', 'Category does not exists'))
    }
    let financialEntry;
    try {
        financialEntry = new FinancialEntry({
            description,
            name,
            amount,
            userId: req.user.id,
            date,
            type,
            categoryId
        })
        await financialEntry.save();
    } catch (e) {
        return next(createMongoDBError(e))
    }
    res.status(201).json({
        status: 'created',
        message: 'Added new entry',
        data: {
            financialEntry
        }
    })
};
const updateFinancialEntry = async (req: CustomRequest<{
    id: string;
}, UpdateFinancialEntryBody>, res: Response, next: NextFunction) => {
    const entryID = req.params.id;
    const invalidFields = updateFinancialEntryValidator(req.body);
    if (invalidFields.length > 0) {
        return next(new BodyFieldsValidationError('Update financial entry wrong data', invalidFields));
    }
    const {
        categoryId,
    } = req.body;

    let category;
    if (categoryId) {
        category = await Category.findOne({_id: new mongoose.Types.ObjectId(categoryId), userId: req.user.id})
    }
    if (categoryId && !category) {
        return next(new NotFoundError('Category does not exists - update financial entry', 'Category does not exists'))
    }

    await FinancialEntry.findOneAndUpdate({_id: entryID}, {...req.body, updatedAt: getNow()});
    res.status(210).json({
        status: 'success',
        message: 'Successfully updated financial entry'
    })
};
const deleteFinancialEntry = async (req: CustomRequest<unknown>, res: Response, next: NextFunction) => {
};
const getFinancialEntry = async (req: CustomRequest<{ id: string; }>, res: Response, next: NextFunction) => {
    const financialEntryID = req.params.id;
    const entry = await FinancialEntry.aggregate([
        {
            $match: {
                $and: [
                    {userId: new mongoose.Types.ObjectId(req.user.id)},
                    {_id: new mongoose.Types.ObjectId(financialEntryID)}
                ]
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'categories'
            }
        },
        {
            $unwind: {path: '$categories', preserveNullAndEmptyArrays: true}
        },
    ]);
    if (!entry) {
        return next(new NotFoundError('Not found financial entry', 'Not found financial entry with provided ID'))
    }
    res.status(200).json({
        status: 'success',
        entry
    })
};
const getFinancialEntries = async (req: CustomRequest<{}, {}, GetFinancialEntriesQuery>, res: Response, next: NextFunction) => {
    const {
        page = '1',
        pageSize = '10',
        sortOrder = '-1',
        sortParameter
    } = req.query;

    const filters = getMatchFilters({
        ...req.query
    }, {
        searchText: ['name', 'description'],
        amountFrom: ['amount'],
        amountTo: ['amount'],
        type: ['type'],
        categoryId: 'categoryId'
    }) as any;

    const facets = getFacets({
        pageSize,
        page,
        sortOrder,
        fields: {
            name: 1,
            description: 1,
            date: 1,
            amount: 1,
            type: 1,
            'categories.name': 1,
            'categories._id': 1,
            'categories.description': 1,
            'categories.color': 1,
        },
        sortParameter,
    })


    const matchFilters: any = {
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
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'categories'
            }
        },
        {
            $unwind: {path: '$categories', preserveNullAndEmptyArrays: true}
        },
        {
            $facet: {
                ...facets,
                sumAmount: [
                    {
                        $group: {
                            _id: null,
                            totalAmount: {$sum: '$amount'}
                        }
                    }
                ]
            }
        },
    ]

    const [result] = await FinancialEntry.aggregate(aggregationPipeline);
    const {paginatedResults, totalCount, sumAmount} = result;

    const totalAmount = sumAmount.length > 0 ? sumAmount[0].totalAmount : 0;
    const total = totalCount.length > 0 ? totalCount[0].count : 0;
    const totalPages = Math.ceil(total / parseInt(pageSize));

    res.status(200).json({
        status: 'success',
        results: paginatedResults,
        totalPages,
        totalCount: total,
        currentPage: Number(page),
        totalAmount
    })
};

export {
    addFinancialEntry,
    updateFinancialEntry,
    deleteFinancialEntry,
    getFinancialEntry,
    getFinancialEntries
}