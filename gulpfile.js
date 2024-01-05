const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const indent = require('gulp-file-include/lib/indent');

gulp.task('fileinclude', function(callback) {
    gulp.src(['./source/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true,
        }))
        .pipe(gulp.src(['./source/style.css','./source/main.js', './source/CNAME']))
        .pipe(gulp.dest('./build/'));


    gulp.src(['./source/media/*'])
        .pipe(gulp.dest('./build/media'));

    callback();
});