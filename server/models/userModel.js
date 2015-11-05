var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');  // add findOrCreate functionality to Mongoose

var userSchema = new mongoose.Schema({
  user_fb_id: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true
  },

  photo: {
    type: String,
    required: false
  },

  checkins: {
    type: Array,
    required: false
  }

});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('users', userSchema);
