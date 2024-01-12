import mongoose, {model, Schema} from "mongoose";
import {ICategory} from "../types/models/Category";
import {getNow} from "../utils/date/DateUtils";
import FinancialEntry from "./FinancialEntry";

const categorySchema = new Schema<ICategory>({
    name: {type: String, unique: true, required: true},
    description: {type: String},
    color: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: String},
    updatedAt: {type: String}
})

categorySchema.pre('save', async function (next) {
    const now = getNow();
    this.createdAt = now;
    this.updatedAt = now;
    next();
})

categorySchema.pre('findOneAndDelete', async function (next) {
    const categoryID = this.getQuery()._id;
    const categoryToDelete = await this.model.findById(categoryID);
    if (categoryToDelete) {
        await FinancialEntry.updateMany({categoryId: categoryID}, {$set: {categoryId: null}});
    }
    next();
});

const Category = model<ICategory>('Category', categorySchema);

export default Category;