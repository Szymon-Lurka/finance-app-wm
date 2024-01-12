import type {SortOrder} from "@/types/models/Sorting";
import {axiosInstance} from "@/api";

const financialEntriesService = {
    getFinancialEntries(
        pageSize = 10,
        page = 1,
        sortParameter = 'createdAt',
        sortOrder: SortOrder,
        searchText = ''
    ) {
        return axiosInstance.get(`/api/v1/financial-entries`, {
            params: {
                pageSize,
                page,
                sortOrder,
                searchText,
                sortParameter
            }
        })
    },
    deleteEntry(id: string) {
        return axiosInstance.delete(`/api/v1/financial-entries/${id}`);
    },
    getEntry(id: string) {
        return axiosInstance.get(`/api/v1/financial-entries/${id}`);
    },
    addEntry(payload: any) {
        return axiosInstance.post(`/api/v1/financial-entries`, payload);
    },
    editEntry(id: string, payload: any) {
        return axiosInstance.patch(`/api/v1/financial-entries/${id}`, payload);
    }
};

export {
    financialEntriesService
}
