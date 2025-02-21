const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

// GET Fees by category
router.get('/', async (req, res) => {
    try {
        const category = req.query.category;  // "current_due", "total_due", "receipt"
        const fees = await Fee.find({ category });
        res.json(fees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
