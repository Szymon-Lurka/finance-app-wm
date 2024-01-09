import express from 'express';
import catchAsync from "../utils/errors/catchAsync";
import {login, refreshToken, register} from "../controllers/authController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

router.post('/register', catchAsync(register))

router.post('/login', catchAsync(login))

router.post('/refresh-token', catchAsync(refreshToken));

//@ts-ignore
router.get('/xd', verifyToken, (req, res) => {
//@ts-ignore
    res.status(200).json({status: 'nokurwa'});
})

export default router;
