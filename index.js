const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

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
    origin: 'http://localhost:5173',
    credentials: true,
}));

// ✅ Import Routes from a centralized file
const routes = require('./src/routes');
app.use('/api', routes);

// ✅ MongoDB Connection with Error Handling
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB successfully connected.");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

connectDB();

// ✅ Root Route
app.get('/', (req, res) => {
    res.send('✅ Server is running...');
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
