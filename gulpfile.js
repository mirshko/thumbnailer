// Variables

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var surge = require('gulp-surge');
var uglify = require('gulp-uglify');
var xo = require('gulp-xo');
var notify = require('gulp-notify');

// BROWSER-SYNC
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});
});

// SERVE
gulp.task('default', ['styles', 'browser-sync'], function () {
	gulp.watch('./scss/**/*.scss', ['styles']);
	gulp.watch('./js/*.js', ['scripts']);
	gulp.watch('./*.html').on('change', browserSync.reload);
});

// COMPILE SASS
gulp.task('styles', function () {
	return gulp.src('./scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', function (err) {
			notify().write(err);
			this.emit('end');
		}))
		.pipe(rename('master.min.css'))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

// UGLIFY SCRIPTS
gulp.task('scripts', function () {
	return gulp.src('./js/*.js')
		.pipe(uglify())
		// .pipe(xo())
		.pipe(rename('master.min.js'))
		.pipe(gulp.dest('./dist/'));
});

// DEPLOY TO SURGE.SH
gulp.task('deploy', [], function () {
	return surge({
		project: './',
		domain: 'thumbnailer.reiner.space'
	});
});
