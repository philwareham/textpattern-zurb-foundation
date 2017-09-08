module.exports = function (grunt)
{
    'use strict';

    // Load all Grunt tasks.
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Set up paths.
        paths: {
            src: {
                sass: 'scss/',
                js: 'js/',
                templates: 'templates/'
            },
            dest: {
                css: 'public/assets/css/',
                js: 'public/assets/js/',
                templates: 'public/templates/'
            }
        },

        // Clean distribution and temporary directories to start afresh.
        clean: [
            '<%= paths.dest.css %>',
            '<%= paths.dest.js %>'
        ],

        concat: {
            dist: {
                src: [
                    // Option 1: All Foundation JavaScript.
                    'node_modules/foundation-sites/dist/js/foundation.min.js'

                    // Option 2: Selective Foundation JavaScript.
                    //'node_modules/foundation-sites/dist/js/plugins*/*.min.js'
                    // Ignore JavaScript plugins that you do not require in your project, for example:
                    //, '!foundation.abide.min.js'
                    //, '!foundation.accordion.min.js'
                    //, '!foundation.accordionMenu.min.js'
                    //, '!foundation.core.min.js'
                ],
                dest: '<%= paths.dest.js %>foundation.min.js',
            }
        },

        // Run some tasks in parallel to speed up the build process.
        concurrent: {
            dist: [
                'css',
                'concat',
                'uglify'
            ]
        },

        // Check code quality of Gruntfile.js using JSHint.
        jshint: {
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                es3: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                browser: true,
                globals: {
                    jQuery: false,
                    $: false,
                    module: true,
                    require: true
                }
            },
            files: [
                'Gruntfile.js',
                '<%= paths.src.js %>**/*.js'
            ]
        },

        // Add vendor prefixed styles and other post-processing transformations.
        postcss: {
            options: {
                processors: [
                    require('autoprefixer'),
                    require('cssnano')
                ]
            },
            files: {
                expand: true,
                cwd: '<%= paths.dest.css %>',
                src: ['*.css', '!*.min.css'],
                dest: '<%= paths.dest.css %>'
            }
        },

        // Sass configuration.
        sass: {
            options: {
                includePaths: [
                    'node_modules/foundation-sites/scss',
                    'node_modules/motion-ui/src'
                ],
                outputStyle: 'expanded', // outputStyle = expanded, nested, compact or compressed.
                sourceMap: true
            },
            dist: {
                files: {
                    '<%= paths.dest.css %>app.css': '<%= paths.src.sass %>app.scss'
                }
            }
        },

        // Validate Sass files via sass-lint.
        sasslint: {
            options: {
                configFile: '.sass-lint.yml'
            },
            target: ['<%= paths.src.sass %>**/*.scss']
        },

        // Uglify and copy `app.js` to `public/assets/js/`.
        uglify: {
            dist: {
                files: [
                    {
                        '<%= paths.dest.js %>app.js': ['<%= paths.src.js %>app.js']
                    }
                ]
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: '<%= paths.src.sass %>**/*.scss',
                tasks: 'css'
            },
            js: {
                files: '<%= paths.src.js %>**',
                tasks: ['jshint', 'uglify']
            },
            templates: {
                files: '<%= paths.src.templates %>**',
                tasks: 'replace'
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['clean', 'concurrent']);
    grunt.registerTask('css', ['sasslint', 'sass', 'postcss']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('travis', ['jshint', 'build']);
};
