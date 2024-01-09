import express from "express";
import catchAsync from "../utils/errors/catchAsync";
import {updateUser} from "../controllers/userController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

router.patch('/', verifyToken, catchAsync(updateUser));

export default router;