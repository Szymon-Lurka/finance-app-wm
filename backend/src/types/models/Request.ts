import {Request} from "express";
import {IncomingHttpHeaders} from "http2";
interface CustomRequest<T = {}, H = {}> extends Request {
    body: T;
    headers: IncomingHttpHeaders & H;
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
    }
}

export {
    CustomRequest,
}