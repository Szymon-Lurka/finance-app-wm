import {AddFinancialEntryBody} from "../../types/models/IncomeEntries";
import {isEmpty} from "../tools/validatorTools";

const incomeEntriesValidator = (body: AddFinancialEntryBody) => {
    const invalidFields: string[] = [];
    Object.keys(body).forEach((key) => {
        // @ts-ignore
        const val = body[key];
        if (isEmpty(val)) {
            invalidFields.push(key);
        }
    })
    return invalidFields;
}

export {
    incomeEntriesValidator
}