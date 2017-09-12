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

        // Run some tasks in parallel to speed up the build process.
        concurrent: {
            dist: [
                'css',
                'jshint',
                'uglify'
            ]
        },

        // Check code quality of Gruntfile.js and site-specific JavaScript using JSHint.
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
                src: ['*.css'],
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
                sourceMap: false
            },
            dist: {
                files: {
                    '<%= paths.dest.css %>app.min.css': '<%= paths.src.sass %>app.scss'
                }
            }
        },

        // Validate Sass files via sass-lint.
        sasslint: {
            options: {
                configFile: '.sass-lint.yml'
            },
            target: [
                '<%= paths.src.sass %>**/*.scss',
                '!<%= paths.src.sass %>_settings.scss'
            ]
        },

        // Uglify and copy JavaScript files from framework plus `js/app.js` to `public/assets/js/`.
        uglify: {
            dist: {
                src: [
                    // Option 1: All Foundation JavaScript.
                    'node_modules/foundation-sites/dist/js/foundation.min.js',

                    // Option 2: Selective Foundation JavaScript.
                    //'node_modules/foundation-sites/dist/js/plugins*/*.min.js',
                    // Ignore JavaScript plugins that you do not require in your project, for example:
                    //'!foundation.abide.min.js',
                    //'!foundation.accordion.min.js',
                    //'!foundation.accordionMenu.min.js',
                    //'!foundation.drilldown.min.js',
                    //'!foundation.dropdown.min.js',
                    //'!foundation.dropdownMenu.min.js',
                    //'!foundation.equalizer.min.js',
                    //'!foundation.interchange.min.js',
                    //'!foundation.magellan.min.js',
                    //'!foundation.offcanvas.min.js',
                    //'!foundation.orbit.min.js',
                    //'!foundation.plugin.min.js',
                    //'!foundation.positionable.min.js',
                    //'!foundation.responsiveAccordionTabs.min.js',
                    //'!foundation.responsiveMenu.min.js',
                    //'!foundation.responsiveToggle.min.js',
                    //'!foundation.reveal.min.js',
                    //'!foundation.slider.min.js',
                    //'!foundation.smoothScroll.min.js',
                    //'!foundation.sticky.min.js',
                    //'!foundation.tabs.min.js',
                    //'!foundation.toggler.min.js',
                    //'!foundation.tooltip.min.js',
                    //'!foundation.util.box.min.js',
                    //'!foundation.util.core.min.js',
                    //'!foundation.util.imageLoader.min.js',
                    //'!foundation.util.keyboard.min.js',
                    //'!foundation.util.mediaQuery.min.js',
                    //'!foundation.util.motion.min.js',
                    //'!foundation.util.nest.min.js',
                    //'!foundation.util.timer.min.js',
                    //'!foundation.util.touch.min.js',
                    //'!foundation.util.triggers.min.js',

                    // Then add site-specific JavaScript at the end of file.
                    '<%= paths.src.js %>app.js'
                ],
                dest: '<%= paths.dest.js %>app.min.js'
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
