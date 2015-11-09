// This task validates your Javascript
module.exports = {

  options: {
    reporter: require('jshint-stylish')
  },

  main: [
    '/client/app/views/**/*.js',
    'client/app/app.js',
    'server/**/*.js'
  ]
};