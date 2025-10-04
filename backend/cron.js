const cron = require('node-cron');
const RecurringTransactions = require('./models/RecurringTransactions');
const IncomeExpense = require('./models/IncomeExpense');

cron.schedule('0 0 * * *', async () => {
    console.log('=== Running Recurring Transactions Cron ===');

    try {
        const now = new Date();

        const dueRecurringTransactions = await RecurringTransactions.find({
            nextDueDate: { $lte: now },
        });

        console.log(`Found ${dueRecurringTransactions.length} recurring transactions due`);

        for (const item of dueRecurringTransactions) {
            try {
                const transaction = await IncomeExpense.create({
                    user: item.user,
                    name: item.name,
                    category: item.category,
                    cost: item.amount,
                    isIncome: item.isIncome,
                    date: item.nextDueDate,
                });

                console.log(`Created transaction: ${transaction.name}, amount: ${transaction.amount}`);

                let next = new Date(item.nextDueDate);
                switch (item.frequency) {
                    case 'daily':
                        next.setDate(next.getDate() + 1);
                        break;
                    case 'weekly':
                        next.setDate(next.getDate() + 7);
                        break;
                    case 'monthly':
                        next.setMonth(next.getMonth() + 1);
                        break;
                    case 'annually':
                        next.setFullYear(next.getFullYear() + 1);
                        break;
                    default:
                        console.warn(`Unknown frequency '${item.frequency}' for ${item.name}`);
                }

                item.nextDueDate = next;
                await item.save();

                console.log(`Updated nextDueDate for ${item.name} to ${item.nextDueDate}`);
            } catch (err) {
                console.error(`Failed to create transaction for ${item.name}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Cron job failed:', err.message);
    }
});
