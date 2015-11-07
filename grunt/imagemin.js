// This config optimises all images in src/images and 
// saved them to dist/images/

// NOTE: We dont currently have any images in our project
// NOTE: CHANGE cwd, src, dest paths before using!!!!!!
module.exports = {
  all: {
    files: [{
      expand: true,
      cwd: 'client/app/assets/',
      src: ['images/*.{png,jpg,gif}'],
      dest: 'client/app/dist/images
    }]
  }
};