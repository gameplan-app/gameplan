// Watch runs specified tasks whenever your watched files are
// added, edited, deleted
module.exports = {

  options: {
    spawn: false,
    livereload: true
  },

  scripts: {
    files: [
      'client/app/**/*.js',
      'server/**/*.js'
    ],
    tasks: [
      'jshint',
      'uglify'
    ]
  },

  styles: {
    files: [
      'client/app/assets/scss/*.scss'
    ],
    tasks: [
      'sass:dev'
    ]
  },
};