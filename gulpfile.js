var gulp 		= require('gulp');
var browserSync = require('browser-sync').create();
var sass 		= require('gulp-sass');

// BROWSER-SYNC
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// SERVE
gulp.task('serve', ['sass', 'browser-sync'], function() {
    gulp.watch("./*.scss", ['sass']);
    // gulp.watch("./js/**/*.js", ['scripts']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// COMPILE SASS
gulp.task('sass', function() {
    return gulp.src("./*.scss")
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest("./"))
        .pipe(browserSync.stream());
});
