const mongoose = require("mongoose");
const Budget = require('../models/Budget.js');
const IncomeExpense = require('../models/IncomeExpense.js');

const createBudget = async (req, res) => {
    try {
        const { category, amount, month, year } = req.body;
        const budget = new Budget({ user: req.user.id, category, amount, month, year });
        const savedBudget = await budget.save();
        res.status(201).json(savedBudget);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });

        const budgetsWithSpent = await Promise.all(
            budgets.map(async (b) => {
                const startDate = new Date(b.year, b.month - 1, 1);
                const endDate = new Date(b.year, b.month, 0, 23, 59, 59);

                const result = await IncomeExpense.aggregate([
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(req.user.id),
                            category: b.category,
                            isIncome: false,
                            addedOn: { $gte: startDate, $lte: endDate },
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalSpent: { $sum: "$cost" }
                        }
                    }
                ]);

                const spent = result[0]?.totalSpent || 0;

                return {
                    ...b.toObject(),
                    spent,
                    remaining: b.amount - spent
                };
            })
        );

        res.status(200).json(budgetsWithSpent);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        await budget.deleteOne();
        res.json({ message: 'Budget deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { createBudget, getBudgets, deleteBudget }
