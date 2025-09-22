const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles',
    // default: null
    required: true
  },
  userImage: {
    type: String,
    default: null
  },
  status:{
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('user', userSchema )