import {JWTBody} from "../../types/models/Auth";
import jwt from "jsonwebtoken";

const decodeJWT = (token: string): JWTBody | null => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY || '') as JWTBody | null
};

export {
    decodeJWT
}