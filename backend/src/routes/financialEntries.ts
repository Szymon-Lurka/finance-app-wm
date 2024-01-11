import express from "express";
import verifyToken from "../middleware/authMiddleware";
import catchAsync from "../utils/errors/catchAsync";
import {
    addFinancialEntry,
    deleteFinancialEntry, getFinancialEntries,
    getFinancialEntry,
    updateFinancialEntry
} from "../controllers/financialEntriesController";

const router = express.Router();

router.get('/:id', verifyToken, catchAsync(getFinancialEntry));
router.patch('/:id', verifyToken, catchAsync(updateFinancialEntry));
router.delete('/:id', verifyToken, catchAsync(deleteFinancialEntry));
router.post('/', verifyToken, catchAsync(addFinancialEntry));
router.get('/', verifyToken, catchAsync(getFinancialEntries));

export default router;
