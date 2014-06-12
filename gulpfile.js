var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('all_root', function () {
  console.log('in all_root task');
  gulp.src('./*.*')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./*.*'], ['all_root']);
});

gulp.task('default', ['connect', 'watch']);