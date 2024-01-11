import {string} from "yup";

const stringOrNullValidator = (message: string, minLength: number) =>
    string()
        .test({
            test: (value) => {
                return value === null || value === '' || value?.length >= minLength
            },
            name: 'min-length-or-null',
            message,
        })
        .nullable();

export {stringOrNullValidator}