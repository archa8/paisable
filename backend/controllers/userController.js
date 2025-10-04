const User = require('../models/User');
const IncomeExpense = require('../models/IncomeExpense');
const Receipt = require('../models/Receipt');

// @desc    Delete the logged-in user's account and all their data
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    // Delete all IncomeExpense documents for the user
    await IncomeExpense.deleteMany({ user: req.user._id });

    // Delete all Receipt documents for the user
    await Receipt.deleteMany({ user: req.user._id });

    // Delete the user document
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  deleteAccount,
};