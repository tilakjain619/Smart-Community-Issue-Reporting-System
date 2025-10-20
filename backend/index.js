const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Check if Appwrite is configured
if (!process.env.APPWRITE_PROJECT_ID) {
  console.warn('⚠️  APPWRITE_PROJECT_ID not configured. Set it in your .env file');
} else {
  console.log('✅ Appwrite authentication configured');
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-community')
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to Jagruk');
});

// Use Routes
app.use('/api', require('./routes/issue'));
app.use('/api', require('./routes/logs'));
app.use("/api", require('./routes/upload'));
app.use('/api', require('./routes/officer'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
