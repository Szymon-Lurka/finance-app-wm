import express from "express";
import catchAsync from "../utils/errors/catchAsync";
import {
    addCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory
} from "../controllers/categoriesController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

router.get('/:id', verifyToken, catchAsync(getCategory));
router.patch('/:id', verifyToken, catchAsync(updateCategory));
router.delete('/:id', verifyToken, catchAsync(deleteCategory));
router.post('/', verifyToken, catchAsync(addCategory));
router.get('/', verifyToken, catchAsync(getCategories));

export default router;