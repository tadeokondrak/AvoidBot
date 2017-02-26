const CI = process.env.CI === 'true';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const semistandard = require('gulp-semistandard');
const runSequence = require('run-sequence');

const sources = ['main.js', './lib/**/*.js'];
const tests = ['./test/*.test.js'];

gulp.task('test', function (cb) {
  runSequence(['tests', 'semistandard'], cb);
});

gulp.task('tests', () =>
  gulp.src(tests, { read: false })
    .pipe(mocha({
      require: ['./test/setup.js'],
      reporter: CI ? 'spec' : 'nyan'
    }))
);

gulp.task('semistandard', () =>
  gulp.src(sources.concat(tests))
    .pipe(semistandard())
    .pipe(semistandard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
);

gulp.task('watch', function () {
  watch(sources.concat(tests), batch(function (events, done) {
    gulp.start('test', done);
  }));
});
