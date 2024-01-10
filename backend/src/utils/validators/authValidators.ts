import {UserBody} from "../../types/models/User";
import {isEmpty} from "../tools/validatorTools";

const validateRegisterBody = (body: UserBody) => {
    const invalidFields: string[] = [];
    if (isEmpty(body.username)) {
        invalidFields.push('username')
    }
    if (isEmpty(body.firstName)) {
        invalidFields.push('firstName')
    }
    if (isEmpty(body.lastName)) {
        invalidFields.push('lastName')
    }
    return invalidFields;
};

export {
    validateRegisterBody,
}
