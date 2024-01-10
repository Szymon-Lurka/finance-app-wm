import {Request} from "express";
import {IncomingHttpHeaders} from "http2";

interface CustomRequest<PARAMS = {}, BODY = {}, QUERY = {}> extends Request<PARAMS, {}, BODY, QUERY> {
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