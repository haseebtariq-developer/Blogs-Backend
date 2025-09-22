const mongoose  = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,

  },
  parentId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'category',
    default: null
  },
  description : {
    type: String,
    default : null
  }

}, {
  timestamps : true
})

module.exports = mongoose.model('category', categorySchema)