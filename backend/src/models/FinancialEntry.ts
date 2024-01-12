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
    type: {type: String, enum: [EXPENSE, INCOME], required: true},
    createdAt: {type: String},
    updatedAt: {type: String}
})
const updateUserBalance = async (userID: string, type: FinancialEntryType, amount: number, next: NextFunction, isDeleting = false, double = false) => {
    try {
        const user = await User.findById(userID);
        if (!user) {
            return next(new NotFoundError('Change balance user', 'User not found'))
        }
        if (type === INCOME) {
            if (isDeleting) {
                user.balance -= Math.abs(amount);
            } else {
                user.balance += Math.abs(double ? amount * 2 : amount);
            }
        } else if (type === EXPENSE) {
            if (isDeleting) {
                user.balance += Math.abs(amount);
            } else {
                user.balance -= Math.abs(double ? amount * 2 : amount);
            }
        }
        user.balance = Number(user.balance.toFixed(2));
        await user.save();
    } catch (e) {
        next(new BaseError('Change balance user', HttpStatusCode.INTERNAL_SERVER, 'Error during changing balance of the user', true))
    }
}

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
    await updateUserBalance(this.userId as unknown as string, this.type, this.amount, next);
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
            if (update.amount) {
                await updateUserBalance(financialEntry.userId, type, update.amount, next)
                if (type === INCOME) {
                    update.amount = Math.abs(update.amount)
                } else {
                    update.amount = -Math.abs(update.amount)
                }
            }
            if (update.type) {
                if (type === INCOME) {
                    update.amount = Math.abs(financialEntry.amount)
                } else {
                    update.amount = -Math.abs(financialEntry.amount)
                }
                await updateUserBalance(financialEntry.userId, type, financialEntry.amount, next, false, true)
            }
        }
    }
    next();
})

// @ts-ignore
financialEntrySchema.pre('findOneAndDelete', async function (next: NextFunction) {
    const entryID = this.getQuery()._id;
    const entryToDelete = await this.model.findById(entryID);
    if (entryToDelete) {
        await updateUserBalance(entryToDelete.userId, entryToDelete.type, entryToDelete.amount, next, true);
    } else {
        next();
    }
})


const FinancialEntry = model<IFinancialEntries>('FinancialEntry', financialEntrySchema);

export default FinancialEntry;