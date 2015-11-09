// Takes JS files and minifies them
module.exports = {
  all: {
    files: [{
      expand: true,
      cwd: 'client/app/dist/',
      src: '**/*.js',
      dest: 'client/app/dist/',
      ext: '.min.js'
    }]
  }
};