import {CustomRequest} from "../types/models/Request";
import {NextFunction, Response} from "express";
import {RaportsBalanceQuery} from "../types/models/Raports";
import mongoose from "mongoose";
import dayjs from "dayjs";
import FinancialEntry from "../models/FinancialEntry";

const getBalance = async (req: CustomRequest<{}, {}, RaportsBalanceQuery>, res: Response, next: NextFunction) => {
    const userID = req.user.id;
    const {dateFrom, dateTo, type} = req.query;
    const matchStage = {
        $match: {
            $and: [
                {
                    userId: new mongoose.Types.ObjectId(userID),
                },
                dateFrom ? {date: {$gte: dayjs(dateFrom).toISOString()}} : {},
                dateTo ? {date: {$lte: dayjs(dateTo).toISOString()}} : {},
                type ? {type} : {}
            ],
        }
    }
    if (dateFrom) {
        matchStage.$match.$and.push({})
    }
    if (dateTo) {
        matchStage.$match.$and.push({})
    }

    const aggregationPipeline = [
        matchStage,
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
                results: [
                    {
                        $project: {
                            name: 1,
                            amount: 1,
                            date: 1,
                            type: 1,
                            'categories.name': 1,
                            'categories.color': 1,
                            'categories._id': 1
                        }
                    }
                ],
                sumAmount: [
                    {
                        $group: {
                            _id: null,
                            totalAmount: {$sum: '$amount'}
                        }
                    }
                ],
                categoriesAmounts: [
                    {
                        $group: {
                            _id: {
                                category: '$categories.name',
                                color: '$categories.color'
                            },
                            totalAmount: {$sum: '$amount'}
                        }
                    }
                ],
                categoriesExpenseIncome: [
                    {
                        $group: {
                            _id: {
                                type: '$type',
                                category: '$categories.name',
                                color: '$categories.color'
                            },
                            totalAmount: {$sum: '$amount'}
                        }
                    }
                ],
                categoriesDates: [
                    {
                        $group: {
                            _id: {
                                date: '$date',
                                category: '$categories.name',
                                color: '$categories.color'
                            },
                            totalAmount: {$sum: "$amount"}
                        }
                    }
                ],
                categoriesTotalIncomeExpense: [
                    {
                        $group: {
                            _id: '$categories.name',
                            totalIncome: {
                                $sum: {
                                    $cond: {if: {$eq: ['$type', 'income']}, then: '$amount', else: 0}
                                }
                            },
                            totalExpense: {
                                $sum: {
                                    $cond: {if: {$eq: ['$type', 'expense']}, then: '$amount', else: 0}
                                }
                            }
                        }
                    }
                ],
                diffEntries: [
                    {
                        $group: {
                            _id: '$type',
                            totalAmount: {$sum: '$amount'}
                        }
                    }
                ],
            }
        }
    ];

    const [result] = await FinancialEntry.aggregate(aggregationPipeline);
    const {
        results,
        sumAmount,
        categoriesAmounts,
        categoriesExpenseIncome,
        categoriesDates,
        categoriesTotalIncomeExpense,
        diffEntries
    } = result;
    const totalAmount = sumAmount.length > 0 ? sumAmount[0].totalAmount : 0;
    const entries = results;

    res.status(200).json({
        status: 'success',
        diffEntries,
        entries,
        totalAmount: totalAmount.toFixed(2),
        categoriesAmounts,
        categoriesExpenseIncome,
        categoriesTotalIncomeExpense,
        categoriesDates
    })
};

export {
    getBalance
}