var gulp = require('gulp'),
  connect = require('gulp-connect'),
  traceur = require('gulp-traceur');

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('all_root', function () {
    console.log('in all_root task');
    gulp.src('./app.js')
        .pipe(traceur({sourceMap: false}))
        .pipe(gulp.dest('dist'));

    gulp.src('./*.*')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./*.*'], ['all_root']);
});

gulp.task('default', ['connect', 'watch', 'all_root']);