const express = require('express');
const Order = require('./order.model');

const router = express.Router();

// ✅ Create a New Order
router.post("/orders", async (req, res) => {
    try {
        const { user, products, totalAmount } = req.body;

        if (!user || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ message: "Missing order details" });
        }

        const newOrder = new Order({ user, products, totalAmount });
        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get All Orders (Admin use)
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "email").populate("products.product", "name price");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get Orders for a Specific User
router.get("/orders/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).populate("products.product", "name price");

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update Order Status
router.put("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated", order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
