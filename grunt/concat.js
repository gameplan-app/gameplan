module.exports = {
  options: {
    seperator: ';',
  },
  dist: {
    src: [
      'client/app/app.js', // app.js
      'client/app/views/**/*.js' // home.js, reservation.js
    ],
    dest: 'client/app/dist/js/app.concat.js'
  },
};