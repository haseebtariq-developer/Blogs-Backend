const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'spam'],
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reactions : [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      type : {
        type : String,
        enum : ['like' , 'dislike'],
        
      }
    }
  ]

  
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);