var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');

var paths = {
    scripts: ['app/static/index/js/**/*.js'],
    styles:  ['app/static/index/css/**/*.css']
};

gulp.task('scripts', function() {
    // concat and copy all JavaScript
    return gulp.src(paths.scripts)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('app/static/index/dist/js'))
    .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(uglify())    //压缩
    .pipe(gulp.dest('app/static/index/dist/js'));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('app/static/index/dist/css'))
    .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('default',['scripts', 'styles']);
