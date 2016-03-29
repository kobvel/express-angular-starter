// generated on 2016-01-06 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gulpNodemon from 'gulp-nodemon';
import apidoc from'gulp-apidoc';
import browserSync from 'browser-sync';
import del from 'del';
import mocha from 'gulp-mocha';
import {stream as wiredep} from 'wiredep';
import runSequence from 'run-sequence';
import modRewrite  from 'connect-modrewrite';
import childProcess from 'child_process';
import karma from 'karma';
import gulpProtractor from 'gulp-protractor';
import traceur from 'gulp-traceur-compiler';

const protractor = gulpProtractor.protractor;
const webdriver_update = gulpProtractor.webdriver_update;
const webdriver_standalone = gulpProtractor.webdriver_standalone;
const reload = browserSync.reload;
const $ = gulpLoadPlugins();

gulp.task('styles', () => {
  return gulp.src('client/web/app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

gulp.task('api:lint', lint('api/**/**/*.js'));

//gulp lint has some bugs with the fix option
gulp.task('api:lint:fix', (done) => {
  childProcess.exec('npm run lint:fix', (error, stdout, stderr) => {
    done(error || stderr);
  });
});

gulp.task('web:lint', lint('client/web/app/modules/**/*.js'));

gulp.task('lint', ['api:lint', 'web:lint']);

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', 'client/web']});

  return gulp.src('client/web/app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', traceur()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('client/web/dist'));
});

gulp.task('angulartemplates', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('client/web/app/modules/*/**/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', traceur()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('client/web/dist/modules'));
});

gulp.task('sprite', () =>  {
  return gulp.src('client/web/app/images/sprites/*.png').pipe($.spritesmith({
    imgName: 'client/web/app/images/sprite.png',
    cssName: 'client/web/app/styles/_sprite.scss'
  })).pipe(gulp.dest('./'));
});

gulp.task('images', () => {
  return gulp.src('client/web/app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('client/web/dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('client/web/app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('client/web/dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'client/web/app/*.*',
    '!client/web/app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('client/web/dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('web:serve', ['web:lint', 'styles', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    https: true,
    server: {
      baseDir: ['.tmp', 'client/web/app', 'client/web'],
      middleware: [
          modRewrite([
              '^[^\\.]*$ /index.html [L]'
          ])
      ],
      routes: {
        '/bower_components': 'client/web/bower_components'
      }
    }
  });

  gulp.watch([
    'client/web/app/*.html',
    'client/web/app/scripts/**/*.js',
    'client/web/app/images/**/*',
    'client/web/app/modules/**/*.js',
    'client/web/app/modules/**/*.html',
    '.tmp/fonts/**/*'
  ]).on('change', () => gulp.start('web:lint'), reload);

  gulp.watch('client/web/app/styles/**/*.scss', ['styles']);
  gulp.watch('client/web/app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});


gulp.task('web:serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    https: true,
    server: {
      middleware: [
          modRewrite([
              '!\\.\\w+$ /index.html [L]'
          ])
      ],
      baseDir: ['client/web/dist']
    }
  });
});

gulp.task('web:serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    https: true,
    server: {
      baseDir: 'client/web/test',
      middleware: [
          modRewrite([
              '!\\.\\w+$ /index.html [L]'
          ])
      ],
      routes: {
        '/bower_components': 'client/web/bower_components'
      }
    }
  });

  gulp.watch('client/web/test/spec/**/*.js').on('change', reload);
  gulp.watch('client/web/test/spec/**/*.js', ['lint:test']);
});

// Run karma tests
gulp.task('web:test:karma', (done) => {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('web:test:e2e', (done) => {
  runSequence('env:test', 'protractor', done);
});

gulp.task('env:test', () => {
  //process.env.NODE_ENV = 'test';
});

// Protractor test runner task
gulp.task('protractor', ['webdriver_update'], () => {
  gulp.src([])
    .pipe(protractor({
      configFile: __dirname + '/protractor.conf.js'
    }))
    .on('end', () => {
      console.log('E2E Testing complete');
      // exit with success.
      process.exit(0);
    })
    .on('error', (err) => {
      console.log('E2E Tests failed');
      process.exit(1);
    });
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);


// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('client/web/app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('client/web/app/styles'));

  gulp.src('client/web/app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('client/web/app'));
});

gulp.task('build', ['web:lint', 'angulartemplates', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('client/web/dist/**/*').pipe($.size({title: 'build', gzip: true}));
});


/**
 *
 * API
 *
 *
 */

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




gulp.task('default', ['api:serve', 'web:serve'], () => {
  console.log('start!');
});
