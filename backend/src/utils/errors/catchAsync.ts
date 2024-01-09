import {Application, NextFunction} from "express";

/*
* Better way of try catch blocks.
* Use as higher order function. ALWAYS with async e.g. catchAsync(async (req, res, next) => {....})
* */

const catchAsync = (fn: any): Application => {
    return ((req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    }) as unknown as Application
}
export default catchAsync;
