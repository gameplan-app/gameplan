

module.exports = {
  
  openInBrowser: {
    command: 'open http://localhost:8080/',
    options: {
      execOptions: {
        maxBuffer: 500 * 1024
      }
    }
  },
  server: {
    command: 'nodemon server/server.js'
  }

};