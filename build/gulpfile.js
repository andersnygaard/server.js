var gulp = require('gulp');
var amdOptimize = require('gulp-amd-optimizer');
var concat = require('gulp-concat-sourcemap');
var uglify = require('gulp-uglify');

var requireConfig = {
  baseUrl: __dirname + "\\..\\src\\"
};
var options = {
  umd: true
};

gulp.task('default', function () {
	
  return gulp.src('../src/*.js')
    .pipe(amdOptimize(requireConfig, options))
    .pipe(concat('server.debug.js'))
    .pipe(gulp.dest('../js'));
});