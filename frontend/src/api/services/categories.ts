import {axiosInstance} from "@/api";
import type {GetCategoriesDTO} from "@/types/models/Categories";

const categoriesService = {
    getCategories(
        pageSize = 10,
        page = 1,
        sortParameter = 'createdAt',
        sortOrder: 'ascending' | 'descending' = 'ascending',
        searchText = ''
    ) {
        return axiosInstance.get<GetCategoriesDTO>(`/api/v1/categories`, {
            params: {
                pageSize,
                page,
                sortOrder: sortOrder === 'ascending' ? -1 : +1,
                searchText,
                sortParameter
            }
        })
    }
};

export {
    categoriesService
}
