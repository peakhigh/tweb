var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var pkg = require('./package.json');
var replace = require('gulp-replace');
var removeEmptyLines = require('gulp-remove-empty-lines');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less-main', function() {
    return gulp.src('less/main/style.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css/main'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Compile LESS files from /less into /css
gulp.task('less-dashboard', function() {
    return gulp.src('less/dashboard/style.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css/dashboard'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css-main', ['less-main', 'less-dashboard'], function() {
    return gulp.src('css/main/style.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css/main'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css-dashboard', ['less-main', 'less-dashboard'], function() {
    return gulp.src('css/dashboard/style.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css/dashboard'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js-main', function() {
    return gulp.src('js/main/main.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js/main'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js-dashboard', function() {
    return gulp.src('js/dashboard/dashboard.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js/dashboard'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

// Compile Actions
gulp.task('compile-actions', function() {
    fs = require("fs");
    var actions = fs.readdirSync('actions');
    var template = fs.readFileSync('action-template.html');
    actions.forEach(function(action){ 
        fs.writeFileSync('actions/'+action+'/'+action+'-compiled.html', template);

        gulp.src('actions/'+action+'/'+action+'-compiled.html')
        .pipe(inject(gulp.src(['actions/'+action+'/'+action+'.less']).pipe(less()).pipe(cleanCSS({ compatibility: 'ie8' })), {
            starttag: '<!-- inject:css -->',
            transform: function (filePath, file) {
                // return file contents as string 
                return file.contents.toString('utf8')
            }
        }))
        .pipe(inject(gulp.src(['actions/'+action+'/'+action+'.html']), {
            starttag: '<!-- inject:html -->',
            transform: function (filePath, file) {
                // return file contents as string 
                return file.contents.toString('utf8')
            }
        }))
        .pipe(inject(gulp.src(['actions/'+action+'/'+action+'.js']).pipe(uglify()), {
            starttag: '<!-- inject:js -->',
            transform: function (filePath, file) {
                // return file contents as string 
                return file.contents.toString('utf8')
            }
        }))
        .pipe(replace('<!-- inject:css -->', ''))
        .pipe(replace('<!-- inject:js -->', ''))
        .pipe(replace('<!-- inject:html -->', ''))
        .pipe(replace('<!-- endinject -->', ''))
        .pipe(removeEmptyLines({
            removeComments: true
        }))
        .pipe(replace(new RegExp('<style>\n</style>', 'g'), ''))
        .pipe(replace(new RegExp('<script type="text/javascript">\n</script>', 'g'), ''))
        .pipe(removeEmptyLines({
            removeComments: true
         }))
        .pipe(gulp.dest('actions/'+action));
    });
})

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))

    gulp.src(['node_modules/tether/dist/js/tether.js', 'node_modules/tether/dist/js/tether.min.js'])
        .pipe(gulp.dest('vendor/tether'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
})

// Run everything
gulp.task('default', ['less-main', 'minify-css-main', 'minify-js-main', 'less-dashboard', 'minify-css-dashboard', 'minify-js-dashboard', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less-main', 'minify-css-main', 'minify-js-main', 'less-dashboard', 'minify-css-dashboard', 'minify-js-dashboard'], function() {
    gulp.watch('less/*.less', ['less-main', 'less-dashboard']);
    gulp.watch('less/**/*.less', ['less-main', 'less-dashboard']);
    gulp.watch('css/*.css', ['minify-css-main', 'minify-css-dashboard']);
    gulp.watch('css/**/*.css', ['minify-css-main', 'minify-css-dashboard']);
    gulp.watch('js/*.js', ['minify-js-main', 'minify-js-dashboard']);
    gulp.watch('js/**/*.js', ['minify-js-main', 'minify-js-dashboard']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('templates/*.html', browserSync.reload);
    gulp.watch('templates/**/*.html', browserSync.reload);
    gulp.watch('templates/**/**/*.html', browserSync.reload);
    gulp.watch('less/**/*.less', browserSync.reload);
    gulp.watch('less/*.less', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
    gulp.watch('js/*.js', browserSync.reload);
});