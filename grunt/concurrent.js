// Run tasks concurrently - Out-of-the-box Grunt will run each task one after the other, which can take a while depending on the amount and type of tasks you need to run. However, there are often tasks that are not dependent on other tasks which can be run at the same time.

module.exports = {

  // Task options
  options: {
    limit: 3
  },

  // Dev tasks
  devFirst: [
    'clean',
    'jshint'
  ],
  devSecond: [
    'sass:dev',
    'concat'
  ],
  devThird: [
    'uglify'
  ],

  // Production tasks
  prodFirst: [
    'clean',
    'jshint'
  ],
  prodSecond: [
    'sass:prod',
    'concat'
  ],
  prodThird: [
    'uglify'
  ],

  // Image Tasks
  imgFirst: [
    'imagemin'
  ]
};