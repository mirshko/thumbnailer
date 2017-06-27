// Variables

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

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

// BUILD
gulp.task('build', ['styles', 'scripts'], function () {});

// COMPILE SASS
gulp.task('styles', function () {
	return gulp.src('./scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(rename('master.min.css'))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

// UGLIFY SCRIPTS
gulp.task('scripts', function () {
	return gulp.src('js/**/*.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
});
