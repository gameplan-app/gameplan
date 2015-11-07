// Compiles your SASS/SCSS files into CSS. Please note: This Sass task uses the faster, but more experimental libsass compiler. If you experience problems you should probably use the more stable, but slower grunt-contrib-sass task instead.

module.exports = {
  // development settings
  dev: {
    options: {
      outputStyle: 'nested',
      sourceMap: true
    },
    files: [{
      expand: true,
      cwd: 'src/styles',  // change this
      src: ['*.scss'],
      dest: 'dist/styles', // change this
      ext: '.css'
    }]
  },
  // Production settings
  prod: {
    options: {
      outputStyle: 'compressed',
      sourceMap: false
    },
    files: [{
      expand: true,
      cwd: 'src/styles',
      src: ['*.scss'],
      dest: 'dist/styles',
      ext: '.css'
    }]
  }
};