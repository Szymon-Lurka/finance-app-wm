import {AddFinancialEntryBody, UpdateFinancialEntryBody} from "../../types/models/FinancialEntries";
import {isEmpty} from "../tools/validatorTools";

const financialEntriesValidator = (body: AddFinancialEntryBody) => {
    const invalidFields: string[] = [];
    if (isEmpty(body.name)) {
        invalidFields.push('name')
    }
    if ((body.type === 'income' && body.amount < 0) || (body.type === 'expense' && body.amount > 0)) {
        invalidFields.push('type');
        invalidFields.push('amount');
    }
    // @ts-ignore
    if (body.type != 'income' && body.type != 'expense') {
        invalidFields.push('type');
    }
    if (isEmpty(body.currency)) {
        invalidFields.push('currency');
    }
    return invalidFields;
}

const updateFinancialEntryValidator = (body: UpdateFinancialEntryBody) => {
    const invalidFields: string[] = [];
    //@ts-ignore
    if (body.type && (body.type != 'income' && body.type != 'expense')) {
        invalidFields.push('type');
    }

    return invalidFields;
}

export {
    financialEntriesValidator,
    updateFinancialEntryValidator
}