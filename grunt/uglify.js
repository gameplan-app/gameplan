// Takes JS files and minifies them
module.exports = {
  all: {
    files: [{
      expand: true,
      cwd: 'client/app/dist/js',
      src: '**/*.js',
      dest: 'client/app/dist/js',
      ext: '.min.js'
    }]
  }
};