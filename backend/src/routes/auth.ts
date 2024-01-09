import express from 'express';
import catchAsync from "../utils/errors/catchAsync";
import {forgotPassword, login, refreshToken, register, resetPassword} from "../controllers/authController";

const router = express.Router();

router.post('/register', catchAsync(register))

router.post('/login', catchAsync(login))

router.post('/refresh-token', catchAsync(refreshToken));

router.post('/forgot-password', catchAsync(forgotPassword))

router.patch('/reset-password', catchAsync(resetPassword))

export default router;
