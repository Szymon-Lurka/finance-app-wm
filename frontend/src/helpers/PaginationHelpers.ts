import type {Pagination} from "@/types/models/Pagination";

const defaultPagination: Pagination = {
    page: 1,
    pageSize: 10,
    totalCount: 0
};

export {
    defaultPagination
}