module.exports = function (grunt)
{
    'use strict';

    // Load Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');

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

        // Generate filename timestamps within template/mockup files.
        replace: {
            theme: {
                options: {
                    patterns: [{
                            match: 'timestamp',
                            replacement: '<%= opt.timestamp %>'
                    }]
                },
                files: [
                    {expand: true, cwd: 'templates/', src: ['**'], dest: 'public/templates/'}
                ]
            }
        },

        // Run Textpattern setup script.
        shell: {
            setup: {
                command: [
                    'php setup/setup.php'
                ].join('&&'),
                options: {
                    stdout: true
                }
            }
        },

        // Uglify and copy JavaScript files from `bower_components` and `js` to `public/assets/js/`.
        uglify: {
            dist: {
                // Preserve all comments that start with a bang (!) or include a closure compiler style.
                options: {
                    preserveComments: 'some'
                },

                files: [
                    {
                        expand: true,
                        cwd: 'js/',
                        src: '*.js',
                        dest: 'public/assets/js/'
                        // TODO: copy `bower_components` files.
                    }
                ]
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: 'scss/**',
                tasks: ['sass']
            },

            js: {
                files: 'js/*.js',
                tasks: ['uglify']
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['sass', 'replace', 'uglify']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('sass', ['compass']);
    grunt.registerTask('setup', ['shell:setup']);
    grunt.registerTask('travis', ['compass']);
};
