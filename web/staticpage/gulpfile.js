// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename'),
    sourcemaps = require("gulp-sourcemaps"),
    del = require('del'),
    babel = require("gulp-babel"),
    browserSync = require('browser-sync').create();
var tinypng = require('gulp-tinypng-compress');

//Define the app path
var path = {
    all:[
        './template/*.html',
        './assets/css/*.css',
        './assets/js/*.js',
        './assets/js/lib/*.js'
    ],
    template:['./template/*.html'],
    css:['./assets/css/*.css'],
    js:[
        './assets/js/lib/zepto.min.js',
        //'./assets/js/lib/pre-loader.js',
        //'./assets/js/lib/reqAnimate.js',
        //'./assets/js/rem.js',
        //'./assets/js/common.js',
        //'./assets/js/wxshare.js',
        //'./assets/js/api.js',
        //'./assets/js/home.js'
    ],
    images:[
        './assets/*.{png,jpg,jpeg}',
        './assets/*/*.{png,jpg,jpeg}',
        './assets/*/*/*.{png,jpg,jpeg}'
    ],
};
// Browser-sync
gulp.task('browser-sync', function() {
    browserSync.init(path.all,{
        server: {
            baseDir: "./",
            startPath: ''
        }
    });
});

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
});


//css
gulp.task('css',['clean'],function () {
    // 1. 找到文件
    gulp.src(path.css)
        //.pipe(concat('style.css'))
        // 2. 压缩文件
        .pipe(minify())
        // 3. 另存为压缩文件
        .pipe(gulp.dest('./dist/css'));
});

// Concatenate & Minify
gulp.task('scripts_welcome',['clean'], function() {
    return gulp.src(path.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// Concatenate & Minify
gulp.task("tinypng", function(){
    gulp.src(path.images)
        .pipe(tinypng({
            key: '-ID8TBnbSlRuMCc_mMagta65Q7IDyaQ-',
            sigFile: './.tinypng-sigs',
            log: true
        })).on('error', function(err) {
            console.error(err.message);
        })
        .pipe(gulp.dest('./dist/'));
});

// Watch Files For Changes
gulp.task('watch', ['clean'],function() {
    gulp.watch(path.css,['css']);
});

// Default Task
gulp.task('default', ['watch', 'css','browser-sync']);


