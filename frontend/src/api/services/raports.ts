import {axiosInstance} from "@/api";
import type {GetBalanceQuery} from "@/types/models/Raports";

const raportsService = {
    getBalance(params?: GetBalanceQuery) {
        return axiosInstance.get('/api/v1/raports/get-balance', {
            params
        })
    }
};

export {
    raportsService
}