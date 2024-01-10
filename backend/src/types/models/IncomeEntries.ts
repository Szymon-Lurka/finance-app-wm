import {Schema} from "mongoose";

type FinancialEntryType = 'income' | 'expense';

interface IFinancialEntries {
    date: string;
    amount: number;
    description: string;
    name: string;
    userId: Schema.Types.ObjectId;
    categoryId: Schema.Types.ObjectId;
    _id: string;
    currency: string;
    type: FinancialEntryType;
}


interface AddFinancialEntryBody {
    date: string;
    amount: number;
    name: string;
    userId: string;
    categoryId?: string;
    currency: string;
    type: FinancialEntryType;
    description?: string;
}

export {
    IFinancialEntries,
    AddFinancialEntryBody,
}
