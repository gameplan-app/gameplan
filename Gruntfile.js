// A gameplan-app project
// =============================================================================

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'client/app/**/*.js',
          'client/app/views/**/*.js',
          '!client/app/assets/js/*js',
          '!client/app/bower_components/**/*js',
          '!client/app/dist/**/*js'
        ],
        dest: 'client/app/dist/js/app.concat.js'
      }
    },

    sass: { // Task
      dist: { // Target
        options: { // Target options
          sourceMap: true,
          outputStyle: 'compressed'
            // cacheLocation: 'app/assets/.sass-cache',
            // style: 'compressed'
        },
        files: { // Dictionary of files
          'client/app/dist/css/app.css': 'client/app/assets/scss/app.scss', // 'destination': 'source'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! app.js <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        preserveComments: false
      },
      build: {
        src: 'client/app/dist/js/app.concat.js',
        dest: 'client/app/dist/js/app.min.js'
      }
    },

    jshint: {
      files: [
        'client/app/**/*.js',
        'client/app/views/**/*.js',
        '!client/app/assets/js/*js',
        '!client/app/bower_components/**/*js',
        '!client/app/components/**/*js',
        '!client/app/dist/**/*js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          'client/app/**/*.js',
          'client/app/views/**/*.js',
          '!client/app/assets/js/*js',
          '!client/app/bower_components/**/*js',
          '!client/app/components/**/*js',
          '!client/app/dist/**/*js'
        ],
        tasks: [
          'jshint',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'client/app/assets/scss/*.scss',
        tasks: ['sass']
      }
    },

    shell: {
      view: {
        command: 'open http://localhost:8080/',
        options: {
          execOptions: {
            maxBuffer: 500 * 1024 // or Infinity
          }
        }
      },
      server: {
        command: 'nodemon server/server.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-sass');
  // grunt.loadNpmTasks('grunt-contrib-sass'); // Removed to used grunt-sass



  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////


  grunt.registerTask('default', [
    'watch'
  ]);

  // Compile all sass files
  grunt.registerTask('sass-compile', [
    'sass'
  ]);

  // Create and check file
  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'sass'
  ]);

  // Open the HTML app file
  grunt.registerTask('view', function() {
    grunt.task.run(['shell:view']);
  });

  // Start local server
  grunt.registerTask('server', function() {
    grunt.task.run(['shell:server']);
  });


};
