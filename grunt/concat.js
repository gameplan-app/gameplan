module.exports = {
  options: {
    seperator: ';',
  },
  dist: {
    src: [
      'client/app/**/*.js'
    ],
    dest: 'client/app/dist/js/app.concat.js'
  },
};