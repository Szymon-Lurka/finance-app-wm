import {AddCategoryBody} from "../../types/models/Category";
import {isEmpty} from "../tools/validatorTools";

const validateCategoryBody = (body: AddCategoryBody) => {
    const invalidFields: string[] = [];
    if (isEmpty(body.name)) {
        invalidFields.push('name')
    }
    return invalidFields;
}

export {
    validateCategoryBody
}