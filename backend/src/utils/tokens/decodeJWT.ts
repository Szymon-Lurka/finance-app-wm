import {JWTBody} from "../../types/models/Auth";
import jwt from "jsonwebtoken";

const decodeJWT = (refreshToken: string): JWTBody | null => {
    return jwt.verify(refreshToken, process.env.JWT_SECRET_KEY || '') as JWTBody | null
};

export {
    decodeJWT
}