const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, lowercase: true, unique: true },
  password:      { type: String, required: true },

// In models/User.js — add to schema:
phone:   { type: String, default: '' },
address: { type: String, default: '' },

  adminPassword: { type: String, default: 'null' }, // ← ADD THIS
  age:           { type: Number, min: 0 },
  role:          { type: String, enum: ['admin', 'user'], default: 'user' },
  cart: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);



