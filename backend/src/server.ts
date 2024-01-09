import {NextFunction, Request, Response} from 'express';

import router from "./routes/auth";
import errorHandler from "./controllers/errorController";
import initializeApp from "./initialize";
import {BaseError} from "./utils/errors/AppError";
import nodemailer from 'nodemailer';

const app = initializeApp();

const PORT = process.env.PORT;

app.use('/api/v1/auth', router);


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