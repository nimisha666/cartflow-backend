require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ CORS Configuration
app.use(cors({
    origin: ['https://cartflow-ecommerce-hgwv-nimisha666s-projects.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
}));

// ✅ MongoDB Connection with Retry Logic
async function connectDB() {
    console.log("🔹 Attempting to connect to MongoDB...");
    console.log("🔹 DB URL:", process.env.DB_URL); // Debugging

    try {
        await mongoose.connect(process.env.DB_URL); // ✅ Removed deprecated options
        console.log("✅ MongoDB successfully connected.");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.log("🔄 Retrying in 5 seconds...");
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
}

connectDB();

// ✅ Import Routes
const apiRouter = require('./src/routes/index');  // Import the main API routes file

app.use('/api', apiRouter);  // This integrates all routes under `/api`

// ✅ Root Route 
app.get('/', (req, res) => {
    res.send(`
        ✅ Server is running... <br><br>
        Available API Endpoints: <br>
        🔹 <a href="/api/auth">/api/auth</a> - User Authentication <br>
        🔹 <a href="/api/products">/api/products</a> - Product Management <br>
        🔹 <a href="/api/orders">/api/orders</a> - Order Management <br>
        🔹 <a href="/api/reviews">/api/reviews</a> - Reviews and Ratings <br>
        🔹 <a href="/api/admin">/api/admin</a> - Admin Dashboard <br>
    `);
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
