import * as gulp from 'gulp';
import {join} from 'path';
import * as slash from 'slash';
import * as ts from 'gulp-typescript';
import * as sourcemaps from 'gulp-sourcemaps';
import * as plumber from 'gulp-plumber';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
import * as typescript from 'gulp-typescript';
import * as tinylrFn from 'tiny-lr';

import {PATH, APP_BASE, APP_VERSION, LIVE_RELOAD_PORT} from './config';

const tinylr = tinylrFn();
tinylr.listen(LIVE_RELOAD_PORT);

export function notifyLiveReload(changedFiles: string[]) {
  tinylr.changed({
    body: { files: changedFiles }
  });
}

export function injectableAssetsRef(): string[] {

  const aux1 = obtainInjectableAssetsRef(PATH.src.jslib_inject, PATH.dest.dev.lib);
  const aux2 = obtainInjectableAssetsRef(PATH.src.csslib, PATH.dest.dev.css);

  const injectables = aux1.concat(aux2);

  return injectables;
}

function obtainInjectableAssetsRef(paths: string[], target = ''): string[] {
  return paths
    .filter(path => !/(\.map)$/.test(path))
    .map(path => join(target, slash(path).split('/').pop()));
}

export function transformPath(env: string) {
  const v = '?v=' + APP_VERSION;
  return function(filepath: string) {
    const filename = filepath.replace('/' + PATH.dest[env].base, '') + v;
    arguments[0] = join(APP_BASE, filename);
    return inject.transform.apply(inject.transform, arguments);
  };
}

// TODO: Add an interface to register more template locals.
export const templateLocals = {
  APP_VERSION,
  APP_BASE
};

export const tsProject = ts.createProject('tsconfig.json');

export function compileTs(filesToCompile: string[]) {

  const result = gulp.src(filesToCompile)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(typescript(tsProject));

  return result.js
    .pipe(sourcemaps.write())
    .pipe(template(templateLocals))
    .pipe(gulp.dest(PATH.dest.dev.base));
}

