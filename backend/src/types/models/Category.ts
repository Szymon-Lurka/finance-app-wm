import {Schema} from "mongoose";

interface ICategory {
    color: string;
    name: string;
    description: string;
    userId: Schema.Types.ObjectId;
    _id: string;
    createdAt: string;
}

interface UpdateCategoryBody {
    color?: string;
    name?: string;
    description?: string;
}

interface AddCategoryBody {
    color: string;
    name: string;
    description: string;
}

export {
    ICategory,
    AddCategoryBody,
    UpdateCategoryBody
}