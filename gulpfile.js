const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const panini = require('panini');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const browsersync = require('browser-sync').create();


//browserlist target
const targetBrowsers = ['last 5 versions'];

//project paths
const PATHS = {
  scss: '_scss/**/*.scss',
  scssincludes: [],
  jsentry: '_js/app.js',
  js: 'js/**/*.js',
  sitefiles: ['src/**/*.html'],
  dest: {
    css: 'dist/assets/css',
    js: 'dist/assets/js'
  }
};


const WEBPACK_CONFIG = {
  context: __dirname+'/_js',
  entry: './app.js',
  output: {
    path: __dirname+'/dist/assets/js',
    filename: 'app.bundle.js'
  },
  bail: false,
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|assets|_scss|dist|src)/,
      loader: 'babel-loader',
      query: {
        presets: [['env', {"targets": {"browsers": targetBrowsers }}]]
      }
    }]
  }
};

//webpack js bundle
gulp.task('webpack', () => {
  var webpackCompiler = webpack(WEBPACK_CONFIG);
  webpackCompiler.watch({}, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({chunks: false}));
    browsersync.reload();
  });
});



gulp.task('server', () => {
  browsersync.init({
    server: './'
  }, (err, bs) => {
    //qrcode.generate('http://'+bs.utils.devIp[0]+':3000');
  });
});


gulp.task('panDulce', function() {
  gulp.src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
    .pipe(gulp.dest('./'));
    panini.refresh();
});


gulp.task('scss', () => {
  return gulp.src(PATHS.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: targetBrowsers
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.dest.css))
    .pipe(browsersync.stream())
});

let taskDefaults = ['panDulce', 'scss', 'webpack', 'server'];

gulp.task('default', taskDefaults, () => {
  gulp.watch(PATHS.scss, ['scss']);
  gulp.watch(PATHS.sitefiles, ['panDulce']);
  gulp.watch(PATHS.sitefiles).on('change', browsersync.reload);
});