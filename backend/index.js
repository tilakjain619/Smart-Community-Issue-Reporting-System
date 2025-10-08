const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { clerkMiddleware } = require('@clerk/express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Check if Clerk secret key is configured
if (!process.env.CLERK_SECRET_KEY) {
  console.warn('⚠️  CLERK_SECRET_KEY not configured. Set it in your .env file');
} else {
  console.log('✅ Clerk authentication configured');
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-community')
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());
app.use(cors());

// Clerk middleware - must be added before routes
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send('Welcome to Jagruk');
});

// Use Routes
app.use('/api', require('./routes/issue'));
app.use("/api", require('./routes/upload'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
