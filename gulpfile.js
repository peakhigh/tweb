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
var fs = require("fs");
var compileHtmlModuleTemplate = fs.readFileSync('compile-module-template.html');

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
gulp.task('compile-html-modules', function() {
    var basePath = 'templates';
    var module_folders = ['pages','partials'];
    var currentPath =  null;
    var template_modules = fs.readdirSync(basePath);
    template_modules.forEach(function(template_module_path){  
        currentPath = basePath + '/' + template_module_path;
        if (fs.statSync(currentPath).isDirectory()) {
            template_module = fs.readdirSync(currentPath);
            module_folders.forEach(function(module_folder){
                currentPath = basePath + '/' + template_module_path + '/' + module_folder;
                if (fs.existsSync(currentPath) && fs.statSync(currentPath).isDirectory()) {
                    var possible_module_folder = fs.readdirSync(currentPath);
                    possible_module_folder.forEach(function(possible_module){
                        currentPath = basePath + '/' + template_module_path + '/' + module_folder + '/' + possible_module;
                        if (fs.statSync(currentPath).isDirectory()) {
                            gutil.log('compiling module', currentPath);   
                            compileHtmlTemplateModule(possible_module, currentPath, (basePath + '/' + template_module_path + '/' + module_folder))                         
                        }                                                
                    }); 
                } 
            })            
        }              
    });    
})

function watchHtmlDirForModuleChanges(baseDirPath){
    if (fs.existsSync(baseDirPath) && fs.statSync(baseDirPath).isDirectory()) {
        var possible_module_folder = fs.readdirSync(baseDirPath);
        possible_module_folder.forEach(function(possible_module){
            var currentPath = baseDirPath + '/' + possible_module;
            if (fs.existsSync(currentPath) && fs.statSync(currentPath).isDirectory()) {
                gutil.log('..', currentPath)
                gulp.watch(currentPath+'/**', function () {
                    gutil.log('compiling module', currentPath)
                    compileHtmlTemplateModule(possible_module, currentPath, baseDirPath)                         
                    // gulp.run(browserSync.reload);
                });
            }
        })
    }
}

function compileHtmlTemplateModule(moduleName, dirPath, parentDirPath) {
  fs.writeFileSync(dirPath + '.html', compileHtmlModuleTemplate);
  gulp.src(dirPath + '.html')
    .pipe(inject(gulp.src([dirPath+'/'+moduleName+'.less']).pipe(less()).pipe(cleanCSS({ compatibility: 'ie8' })), {
        starttag: '<!-- inject:css -->',
        transform: function (filePath, file) {
            // return file contents as string 
            return file.contents.toString('utf8')
        }
    }))
    .pipe(inject(gulp.src([dirPath+'/'+moduleName+'.html']), {
        starttag: '<!-- inject:html -->',
        transform: function (filePath, file) {
            // return file contents as string 
            return file.contents.toString('utf8')
        }
    }))
    .pipe(inject(gulp.src([dirPath+'/'+moduleName+'.js']).pipe(uglify()), {
        starttag: '<!-- inject:js -->',
        transform: function (filePath, file) {
            // return file contents as string 
            return file.contents.toString('utf8');
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
    .pipe(gulp.dest(parentDirPath));
}

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
gulp.task('default', ['compile-html-modules', 'less-main', 'minify-css-main', 'minify-js-main', 'less-dashboard', 'minify-css-dashboard', 'minify-js-dashboard', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'compile-html-modules', 'less-main', 'minify-css-main', 'minify-js-main', 'less-dashboard', 'minify-css-dashboard', 'minify-js-dashboard'], function() {
    gulp.watch('less/*.less', ['less-main', 'less-dashboard']);
    gulp.watch('less/**/*.less', ['less-main', 'less-dashboard']);
    gulp.watch('css/*.css', ['minify-css-main', 'minify-css-dashboard']);
    gulp.watch('css/**/*.css', ['minify-css-main', 'minify-css-dashboard']);
    // gulp.watch('css/main/*.css', ['minify-css-main']);
    // gulp.watch('css/dashboard/*.css', ['minify-css-dashboard']);
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
    //Reload the browse on every HTML module change
    watchHtmlDirForModuleChanges('templates/dashboard/pages')
    watchHtmlDirForModuleChanges('templates/dashboard/partials')
    watchHtmlDirForModuleChanges('templates/main/pages')
    watchHtmlDirForModuleChanges('templates/main/partials')
});