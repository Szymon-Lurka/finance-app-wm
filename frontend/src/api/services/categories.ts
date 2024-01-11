import {axiosInstance} from "@/api";
import type {GetCategoriesDTO} from "@/types/models/Categories";
import type {SortOrder} from "@/types/models/Sorting";

const categoriesService = {
    getCategories(
        pageSize = 10,
        page = 1,
        sortParameter = 'createdAt',
        sortOrder: SortOrder,
        searchText = ''
    ) {
        return axiosInstance.get<GetCategoriesDTO>(`/api/v1/categories`, {
            params: {
                pageSize,
                page,
                sortOrder,
                searchText,
                sortParameter
            }
        })
    },
    addCategory(payload: any) {
        return axiosInstance.post('/api/v1/categories', payload)
    },
    editCategory(id: string, payload: any) {
        return axiosInstance.patch(`/api/v1/categories/${id}`, payload)
    },
    getCategory(id: string) {
        return axiosInstance.get(`/api/v1/categories/${id}`);
    },
    deleteCategory(id: string) {
        return axiosInstance.delete(`/api/v1/categories/${id}`);
    }
};

export {
    categoriesService
}
