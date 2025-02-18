const express = require('express');
const router = express.Router();

const authRoutes = require('../users/user.route');
const productRoutes = require('../products/products.route');
const reviewRoutes = require('../reviews/reviews.router');
const adminRoutes = require('../routes/admin.routes'); // Ensure correct path
const orderRoutes = require('../orders/order.routes'); // Ensure correct path

// ✅ Define all routes under `/api`
router.use('/orders', orderRoutes);  // Enables `/api/orders`
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
