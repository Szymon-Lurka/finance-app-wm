import {model, Schema} from "mongoose";
import {ICategory} from "../types/models/Category";

const categorySchema = new Schema<ICategory>({
    description: {type: String, required: true},
    name: {type: String, unique: true},
    color: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: String},
})

categorySchema.pre('save', async function(next)  {
    this.createdAt = new Date().toISOString();
    next();
})

const Category = model<ICategory>('Category', categorySchema);

export default Category;