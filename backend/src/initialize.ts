import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import morgan from "morgan";
import connectToDB from "./db/db";

dotenv.config();

const initializeApp = () => {
    const app = express();
    connectToDB();

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

