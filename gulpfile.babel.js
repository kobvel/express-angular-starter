// generated on 2016-01-06 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gulpNodemon from 'gulp-nodemon';
import apidoc from'gulp-apidoc';
import mocha from 'gulp-mocha';
import {stream as wiredep} from 'wiredep';
import runSequence from 'run-sequence';
import modRewrite from 'connect-modrewrite';
import childProcess from 'child_process';
import webpack from 'webpack';
import path from 'path';
import sync from 'run-sequence';
import rename from 'gulp-rename';
import template from 'gulp-template';
import fs from 'fs';
import yargs from 'yargs';
import lodash from 'lodash';
import gutil from 'gulp-util';
import serve from 'browser-sync';
import del from 'del';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';

const protractor = gulpProtractor.protractor;
const webdriver_update = gulpProtractor.webdriver_update;
const webdriver_standalone = gulpProtractor.webdriver_standalone;
const reload = browserSync.reload;
const $ = gulpLoadPlugins();

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

/**
 *
 * SERVER
 *
 *
 */

gulp.task('api:lint', lint('api/**/**/*.js'));

//gulp lint has some bugs with the fix option
gulp.task('api:lint:fix', (done) => {
  childProcess.exec('npm run lint:fix', (error, stdout, stderr) => {
    done(error || stderr);
  });
});

gulp.task('api:serve', ['api:lint'],() => {
  gulpNodemon({
    script: 'api/start.js',
  });
});

gulp.task('api:cluster', ['api:lint'],() => {
  gulpNodemon({
    script: 'api/start_clusters.js',
  });
});

gulp.task('api:tests', ['api:lint'], (done) => {
  let error;
  process.env.NODE_ENV = 'test';
  return gulp.src('api/tests/**/*.js', {
    read: false
  })
  .pipe(mocha({
    require: 'api/tests/helpers',
    reporter: 'spec',
    slow: 5000,
    timeout: 10000,
    //global: 'NODE_ENV=test'
  }))
  .once('error', () => {
    //process.exit(1);
  })
  .once('end', () => {
    process.env.NODE_ENV = 'development';
    process.exit();
  });
});

gulp.task('api:docs', [], (done) => {
  apidoc({
    src: "api/routes/",
    dest: "client/web/dist/apidoc/",
    includeFilters: [ ".*\\.js$" ]
  }, done);
});




/**
 *
 * CLIENT
 *
 *
 */

const rootClient = 'client';

// helper method for resolving paths
const resolveToApp = (glob = '') => {
  return path.join(rootClient, 'app', glob); // app/{glob}
};

const resolveToComponents = (glob = '') => {
  return path.join(rootClient, 'app/components', glob); // app/components/{glob}
};

// map of all paths
const paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
  styl: resolveToApp('**/*.styl'), // stylesheets
  html: [
    resolveToApp('**/*.html'),
    path.join(rootClient, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, rootClient, 'app/app.js')
  ],
  output: rootClient,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  dest: path.join(__dirname, 'dist')
};

// use webpack.config.js to build modules
gulp.task('webpack', ['clean'], (cb) => {
  const config = require('./webpack.dist.config');
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});

gulp.task('web:lint', lint(paths.js));

gulp.task('web:serve', () => {
  const config = require('./webpack.dev.config');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
  ].concat(paths.entry);

  var compiler = webpack(config);

  serve({
    port: process.env.PORT || 9000,
    open: false,
    server: {baseDir: rootClient},
    middleware: [
      historyApiFallback(),
      webpackDevMiddleware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpackHotMiddleware(compiler)
    ]
  });
});

gulp.task('watch', ['serve']);

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
});


gulp.task('default', ['api:serve', 'web:serve'], () => {});
