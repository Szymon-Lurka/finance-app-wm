import {Schema} from "mongoose";
import {SharedQuery} from "./Shared";

interface ICategory {
    color: string;
    name: string;
    description: string;
    userId: Schema.Types.ObjectId;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

interface GetCategoriesQuery extends SharedQuery {
    searchText?: string;
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
    UpdateCategoryBody,
    GetCategoriesQuery
}