const dns = require('dns');

// Hardcode Google DNS at the absolute entry point to resolve MongoDB Atlas connection issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();

// Database logic 
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        
        console.log('[Database] Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4, // Force IPv4 to resolve Atlas SRV record issues
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Don't exit process, just log. The middleware will handle request-time checks.
    }
};

// Connect on startup
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://cryptoflux-cf.vercel.app'],
    credentials: true
}));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware to ensure DB connection (only for routes that need it)
const ensureDB = async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await connectDB();
            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({ message: 'Database is currently unavailable' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Database connection failed', error: error.message });
        }
    }
    next();
};

// Routes
app.get('/', (req, res) => res.send('CryptoFlux API Ready'));
app.use('/api/crypto', cryptoRoutes);              // No DB needed
app.use('/api/auth', ensureDB, authRoutes);        // Needs DB
app.use('/api/user', ensureDB, userRoutes);        // Needs DB

// Start server if local
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
