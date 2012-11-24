module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['src/**/*.js', 'test/**/*.js']
    },
    copy : {
      dist: {
        files: {
          "target/mockato/": ["src/mockato/**", "test/mockato/**"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', 'lint copy');

};