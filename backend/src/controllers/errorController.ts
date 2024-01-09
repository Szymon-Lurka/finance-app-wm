import {Response} from 'express'
import {BaseError} from "../utils/errors/AppError";

const sendErrorDev = (err: BaseError, res: Response) => {
    res.status(err.httpCode).json({
        status: 'error',
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err: BaseError, res: Response) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.httpCode).json({
            status: 'error',
            message: err.message
        });
        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error - log this somewhere
        console.error('ERROR !!!!!!', err);
        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

const errorHandler = (err: BaseError | { message: string }, _: unknown, res: Response )=> {
    if (err instanceof BaseError) {
        if (process.env.NODE_ENV === 'production') {
            sendErrorProd(err, res);
        } else if (process.env.NODE_ENV === 'development') {
            sendErrorDev(err, res)
        }
    } else {
        if (err.message) {
            res.status(500).json({
                status: 'error',
                message: err.message
            })
        } else {
            console.error('SOMETHING WENT VERY WRONG!!!', err);
            res.status(500).json({
                status: 'error',
                message: 'Unknown server error.'
            })
        }
    }
};

export default errorHandler;
