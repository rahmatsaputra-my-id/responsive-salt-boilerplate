const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require("gulp-uglify");
const injectPartials = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const path = require('path');
const clean = require('gulp-clean');
const runs = require('run-sequence');
const log = require('fancy-log');

/* Target dest for compiled task */
const targetPath = "../public";

/* Path URL list */
const paths = {
  sass:
    {
      vendor:
        [
          "node_modules/bootstrap/scss/bootstrap.scss",
          "vendor/font-awesome/css/font-awesome.min.css",
          "node_modules/slick-carousel/slick/slick.css",
          "node_modules/slick-carousel/slick/slick-theme.css",
        ],
      main:
        [
          'sass/*.scss'
        ],
      pages: 
        [
          'sass/*pages*/*.scss'
        ]
    },       
  js:
    {
      vendor:
        [
          "node_modules/jquery/dist/jquery.min.js",
          "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
          "node_modules/slick-carousel/slick/slick.min.js"
        ],
      app:
        [
          'script/*.js'
        ],
      includes: 
        [
          'script/*includes*/*.js',
          'script/*helper*/*.js'
        ]
    }
};

/* === Task Cleaner Start === */

/* Clean CSS main */
function clean_sass_main() {
  return gulp.src([
    (targetPath + '/assets/css/main.css'), 
    (targetPath + '/assets/css/maps/main.css.map')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}

/* Clean CSS Pages */
function clean_sass_pages() {
  return gulp.src([
    (targetPath + '/assets/css/pages/*.css'), 
    (targetPath + '/assets/css/maps/pages/*.css.map')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}

/* Clean CSS Vendor */
function clean_sass_vendor() {
  return gulp.src([
    (targetPath + '/assets/css/vendor/*.css'), 
    (targetPath + '/assets/css/vendor/maps/*.css.map')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}

/* Clean JS App */
function clean_js_app() {
  return gulp.src([
    (targetPath + '/assets/js/*.js')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}

/* Clean JS Includes */
function clean_js_includes() {
  return gulp.src([
    (targetPath + '/assets/js/*includes*/*.js'),
    (targetPath + '/assets/js/*helper*/*.js')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}

/* Clean JS Vendor */
function clean_js_vendor() {
  return gulp.src([
    (targetPath + '/assets/js/vendor/*.js')
    ], {read: false, allowEmpty: true})
  .pipe(clean({force: true}));
}
/* === Task Cleaner End === */

/* Task for CSS main.css */
function sass_main() {
  return gulp.src(paths.sass.main)
    .pipe(concat('main.css'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error scss', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(targetPath + '/assets/css'))
    .pipe(browserSync.stream())
}

/* Task for CSS in 'pages' folder */
function sass_pages() {
  return gulp.src(paths.sass.pages)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error scss', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(targetPath + '/assets/css'))
    .pipe(browserSync.stream())
}

/* Task for CSS vendor */
function sass_vendor() {
  return gulp.src(paths.sass.vendor)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error scss', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(targetPath + '/assets/css/vendor'))
    .pipe(browserSync.stream())
}

/* Task for JS app */
function js_app() {
  return gulp.src(paths.js.app, { sourcemaps: true })
    .pipe(concat('app.min.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(targetPath + '/assets/js', { sourcemaps: true }))
    .pipe(browserSync.stream())
}

/* Task for JS in 'includes' & 'helper' folder */
function js_includes() {
  return gulp.src(paths.js.includes, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(targetPath + '/assets/js', { sourcemaps: true }))
    .pipe(browserSync.stream())
}

/* Task for JS Vendor */
function js_vendor() {
  return gulp.src(paths.js.vendor, { sourcemaps: true })
    .pipe(uglify())
    .pipe(gulp.dest(targetPath + '/assets/js/vendor', { sourcemaps: true }))
    .pipe(browserSync.stream())
}

/* Task HTML Build */
function html() {
  return gulp.src(("views/pages/*.html"))
    .pipe(injectPartials({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest((targetPath)))
    .pipe(browserSync.stream())
}

/* Task Watch */
function watcher() {
  gulp.watch('sass/**/*', gulp.series('sass_main'));
  gulp.watch(paths.sass.pages, gulp.series('sass_pages'));
  gulp.watch(paths.sass.vendor, gulp.series('sass_vendor'));
  gulp.watch(paths.js.app, gulp.series('js_app'));
  gulp.watch(paths.js.includes, gulp.series('js_includes'));
  gulp.watch(paths.js.vendor, gulp.series('js_vendor'));
}

/* Task BrowserSync */
function initBrowserSync() {
  browserSync.init({
    server: {
      baseDir: [(targetPath)]
    }
  });

  gulp.watch('views/**/*.html', gulp.series(html));
}

/* Task List */
gulp.task('sass_main', gulp.series(clean_sass_main, sass_main));
gulp.task('sass_pages', gulp.series(clean_sass_pages, sass_pages));
gulp.task('sass_vendor', gulp.series(clean_sass_vendor, sass_vendor));
gulp.task('js_app', gulp.series(clean_js_app, js_app));
gulp.task('js_includes', gulp.series(clean_js_includes, js_includes));
gulp.task('js_vendor', gulp.series(clean_js_vendor, js_vendor));

/* === Init Task === */
gulp.task('init', gulp.parallel('sass_main', 'sass_pages', 'sass_vendor', 'js_app', 'js_includes', 'js_vendor'));



/* FE Slicing Commmand type "gulp" */
exports.default = gulp.parallel('init', html, watcher, initBrowserSync);

/* BE Integrated Commmand type "gulp dev" */
exports.dev = gulp.parallel('init', watcher);