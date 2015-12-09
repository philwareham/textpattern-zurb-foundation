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
                templates: 'templates/'
            },
            dest: {
                css: 'public/assets/css/',
                js: 'public/assets/js/',
                templates: 'public/templates/'
            }
        },

        // Set up timestamp.
        opt : {
            timestamp: '<%= new Date().getTime() %>'
        },

        // Minified versions of CSS files within `css/`.
        cssmin: {
            main: {
                expand: true,
                cwd: '<%= paths.dest.css %>',
                src: ['*.css', '!*.min.css'],
                dest: '<%= paths.dest.css %>',
                ext: '.min.css'
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
                    {
                        expand: true,
                        cwd: '<%= paths.src.templates %>',
                        src: ['**'],
                        dest: '<%= paths.dest.templates %>'
                    }
                ]
            }
        },

        // Add vendor prefixed styles and other post-processing transformations.
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: [
                            '> 1%',
                            'last 2 versions'
                        ]
                    })
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.dest.css %>',
                        src: ['*.css', '!*.min.css'],
                        dest: '<%= paths.dest.css %>'
                    }
                ]
            }
        },

        // Sass configuration.
        sass: {
            options: {
                includePaths: ['node_modules/foundation-sites/scss']
            },
            dist: {
                options: {
                    outputStyle: 'expanded', // outputStyle = expanded, nested, compact or compressed.
                    sourceMap: true
                },
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

        // Uglify and copy JavaScript files from `node_modules` and `js` to `public/assets/js/`.
        uglify: {
            options: {
                compress: true,
                mangle: true,
                sourceMap: true
            },
            files: {
                src: [
                    'node_modules/foundation-sites/js/**/*.js'
                    // Ignore JavaScript modules that you do not require in your project.
                    //, '!foundation.abide.js'
                    //, '!foundation.accordion.js'
                    //, '!foundation.accordionMenu.js'
                    //, '!foundation.orbit.js'
                ],
                dest: '<%= paths.dest.js %>foundation.min.js'
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: '<%= paths.src.sass %>**',
                tasks: ['sass']
            },
            js: {
                files: '<%= paths.src.js %>**',
                tasks: ['uglify']
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['sasslint', 'sass', 'postcss', 'cssmin', 'replace', 'uglify']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('setup', ['shell:setup']);
    grunt.registerTask('travis', ['build']);
};
