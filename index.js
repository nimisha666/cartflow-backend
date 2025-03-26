require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
    origin: ['https://cartflow-ecommerce-hgwv-nimisha666s-projects.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
}));

// ✅ MongoDB Connection
async function connectDB() {
    console.log("🔹 Attempting to connect to MongoDB...");

    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ MongoDB successfully connected.");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.log("🔄 Retrying in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
}
connectDB();

// Import Routes
const routes = require('./src/routes/index');
const orderRoutes = require('./src/orders/order.routes'); // ✅ Added Order Routes Import

app.use('/api', routes);
app.use('/api/orders', orderRoutes); // ✅ Registered Order Routes

// Root Route
app.get('/', (req, res) => {
    res.send('✅ Server is running...');
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
