import * as gulp from 'gulp';
import * as del from 'del';
import * as runSequence from 'run-sequence';
import * as plumber from 'gulp-plumber';
import * as typescript from 'gulp-typescript';
import * as sass from 'gulp-sass';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
import * as jslint from 'gulp-tslint';
import * as inlineNg2Template from 'gulp-inline-ng2-template';
import * as jslintStylish from 'gulp-tslint-stylish';
import * as shell from 'gulp-shell';
import * as nodemon from 'gulp-nodemon';
import {Server} from 'karma';
import * as ts from 'gulp-typescript';
import * as sourcemaps from 'gulp-sourcemaps';

import {PATH} from './tools/config';
import {notifyLiveReload} from './tools/tasks-tools';

import {
injectableAssetsRef,
transformPath,
templateLocals
} from './tools/tasks-tools';


const tsProject = ts.createProject('tsconfig.json');

function compileJs(src: string | string[], dest: string, inlineTpl?: boolean): NodeJS.ReadWriteStream {

  let result = gulp.src(src)
    .pipe(plumber())
    .pipe(sourcemaps.init());

  if (inlineTpl) {
    result = result.pipe(inlineNg2Template({ base: PATH.src.base }));
  }

  return result.pipe(typescript(tsProject))
    .js.pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
}

function lintJs(src: string | string[]) {
  return gulp.src(src)
    .pipe(jslint())
    .pipe(jslint.report(jslintStylish, {
      emitError: false,
      configuration: {
        sort: true,
        bell: true
      }
    }));
}

// --------------
// Client.
gulp.task('csslib.build', () =>
  gulp.src(PATH.src.csslib)
    .pipe(gulp.dest(PATH.dest.app.css))
);

gulp.task('font.build', () =>
  gulp.src(PATH.src.font)
    .pipe(gulp.dest(PATH.dest.app.font))
);

gulp.task('jslib.build', () => {
  const src: string[] = PATH.src.jslib_inject.concat(PATH.src.jslib_copy_only);
  return gulp.src(src)
    .pipe(gulp.dest(PATH.dest.app.lib));
});

gulp.task('css.build', () =>
  gulp.src(PATH.src.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PATH.dest.app.component))
);

gulp.task('css.watch', ['css.build'], () =>
  gulp.watch(PATH.src.css, (evt) =>
    runSequence('css.build', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('tpl.build', () =>
  gulp.src(PATH.src.tpl)
    .pipe(gulp.dest(PATH.dest.app.component))
);

gulp.task('tpl.watch', ['tpl.build'], () =>
  gulp.watch(PATH.src.tpl, (evt) =>
    runSequence('tpl.build', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('js.build', () => {
  return compileJs(PATH.src.ts, PATH.dest.app.base);
});

gulp.task('js.watch', ['js.build'], () =>
  gulp.watch(PATH.src.ts, (evt) => {
    runSequence('js.build', () => notifyLiveReload([evt.path]));
  })
);

gulp.task('index.build', () => {

  const INDEX_INJECTABLES = injectableAssetsRef();
  const INDEX_INJECTABLES_TARGET = gulp.src(INDEX_INJECTABLES, { read: false });

  return gulp.src(PATH.src.index)
    .pipe(inject(INDEX_INJECTABLES_TARGET, {
      transform: transformPath()
    }))
    .pipe(template(templateLocals))
    .pipe(gulp.dest(PATH.dest.app.base));
});

gulp.task('index.watch', ['index.build'], () =>
  gulp.watch(PATH.src.index, (evt) =>
    runSequence('index.build', () => notifyLiveReload([evt.path]))
  )
);

gulp.task('build', ['dist.clean'], (done: gulp.TaskCallback) =>
  runSequence(
    [
      'csslib.build',
      'font.build',
      'jslib.build',
      'css.build',
      'tpl.build',
      'jslint',
      'js.build'
    ],
    'index.build',
    done)
);

gulp.task('build.watch', ['dist.clean'], (done: gulp.TaskCallback) =>
  runSequence(
    [
      'csslib.build',
      'font.build',
      'jslib.build',
      'css.watch',
      'tpl.watch',
      'jslint.watch',
      'js.watch',
    ],
    'index.watch',
    done)
);

// --------------
// Serve.
gulp.task('server.watch', () => {
  nodemon({
    script: 'server/bootstrap.ts',
    watch: 'server',
    ext: 'ts',
    env: { 'profile': process.env.profile },
    execMap: {
      ts: 'ts-node'
    }
  }).on('restart', () => {
    process.env.RESTART = true;
  });
});

gulp.task('serve', (done: gulp.TaskCallback) =>
  runSequence('build.watch', 'server.watch', done)
);

// --------------
// Test.
gulp.task('test.build', () => {
  const src = [`${PATH.src.base}/**/*.ts`, `!${PATH.src.base}/bootstrap.ts`];
  return compileJs(src, PATH.dest.test, true);
});

gulp.task('test.watch', ['test.build'], () =>
  gulp.watch(PATH.src.ts, 'test.build')
);

gulp.task('karma.start', (done: gulp.TaskCallback) => {
  new Server({
    configFile: `${PATH.cwd}/karma.conf.js`,
    singleRun: true
  }).start();
  done();
});

gulp.task('test', ['test.clean'], (done: gulp.TaskCallback) =>
  runSequence(['jslint', 'test.build'], 'karma.start', done)
);

// --------------
// Lint.
gulp.task('jslint', () =>
  lintJs(PATH.jslint)
);

gulp.task('jslint.watch', ['jslint'], () =>
  gulp.watch(PATH.jslint, (evt) =>
    lintJs(evt.path)
  )
);

// --------------
// Clean.
gulp.task('clean', ['dist.clean', 'test.clean', 'tmp.clean']);

gulp.task('dist.clean', () =>
  del(PATH.dest.app.base)
);

gulp.task('test.clean', () =>
  del(PATH.dest.test)
);

gulp.task('tmp.clean', () =>
  del(PATH.dest.tmp)
);

// --------------
// Postinstall.
gulp.task('npm', (done: gulp.TaskCallback) => {
  shell.task(['npm prune']);
  done();
});

gulp.task('tsd', (done: gulp.TaskCallback) => {
  shell.task(['tsd reinstall --clean', 'tsd link', 'tsd rebundle']);
  done();
});

gulp.task('postinstall', (done: gulp.TaskCallback) =>
  runSequence('clean', 'npm', done)
);
