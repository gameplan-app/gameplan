// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

  // =====================================================
  // CONFIGURE GRUNT =====================================
  // =====================================================
  grunt.initConfig({

    // get the configuration info from package.json
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),
    log: {
      name: '<%= pkg.name %>', // name of project in package.json
      version: '<%= pkg.version %>' // name of project version
    }
    // all our configuration will go here

    // configure jshint to validate js files
  //   jshint: {
  //     options: {
  //       // use jshint-stylish to make errors look & read good
  //       reporter: require('jshint-stylish') 
  //     },

  //     build: ['Gruntfile.js', 'client/app/app.js', 'client/app/views/*.js', 'server/**/*.js']
  //   }
  // });

  // =====================================================
  // LOAD GRUNT PLUGINS ==================================
  // =====================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerMultiTask('log', 'Log Project details.', function() {
    // because this uses the registerMultiTask function it runs
    // grunt.log.writeln() for each attr in above log: {} obj
    grunt.log.writeln(this.target + ': ' + this.data);
  });
};
