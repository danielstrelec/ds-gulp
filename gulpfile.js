'use strict';

// nastavení
var settings = {
  browsersync: {
    url: 'http://ds-gulp.test/',
    watch: ['*.html', '*.htm', '*.php']
  },
  css: {
    source: 'css/styles.scss',
    target: 'css/',
    filename: 'styles.css',
    watch: ['css/**/*.scss', 'css/**/*.css', '!css/styles.css'],
    components: 'css/components/**/*.scss'
  },
  js: {
    source: ['js/components/**/*.js', 'js/main.js'],
    target: 'js/',
    filename: 'scripts.js',
    watch: ['js/**/*.js', '!js/scripts.js'],
    components: ['js/components/**/*.js', 'js/main.js']
  },
  img: {
    source: 'img/**/*.{gif,jpg,jpeg,png}',
    target: 'img'
  }
};

// gulp
var gulp = require('gulp');
  // spojení souborů
  var concat = require('gulp-concat');
  // plumber - odchycení chybových hlášek
  var plumber = require('gulp-plumber');
  // přejmenování souborů
  var rename = require("gulp-rename");
// BrowserSync - live realod, server, ovládání prohlížeče
var browsersync = require('browser-sync');
// SASS - generování CSS z preprocesoru
var sass = require('gulp-sass');
// postCSS - postprocessing CSS (minifikace, autoprefixer...)
var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');
  var cssnano = require('cssnano');
// minifikace JavaScriptu
var uglify = require('gulp-uglify');
// Imagemin - optimalizace obrázků
var imagemin = require('gulp-imagemin');

// postCSS pluginy a nastavení
var postcssPlugins = [
  autoprefixer( { browsers: [ 'last 5 versions', 'ie >= 10', 'ios >= 7', 'android >= 4.4' ] }),
  cssnano()
];

// výpis chybových hlášek
var onError = function (err) {
  console.log(err);
  this.emit('end');
};

// nastavení BrowserSync
gulp.task('browser-sync', function() {
  browsersync({
    proxy: settings.browsersync.url
  });
});

// BrowserSync live-reload
gulp.task('browsersync-reload', function () {
    browsersync.reload();
});

// SASS kompilace
gulp.task('makecss', function() {
  return gulp.src(settings.css.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({ style: 'expanded' }))
    .pipe(postcss(postcssPlugins))
    .pipe(rename(settings.css.filename))
    .pipe(gulp.dest(settings.css.target))
    .pipe(browsersync.reload({ stream: true }));
});

// JavaScript - spojení souborů
gulp.task('makejs', function() {
  return gulp.src(settings.js.source, { base: './' })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat(settings.js.target + settings.js.filename))
    .pipe(uglify())
    .pipe(gulp.dest('./'))
    .pipe(browsersync.reload({ stream: true }));
});

// optimalizace obrázků
gulp.task('images', function() {
  return gulp.src(settings.img.source)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(imagemin({
      interlaced: true,
      pngquant: true,
      progressive: true
    }))
    .pipe(gulp.dest(settings.img.target))
});

// sledování změn souborů
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch(settings.css.watch, ['makecss', 'browsersync-reload']);
  gulp.watch(settings.js.watch, ['makejs', 'browsersync-reload']);
  gulp.watch(settings.browsersync.watch, ['browsersync-reload']);
});

// defaultni task
gulp.task('default', ['watch']);
