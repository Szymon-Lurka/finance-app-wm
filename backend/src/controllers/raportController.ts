import {CustomRequest} from "../types/models/Request";
import {NextFunction, Response} from "express";
import {RaportsBalanceQuery} from "../types/models/Raports";
import mongoose from "mongoose";
import dayjs from "dayjs";
import FinancialEntry from "../models/FinancialEntry";

const getBalance = async (req: CustomRequest<{}, {}, RaportsBalanceQuery>, res: Response, next: NextFunction) => {
    const userID = req.user.id;
    const {dateFrom = dayjs().subtract(7, 'd'), dateTo = dayjs(), type} = req.query;
    console.log(dayjs(dateFrom).toISOString());
    const matchStage = {
        $match: {
            $and: [
                {
                    userId: new mongoose.Types.ObjectId(userID),
                },
                {
                    date: {$gte: dayjs(dateFrom).toISOString()},
                },
                {
                    date: {$lte: dayjs(dateTo).toISOString()}
                },
                type ? {type} : {}
            ],
        }
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
                diffEntries: [
                    {
                        $group: {
                            _id: '$type',
                            totalAmount: {$sum: '$amount'}
                        }
                    }
                ]
            }
        }
    ];

    const [result] = await FinancialEntry.aggregate(aggregationPipeline);
    console.log(result.diffEntries);
    const {results, sumAmount, diffEntries} = result;
    const totalAmount = sumAmount.length > 0 ? sumAmount[0].totalAmount : 0;
    const entries = results;

    res.status(200).json({
        status: 'success',
        entries,
        totalAmount,
        diffEntries
    })
};

export {
    getBalance
}