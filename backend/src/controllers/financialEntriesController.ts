import {CustomRequest} from "../types/models/Request";
import {NextFunction, Response} from "express";
import {AddFinancialEntryBody} from "../types/models/IncomeEntries";
import {incomeEntriesValidator} from "../utils/validators/incomeEntriesValidator";
import {BodyFieldsValidationError, createMongoDBError, NotFoundError} from "../utils/errors/AppError";
import FinancialEntry from "../models/FinancialEntry";
import Category from "../models/Category";
import mongoose from "mongoose";

const addFinancialEntry = async (req: CustomRequest<AddFinancialEntryBody>, res: Response, next: NextFunction) => {
    const {description, name, amount, date, type, currency, categoryId} = req.body;
    const invalidFields = incomeEntriesValidator(req.body);
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
            currency,
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
const updateFinancialEntry = async (req: CustomRequest<unknown>, res: Response, next: NextFunction) => {
};
const deleteFinancialEntry = async (req: CustomRequest<unknown>, res: Response, next: NextFunction) => {
};
const getFinancialEntry = async (req: CustomRequest<unknown>, res: Response, next: NextFunction) => {
};
const getFinancialEntries = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const query = req.query;
    const filter = query.filter as string || '';
    const aggregateORMatch: any[] = [{}];
    const financialEntries = await FinancialEntry.aggregate([
        {
            '$match': {
                $and: [
                    {userId: new mongoose.Types.ObjectId(req.user.id)},
                ],
                $or: aggregateORMatch
            },
        },
        {
            '$sort': {
                name: 1
            }
        },
        {
            '$group': {
                _id: '$name',
                totalCount: {$sum: '$amount' }
            }
        },
    ]).lookup({
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categories'
    });
    res.status(200).json({
        status: 'success',
        financialEntries
    })
};

export {
    addFinancialEntry,
    updateFinancialEntry,
    deleteFinancialEntry,
    getFinancialEntry,
    getFinancialEntries
}