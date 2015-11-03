import * as gulp from 'gulp';
import * as del from 'del';
import * as runSequence from 'run-sequence';
import * as plumber from 'gulp-plumber';
import * as typescript from 'gulp-typescript';
import * as sass from 'gulp-sass';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
import * as tslint from 'gulp-tslint';
import * as inlineNg2Template from 'gulp-inline-ng2-template';
import * as tslintStylish from 'gulp-tslint-stylish';
import * as shell from 'gulp-shell';
import {Server} from 'karma';

import {ENV, PATH} from './tools/config';

import {
compileTs,
injectableAssetsRef,
transformPath,
templateLocals,
tsProject
} from './tools/tasks-tools';

import {serveSPA, notifyLiveReload} from './server/bootstrap';

// --------------
// Client.
gulp.task('csslib.build.dev', () =>
  gulp.src(PATH.src.csslib)
    .pipe(gulp.dest(PATH.dest.dev.css))
);

gulp.task('font.build.dev', () =>
  gulp.src(PATH.src.font)
    .pipe(gulp.dest(PATH.dest.dev.font))
);

gulp.task('sass.build.dev', () =>
  gulp.src(`${PATH.src.base}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PATH.src.base))
);

gulp.task('sass.build.watch', () =>
  gulp.watch(`${PATH.src.base}/**/*.scss`, (evt) =>
    runSequence('sass.build.dev', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('jslib.build.dev', () => {
  const src = PATH.src.jslib_inject.concat(PATH.src.jslib_copy_only);
  return gulp.src(src)
    .pipe(gulp.dest(PATH.dest.dev.lib));
});

gulp.task('js.client.build.dev', () => {
  const filesToCompile = PATH.src.ts;
  return compileTs(filesToCompile);
});

gulp.task('tpl.build.dev', () =>
  gulp.src(PATH.src.tpl)
    .pipe(gulp.dest(PATH.dest.dev.component))
);

gulp.task('tpl.build.watch', () =>
  gulp.watch(PATH.src.tpl, (evt) =>
    runSequence('tpl.build.dev', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('index.build.dev', () => {

  const INDEX_INJECTABLES = injectableAssetsRef();
  const INDEX_INJECTABLES_TARGET = gulp.src(INDEX_INJECTABLES, { read: false });

  return gulp.src(PATH.src.index)
    .pipe(inject(INDEX_INJECTABLES_TARGET, {
      transform: transformPath('dev')
    }))
    .pipe(template(templateLocals))
    .pipe(gulp.dest(PATH.dest.dev.base));
});

gulp.task('index.build.watch', () =>
  gulp.watch(PATH.src.index, (evt) =>
    runSequence('index.build.dev', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('build.dev', (done: gulp.TaskCallback) =>
  runSequence('dist.clean',
    [
      'tslint',
      'jslib.build.dev',
      'sass.build.dev',
      'js.client.build.dev',
      'tpl.build.dev',
      'csslib.build.dev',
      'font.build.dev'
    ],
    'index.build.dev',
    done)
);

gulp.task('watch.dev', ['build.dev'], () =>
  gulp.watch(`${PATH.src.base}/**/*`, () => gulp.start('build.dev'))
);

// --------------
// Serve.
gulp.task('js.client.watch', () =>
  gulp.watch(PATH.src.ts, (evt) => {
    const filesToCompile = PATH.src.ts;
    compileTs(filesToCompile);
    notifyLiveReload([evt.path]);
  })
);

gulp.task('server.start', (done: gulp.TaskCallback) => {
  serveSPA();
  done();
});

gulp.task('serve.watch', [
  'js.client.watch',
  'index.build.watch',
  'tpl.build.watch',
  'sass.build.dev'
]);

gulp.task('serve', (done: gulp.TaskCallback) =>
  runSequence(`build.${ENV}`, 'server.start', 'serve.watch', done)
);

// --------------
// Test.
gulp.task('test.build', () => {

  const src = [`${PATH.src.base}/**/*.ts`, `!${PATH.src.base}/bootstrap.ts`];

  const result = gulp.src(src)
    .pipe(plumber())
    .pipe(inlineNg2Template({ base: PATH.src.base }))
    .pipe(typescript(tsProject));

  return result.js
    .pipe(gulp.dest(PATH.dest.test));
});

gulp.task('test.watch', ['test.build'], () =>
  gulp.watch(PATH.src.ts, () => gulp.start('test.build'))
);

gulp.task('karma.start', (done: gulp.TaskCallback) =>
  new Server({
    configFile: `${PATH.cwd}/karma.conf.js`,
    singleRun: true
  }, done).start()
);

gulp.task('test', (done: gulp.TaskCallback) =>
  runSequence('test.clean', 'test.build', 'karma.start', done)
);

// --------------
// Lint.
gulp.task('tslint', () => {

  const src = [
    `${PATH.src.base}/**/*.ts`,
    `${PATH.cwd}/server/**/*.ts`,
    `${PATH.cwd}/shared/**/*.ts`,
    `${PATH.tools}/**/*.ts`,    
    `${PATH.cwd}/gulpfile.ts`,
    `!${PATH.src.base}/**/*.d.ts`,
    `!${PATH.cwd}/server/**/*.d.ts`,
    `!${PATH.cwd}/shared/**/*.d.ts`,
    `!${PATH.tools}/**/*.d.ts`
  ];

  return gulp.src(src)
    .pipe(tslint())
    .pipe(tslint.report(tslintStylish, {
      emitError: false,
      configuration: {
        sort: true,
        bell: true
      }
    }));
});

// --------------
// Clean.
gulp.task('clean', ['dist.clean', 'test.clean', 'tmp.clean']);

gulp.task('dist.clean', () =>
  del(PATH.dest.base)
);

gulp.task('test.clean', () =>
  del(PATH.dest.test)
);

gulp.task('tmp.clean', () =>
  del(PATH.dest.tmp)
);

// --------------
// Postinstall.
gulp.task('npm', () =>
  shell.task(['npm prune'])
);

gulp.task('tsd', () =>
  shell.task(['tsd reinstall --clean', 'tsd link', 'tsd rebundle'])
);

gulp.task('postinstall', (done: gulp.TaskCallback) =>
  runSequence('clean', 'npm', done)
);
