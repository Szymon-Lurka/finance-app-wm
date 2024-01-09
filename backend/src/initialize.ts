import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import morgan from "morgan";
import connectToDB from "./db/db";
import {rateLimit} from 'express-rate-limit';

dotenv.config();

const initializeApp = () => {
    const app = express();
    connectToDB();

    const limiter = rateLimit({
        limit: 100,
        windowMs: 5 * 60 * 1000,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: 'To many request from this IP, please try again in an 15mins!'
    })
    app.use(limiter);
    app.use(helmet());
    app.use(mongoSanitize());
    app.use(express.json({
        limit: '10kb'
    }));

    app.use(cors({
        origin: '*'
    }));

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }

    return app;
}

export default initializeApp;

