const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  userId: { type: String},
  title: { type: String, required: true, trim: true },
  userMessage: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['open', 'in progress', 'pending', 'closed', 'resolved'], 
    default: 'open' 
  },
  category: { type: String, trim: true },
  imageUrl: { type: String },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  votes: { type: Number, default: 0 },
  voters: { type: Array, default: [] },
}, { timestamps: true }); // createdAt & updatedAt

module.exports = mongoose.model('Issue', issueSchema);