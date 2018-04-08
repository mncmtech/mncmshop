var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    cssmin    = require('gulp-cssmin'),
    rename    = require('gulp-rename'),
    clean     = require('gulp-clean'),
    del       = require('del');

gulp.task('sass', function () {
  gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(rename({suffix: '-min'}))
    .pipe(cssmin())
    .pipe(gulp.dest('./css'))
});

gulp.task('watch',function(){
  gulp.watch(['scss/**/*.scss'],['sass']);
});

gulp.task('clean', function() {
    return del([
        './webapp/robots.txt',
        // here we use a globbing pattern to match everything inside the `mobile` folder
        './webapp/**/*',
        // we don't want to clean this file though so we negate the pattern

    ]);
});

gulp.task('default',['sass','clean','watch']);

