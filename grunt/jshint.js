// This task validates your Javascript
module.exports = {

  options: {
    reporter: require('jshint-stylish')
  },

  main: [
    'src/scripts/*.js'
  ]
};