import {model, Schema} from "mongoose";
import {IFinancialEntries} from "../types/models/IncomeEntries";

const financialEntrySchema = new Schema<IFinancialEntries>({
    description: {type: String},
    name: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category'},
    currency: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: String},
    type: {type: String, enum: ['expense', 'income'], default: 'expense'}
})

const FinancialEntry = model<IFinancialEntries>('FinancialEntry', financialEntrySchema);

export default FinancialEntry;