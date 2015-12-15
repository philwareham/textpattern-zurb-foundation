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

        // Run some tasks in parallel to speed up the build process.
        concurrent: {
            dist: [
                'css',
                'replace',
                'uglify'
            ]
        },

        // Minified versions of CSS files.
        cssmin: {
            files: {
                expand: true,
                cwd: '<%= paths.dest.css %>',
                src: ['*.css', '!*.min.css'],
                dest: '<%= paths.dest.css %>',
                ext: '.min.css'
            }
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
                    module: true,
                    require: true
                }
            },
            files: ['Gruntfile.js']
        },

        // Generate filename timestamps within template/mockup files.
        replace: {
            options: {
                patterns: [{
                    match: 'timestamp',
                    replacement: '<%= opt.timestamp %>'
                }]
            },
            files: {
                expand: true,
                cwd: '<%= paths.src.templates %>',
                src: ['**'],
                dest: '<%= paths.dest.templates %>'
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
                includePaths: ['node_modules/foundation-sites/scss'],
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
                // TODO: add app.js to the build process.
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: '<%= paths.src.sass %>**/*.scss',
                tasks: ['css']
            },
            js: {
                files: '<%= paths.src.js %>**',
                tasks: ['uglify']
            },
            templates: {
                files: '<%= paths.src.templates %>**',
                tasks: ['replace']
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['concurrent']);
    grunt.registerTask('css', ['sasslint', 'sass', 'postcss', 'cssmin']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('setup', ['shell:setup']);
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('travis', ['jshint', 'build']);
};
