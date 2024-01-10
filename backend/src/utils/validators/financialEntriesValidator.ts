import {AddFinancialEntryBody, UpdateFinancialEntryBody} from "../../types/models/FinancialEntries";
import {isEmpty} from "../tools/validatorTools";
import {EXPENSE, INCOME} from "../../constants/financial";

const financialEntriesValidator = (body: AddFinancialEntryBody) => {
    const invalidFields: string[] = [];
    if (isEmpty(body.name)) {
        invalidFields.push('name')
    }
    if ((body.type === INCOME && body.amount < 0) || (body.type === EXPENSE && body.amount > 0)) {
        invalidFields.push('type');
        invalidFields.push('amount');
    }
    if (body.type != INCOME && body.type != EXPENSE) {
        invalidFields.push('type');
    }
    return invalidFields;
}

const updateFinancialEntryValidator = (body: UpdateFinancialEntryBody) => {
    const invalidFields: string[] = [];

    if (body.type && (body.type != INCOME && body.type != EXPENSE)) {
        invalidFields.push('type');
    }

    return invalidFields;
}

export {
    financialEntriesValidator,
    updateFinancialEntryValidator
}