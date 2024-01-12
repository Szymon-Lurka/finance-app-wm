import {FinancialEntryType} from "./FinancialEntries";

interface RaportsBalanceQuery {
    dateFrom: string;
    dateTo: string;
    type?: FinancialEntryType;
}

export {
    RaportsBalanceQuery
}