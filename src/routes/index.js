const express = require('express');
const router = express.Router();

const authRoutes = require('../users/user.route');
const productRoutes = require('../products/products.route');  // ✅ Ensure correct path
const reviewRoutes = require('../reviews/reviews.router');
const adminRoutes = require('../routes/admin.routes');
const orderRoutes = require('../orders/order.routes');

// ✅ Define all routes under `/api`
router.use('/auth', authRoutes);
router.use('/products', productRoutes);  // ✅ This will be `/api/products`
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;