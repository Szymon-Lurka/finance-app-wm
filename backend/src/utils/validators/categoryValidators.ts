import {AddCategoryBody} from "../../types/models/Category";
import {isEmpty} from "../tools/validatorTools";

const validateCategoryBody = (body: AddCategoryBody) => {
    const invalidFields: string[] = [];
    Object.keys(body).forEach((key) => {
        // @ts-ignore
        const val = body[key];
        if (isEmpty(val) || typeof val === 'number') {
            invalidFields.push(key);
        }
    })
    return invalidFields;
}

export {
    validateCategoryBody
}