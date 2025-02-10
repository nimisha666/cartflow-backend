const express = require('express');
const Orders = require('../orders/order.model');
const Products = require('../products/products.model');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

// ✅ Get all orders
router.get('/orders', verifyAdmin, async (req, res) => {
    try {
        const orders = await Orders.find()
            .populate("user", "username email")
            .populate("products.product");

        res.status(200).json(orders);
    } catch (error) {
        console.error("❌ Error fetching orders:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update order status
router.patch('/orders/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedOrder = await Orders.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("❌ Error updating order:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all products
router.get('/products', verifyAdmin, async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("❌ Error fetching products:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update product details
router.patch('/products/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Products.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("❌ Error updating product:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a product
router.delete('/products/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Products.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting product:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
