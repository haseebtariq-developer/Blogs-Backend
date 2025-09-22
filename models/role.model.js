const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName : {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    enum: ["create_post", "edit_post", "delete_post", "user_management", "comment_management", "role_management", "none"],
    default: []
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('roles', roleSchema)