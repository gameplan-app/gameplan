var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');  // add findOrCreate functionality to Mongoose

var siteSchema = new mongoose.Schema({
  site_place_id: {
    type: String,
    required: false
  },

  sitename: {
    type: String,
    required: true
  },

  checkins: {
    type: Number,
    required: false
  }

});

siteSchema.plugin(findOrCreate);

module.exports = mongoose.model('sites', siteSchema);
