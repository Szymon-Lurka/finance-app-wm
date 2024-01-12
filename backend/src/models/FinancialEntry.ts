import mongoose, {model, Schema} from "mongoose";
import type {FinancialEntryType, IFinancialEntries} from "../types/models/FinancialEntries";
import User from "./User";
import {BaseError, NotFoundError} from "../utils/errors/AppError";
import {HttpStatusCode} from "../types/enums/HttpStatusCode";
import {NextFunction} from "express";
import {getNow} from "../utils/date/DateUtils";
import {EXPENSE, INCOME} from "../constants/financial";

const financialEntrySchema = new Schema<IFinancialEntries>({
    description: {type: String},
    name: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
    amount: {type: Number, required: true},
    date: {type: String},
    type: {type: String, enum: [EXPENSE, INCOME], required: true, default: EXPENSE},
    createdAt: {type: String},
    updatedAt: {type: String}
})
// @ts-ignore
financialEntrySchema.pre('save', async function (next: NextFunction) {
    const now = getNow();
    this.createdAt = now;
    this.updatedAt = now;
    if (this.type === INCOME) {
        this.amount = Math.abs(this.amount)
    } else {
        this.amount = -Math.abs(this.amount)
    }
    next();
})


// @ts-ignore
financialEntrySchema.pre('findOneAndUpdate', async function (next: NextFunction) {
    const update: Partial<{ amount?: number; type?: FinancialEntryType }> = this.getUpdate() as Partial<{
        amount?: number;
        type?: FinancialEntryType;
    }>;
    if (update.amount || update.type) {
        const id = this.getQuery()._id;
        const financialEntry = await this.model.findById(id);
        if (financialEntry) {
            const type = update.type ? update.type : financialEntry.type;
            const isTypeUpdated = !!update.type && update.type !== financialEntry.type;
            if (isTypeUpdated && update.amount) {
                if (type === INCOME) {
                    update.amount = Math.abs(update.amount);
                } else {
                    update.amount = -Math.abs(update.amount);
                }
                update.type = type;
            }
            if (isTypeUpdated && !update.amount) {
                if (type === INCOME) {
                    update.amount = Math.abs(financialEntry.amount);
                } else {
                    update.amount = -Math.abs(financialEntry.amount);
                }
                update.type = type;
            }
        }
    }
    next();
})

const FinancialEntry = model<IFinancialEntries>('FinancialEntry', financialEntrySchema);

export default FinancialEntry;