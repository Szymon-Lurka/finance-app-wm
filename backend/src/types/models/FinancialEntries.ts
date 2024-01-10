import {Schema} from "mongoose";
import {SharedQuery} from "./Shared";

type FinancialEntryIncome = 'income';
type FinancialEntryExpense = 'expense';
type FinancialEntryType = FinancialEntryExpense | FinancialEntryIncome;

interface IFinancialEntries {
    date: string;
    amount: number;
    description: string;
    name: string;
    userId: Schema.Types.ObjectId;
    categoryId: Schema.Types.ObjectId;
    _id: string;
    type: FinancialEntryType;
    createdAt: string;
    updatedAt: string;
}

interface GetFinancialEntriesQuery extends SharedQuery {
    searchText?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    amountFrom?: string;
    amountTo?: string;
    categoryId?: string;
}

interface UpdateFinancialEntryBody {
    date?: string;
    amount?: number;
    name?: string;
    categoryId?: string;
    type?: FinancialEntryType;
    description?: string;
}

interface AddFinancialEntryBody {
    date: string;
    amount: number;
    name: string;
    userId: string;
    categoryId?: string;
    type: FinancialEntryType;
    description?: string;
}

export {
    IFinancialEntries,
    AddFinancialEntryBody,
    GetFinancialEntriesQuery,
    FinancialEntryType,
    UpdateFinancialEntryBody,
    FinancialEntryIncome,
    FinancialEntryExpense
}
