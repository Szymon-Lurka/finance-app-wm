import express from "express";
import catchAsync from "../utils/errors/catchAsync";
import {getTotalBalance, updateUser} from "../controllers/userController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

router.patch('/', verifyToken, catchAsync(updateUser));

router.get('/total-balance', verifyToken, catchAsync(getTotalBalance));

export default router;