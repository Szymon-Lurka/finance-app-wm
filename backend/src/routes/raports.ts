import express from "express";
import verifyToken from "../middleware/authMiddleware";
import catchAsync from "../utils/errors/catchAsync";
import {getBalance} from "../controllers/raportController";

const router = express.Router();

router.get('/get-balance', verifyToken, catchAsync(getBalance));
export default router;