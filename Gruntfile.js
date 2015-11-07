

module.exports = function(grunt) {
  // tells how much time each task takes
  require('time-grunt')(grunt);  

  // If your grunt/ folder contains an aliases.yaml file,
  // load-grunt-config will use that to define your task aliases
  // like grunt.registerTask('default', ['jshint']);
  require('load-grunt-config')(grunt, {
    // tells load-grunt-config to use faster jitGrunt
    jitGrunt: true
  });
};