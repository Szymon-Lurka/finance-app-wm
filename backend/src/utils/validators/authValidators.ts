import {LoginUserBody, UserBody} from "../../types/models/Auth";

const isEmpty = (val: unknown) => val === '' || val === null || val === undefined || typeof val === 'number';
const validateRegisterBody = (body: UserBody) => {
    const invalidFields: string[] = [];
    Object.keys(body).forEach((key) => {
        // @ts-ignore
        const val = body[key];
        if (isEmpty(val) || typeof val === 'number') {
            invalidFields.push(key);
        }
    })
    return invalidFields;
};

export {
    validateRegisterBody,
}
