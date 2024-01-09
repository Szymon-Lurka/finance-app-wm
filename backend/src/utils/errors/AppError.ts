import {HttpStatusCode} from "../../types/enums/HttpStatusCode";
import {MongoError} from "../../types/models/Errors";

class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;

    constructor(name: string, httpCode: HttpStatusCode, message: string, isOperational: boolean) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

class UnauthorizedError extends BaseError {
    constructor(name: string, message = '', httpCode = HttpStatusCode.UNAUTHORIZED, isOperational = true) {
        super(name, httpCode, message, isOperational);
    }
}

class BodyFieldsValidationError extends BaseError {
    constructor(name: string, fields: string[] = [], httpCode = HttpStatusCode.BAD_REQUEST, isOperational = true) {
        const message = `Invalid fields: ${fields.join(', ')}`;
        super(name, httpCode, message, isOperational);
    }
}

class ValidationError extends BaseError {
    constructor(name: string, message: string, httpCode = HttpStatusCode.BAD_REQUEST, isOperational = true) {
        super(name, httpCode, message, isOperational);
    }
}

class MongoDBError {
    constructor(public message: string, public name: string) {
    }
}

class NotFoundError extends BaseError {
    constructor(name: string, message = '', httpCode = HttpStatusCode.NOT_FOUND, isOperational = true) {
        super(name, httpCode, message, isOperational);
    }
}

const createMongoDBError = (e: unknown) => {
    const error = e as any as MongoError;
    return new MongoDBError(error.message, error.name)
}

export {
    BaseError,
    UnauthorizedError,
    BodyFieldsValidationError,
    MongoDBError,
    createMongoDBError,
    NotFoundError,
    ValidationError,
}
