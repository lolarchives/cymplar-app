import * as gulp from 'gulp';
import {join} from 'path';
import * as slash from 'slash';
import * as inject from 'gulp-inject';
import * as template from 'gulp-template';
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

  const aux1 = obtainInjectableAssetsRef(PATH.src.jslib_inject, PATH.dest.app.lib);
  const aux2 = obtainInjectableAssetsRef(PATH.src.csslib, PATH.dest.app.css);

  const injectables = aux1.concat(aux2);

  return injectables;
}

function obtainInjectableAssetsRef(paths: string[], target = ''): string[] {
  return paths
    .filter(path => !/(\.map)$/.test(path))
    .map(path => join(target, slash(path).split('/').pop()));
}

export function transformPath() {
  const v = '?v=' + APP_VERSION;
  return function(filepath: string) {
    const filename = filepath.replace('/' + PATH.dest.app.base, '') + v;
    arguments[0] = join(APP_BASE, filename);
    return inject.transform.apply(inject.transform, arguments);
  };
}

// TODO: Add an interface to register more template locals.
export const templateLocals = {
  APP_VERSION,
  APP_BASE
};



