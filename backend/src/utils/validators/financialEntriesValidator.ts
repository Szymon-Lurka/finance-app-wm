import {AddFinancialEntryBody, UpdateFinancialEntryBody} from "../../types/models/FinancialEntries";
import {isEmpty} from "../tools/validatorTools";

const financialEntriesValidator = (body: AddFinancialEntryBody) => {
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

const updateFinancialEntryValidator = (body: UpdateFinancialEntryBody) => {
    const invalidFields: string[] = [];
    Object.keys(body).forEach((key) => {
        // @ts-ignore
        const val = body[key];
        console.log(val);
        if (isEmpty(val)) {
            invalidFields.push(key);
        }
    })
    return invalidFields;
}

export {
    financialEntriesValidator,
    updateFinancialEntryValidator
}