import type {FinancialEntryType} from "@/types/types/FinancialEntry";

interface Entry {
    amount: number;
    date: string;
    description: string;
    name: string;
    type: FinancialEntryType;
    _id: string;
}

export {
    Entry
}
