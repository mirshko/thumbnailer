var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var rename = require('gulp-rename');

// BROWSER-SYNC
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

// SERVE
gulp.task('serve', ['sass', 'browser-sync'], function() {
    gulp.watch('./scss/*.scss', ['sass']);
    gulp.watch('./*.html').on('change', browserSync.reload);
});

// COMPILE SASS
gulp.task('sass', function() {
    return gulp.src('./scss/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(rename('master.min.css'))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
});
