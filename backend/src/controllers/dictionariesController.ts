import {CustomRequest} from "../types/models/Request";
import {NextFunction, Response} from "express";
import {financialEntriesTypes} from "../constants/dictionaries";

const getDictionaries =  async (req: CustomRequest, res: Response, next: NextFunction) => {
    res.status(200).json({
        status: 'success',
        dictionaries: {
            financialEntriesTypes
        }
    })
}

export {
    getDictionaries
}