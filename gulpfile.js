var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
	wiredep = require('wiredep'),
	connect = require('gulp-connect');

function handleError (err) {
	console.log(err.toString());
	this.emit('end');
}

gulp.task('build:css', function() {
	return gulp
		.src('app/assets/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', handleError))
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(connect.reload());
});

gulp.task('build:js', function() {
	return gulp
		.src([
			'app/assets/js/main.js',
			'app/assets/js/{config,constants,controllers,directives,filters,interceptors,services}/*.js'
		])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(concat('app.js'))
		.pipe(ngAnnotate({
			single_quotes: true
		}).on('error', handleError))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(connect.reload());
});

gulp.task('build', ['build:css', 'build:js']);

gulp.task('lint', function() {
	return gulp
		.src([
			'gulpfile.js',
			'app/assets/js/{main,*/*}.js',
			'tests/{,e2e/,unit/}*.js',
		])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('serve', function() {
	connect.server({
		root: 'app',
		port: 9000,
		livereload: true,
		middleware: function() {
			var history = require('connect-history-api-fallback');
			return [history()];
		}
	});
});

gulp.task('reload', function() {
	return gulp
		.src('app/**/*.html')
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('app/assets/scss/{,*/_}*.scss', ['build:css']);
	gulp.watch('app/assets/js/{main,*/*}.js', ['build:js']);
	gulp.watch('app/{index,views/{,*/}*}.html', ['reload']);
});

gulp.task('default', ['build', 'serve', 'watch']);
