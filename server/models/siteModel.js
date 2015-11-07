// A gameplan-app project
// =============================================================================

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate'); // add findOrCreate functionality to Mongoose

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
  },

  reservations: [{
    date: {
      type: Date,
      required: false
    },
    time: {
      type: Number,
      required: false
    },
    user_id: {
      type: String,
      required: false
    }
  }]
});



siteSchema.plugin(findOrCreate);

module.exports = mongoose.model('sites', siteSchema);