const express = require('express');
const router = express.Router();
const { deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.delete('/account', protect, deleteAccount);

module.exports = router;