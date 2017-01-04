var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

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