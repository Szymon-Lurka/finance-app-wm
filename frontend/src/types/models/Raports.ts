import type {FinancialEntryType} from "@/types/types/FinancialEntry";

interface GetBalanceQuery {
    dateTo?: string;
    dateFrom?: string;
    type?: FinancialEntryType;
}

export {
    GetBalanceQuery
}