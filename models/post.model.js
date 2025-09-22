const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title : {
    type : String, 
    required : true
  },
  slug : {
    type : String,
    default: null
  },
  content : {
    type : String,
    default : null
  },
  excerpt : {
    type : String,
    default : null
  },
  authorId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'users',
    required : true
  },
  categoryId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'categories',
    required : true
  },
  status : {
    type: String, 
    enum : ['draft', 'published'],
    default: 'draft'
  },
  tags : {
    type : [mongoose.Schema.Types.ObjectId],
    default : []
  },
  postImage : {
    type : String, 
    default : null,
  }


}, {
  timestamps : true
})

module.exports = mongoose.model('post', postSchema)