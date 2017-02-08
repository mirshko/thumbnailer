var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var surge = require('gulp-surge');
var uglify = require('gulp-uglify');

var notify = require("gulp-notify");

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
	gulp.watch('./scss/**/*.scss', ['sass']);
	gulp.watch('./js/*.js', ['compress']);
	gulp.watch('./*.html').on('change', browserSync.reload);
});

// COMPILE SASS
gulp.task('sass', function() {
	return gulp.src('./scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', function(err) {
			notify().write(err);
			this.emit('end');
		}))
		.pipe(rename('master.min.css'))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

// UGLIFY SCRIPTS
gulp.task('compress', function() {
	return gulp.src('./js/*.js')
		.pipe(uglify())
		.pipe(rename('master.min.js'))
		.pipe(gulp.dest('./dist/'));
});

// DEPLOY TO SURGE.SH
gulp.task('deploy', [], function() {
	return surge({
		project: './',
		domain: 'thumbnailer.reiner.space'
	});
});
