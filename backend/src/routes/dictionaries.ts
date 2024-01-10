import express from "express";
import verifyToken from "../middleware/authMiddleware";
import {getDictionaries} from "../controllers/dictionariesController";
import catchAsync from "../utils/errors/catchAsync";

const router = express.Router();

router.get('/', verifyToken, catchAsync(getDictionaries));
export default router;
