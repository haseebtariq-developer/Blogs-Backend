const mongoose  = require('mongoose');

const tagSchema = new mongoose.Schema({
  tag : {
    type : String,
    required : true
  }
  
}, {
  timestamps : true
})

module.exports = mongoose.model('tag', tagSchema);