import type {ApiResponse} from "@/types/models/Api";

interface Category {
    color: string;
    description: string;
    name: string;
    _id: string;
}

interface GetCategoriesDTO extends ApiResponse {
    data: {
        results: Category[];
        status: string;
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }
}

export {
    Category,
    GetCategoriesDTO
}
