 import {NextFunction, Request, Response} from 'express';

import authRouter from "./routes/auth";
import userRouter from './routes/user';
import categoriesRouter from './routes/categories';
import errorHandler from "./controllers/errorController";
import initializeApp from "./initialize";
import {BaseError} from "./utils/errors/AppError";
import financialEntriesRouter from "./routes/financialEntries";
import dictionariesRouter from "./routes/dictionaries";

const app = initializeApp();

const PORT = process.env.PORT;

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/financial-entries', financialEntriesRouter)
app.use('/api/v1/dictionaries', dictionariesRouter)

// Must be the last one to handle ALL errors!
// It MUST have 4 parameters: err,req,res,next - otherwise this handler won't fire
app.use(async (err: BaseError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    errorHandler(err, req, res);
})

const server = app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
})

process.on('uncaughtException', (err: any) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});