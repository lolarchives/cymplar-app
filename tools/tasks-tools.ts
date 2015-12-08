import * as gulp from 'gulp';
import {join} from 'path';
import * as slash from 'slash';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
import * as tinylrFn from 'tiny-lr';

import {PATH, APP_BASE, APP_VERSION, LIVE_RELOAD_PORT} from './config';

export const tinylr = tinylrFn();

export function notifyLiveReload(changedFiles: string[]) {
  tinylr.changed({
    body: { files: changedFiles }
  });
}

export function injectableJsLibRef(): string[] {
  const injectables = obtainInjectableAssetsRef(PATH.src.jslib_inject, PATH.dest.app.lib);
  return injectables;
}

export function injectableCssLibRef(): string[] {
  const injectables = obtainInjectableAssetsRef(PATH.src.csslib, PATH.dest.app.css);
  return injectables;
}

function obtainInjectableAssetsRef(paths: string[], target = ''): string[] {
  return paths
    .filter(path => !/(\.map)$/.test(path))
    .map(path => join(target, slash(path).split('/').pop()));
}

export function transformPath(prefix: string): Function {
  const v = '?v=' + APP_VERSION;
  return function(filepath: string) {
    const filename = filepath.replace('/' + prefix, '') + v;
    arguments[0] = slash(join(APP_BASE, filename));
    return inject.transform.apply(inject.transform, arguments);
  };
}

// TODO: Add an interface to register more template locals.
export const templateLocals = {
  APP_VERSION,
  APP_BASE
};



