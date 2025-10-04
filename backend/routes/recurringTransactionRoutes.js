const express = require('express');
const router = express.Router();
const { createRecurringTransaction, getRecurringTransactions, deleteRecurringTransaction, updateRecurringTransaction } = require('../controllers/recurringTransactionController');

const { protect } = require('../middleware/authMiddleware');


router.route('/create').post(protect, createRecurringTransaction);
router.route('/').get(protect, getRecurringTransactions);
router.route('/:id').delete(protect, deleteRecurringTransaction);
router.route('/:id').put(protect, updateRecurringTransaction);


module.exports = router;