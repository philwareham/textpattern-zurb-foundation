module.exports = function (grunt)
{
    'use strict';

    // Load Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set up timestamp.
        opt : {
            timestamp: '<%= new Date().getTime() %>'
        },

        // Use 'config.rb' file to configure Compass.
        compass: {
            dev: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: 'src/assets/sass/**',
                tasks: ['sass']
            },

            js: {
                files: 'src/assets/js/*.js',
                tasks: ['jshint', 'copy:js', 'uglify']
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['sass']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('sass', ['compass']);
};
