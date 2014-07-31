'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('javascript/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('images/min'))
    .pipe($.size({title: 'images'}));
});

gulp.task('styles', function () {
  return gulp.src(['stylesheets/**/*.scss'])
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: ['stylesheets', 'libs', 'libs/bootstrap-sass-official/assets/stylesheets/']
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size({title: 'styles'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Watch Files For Changes & Reload
gulp.task('serve', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: ['.tmp', '']
    }
  });

  gulp.watch(['**/*.html'], reload);
  gulp.watch(['stylesheets/**/*.scss'], ['styles:scss']);
  gulp.watch(['javascript/**/*.js'], ['jshint']);
  gulp.watch(['images/**/*'], reload);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['jshint', 'images'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://example.com',
  strategy: 'mobile'
}));

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
