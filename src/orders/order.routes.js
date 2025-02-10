const express = require('express');
const Orders = require('./order.model');
const router = express.Router();

// Get single order by ID
router.get("/", (req, res) => {
    res.json([
        { _id: "123", user: "test@example.com", totalAmount: 500, status: "Pending" },
        { _id: "156", user: "test@example.com", totalAmount: 1200, status: "Pending" },
    ]);
});

module.exports = router;
