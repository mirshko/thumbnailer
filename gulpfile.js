var gulp 		= require('gulp');
var browserSync = require('browser-sync').create();
var sass 		= require('gulp-sass');
// var uglify 		= require('gulp-uglify');
// var concat 		= require('gulp-concat');
var surge 		= require('gulp-surge')

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
        .pipe(gulp.dest("./dist/"))
        .pipe(browserSync.stream());
});

// CONCAT & UGLY JS
// gulp.task('scripts', function() {
//     return gulp.src('./js/**/*.js')
//         .pipe(concat('materialize.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('./dist'));
// });

// DEPLOY TO SURGE.SH FOR DEVELOPMENT
gulp.task('deploy-dev', [], function() {
    return surge({
        project: './', // PATH TO YOUR STATIC BUILD DIRECTORY
        domain: 'reiner-io.surge.sh' // YOUR DOMAIN OR SURGE SUBDOMAIN
    });
});

// DEPLOY TO SURGE.SH
gulp.task('deploy', [], function() {
    return surge({
        project: './', // PATH TO YOUR STATIC BUILD DIRECTORY
        domain: 'www.reiner.io' // YOUR DOMAIN OR SURGE SUBDOMAIN
    });
});
