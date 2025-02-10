const express = require('express');
const router = express.Router();

const authRoutes = require('../users/user.route');
const productRoutes = require('../products/products.route');
const reviewRoutes = require('../reviews/reviews.router');
const adminRoutes = require('./admin.routes'); // Ensure this matches the filename

const orderRoutes = require('../orders/order.routes'); // Ensure the correct path
router.use('/orders', orderRoutes); // This enables `/api/orders`
router.use('/admin', adminRoutes);


router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
