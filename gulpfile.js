const CI = process.env.CI === 'true';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const watch = require('gulp-watch');
const batch = require('gulp-batch');

const sources = ['main.js', './lib/**/*.js'];
const tests = ['./test/**/*.test.js'];

gulp.task('test', () =>
  gulp.src(tests, { read: false })
    .pipe(mocha({
      require: ['./test/setup.js'],
      reporter: CI ? 'spec' : 'nyan'
    }))
);

gulp.task('watch', function () {
  watch(sources.concat(tests), batch(function (events, done) {
    gulp.start('test', done);
  }));
});
