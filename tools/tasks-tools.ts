import * as gulp from 'gulp';
import {join} from 'path';
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

export function buildInjectable(paths: string[], newBaseDir?: string, newExt?: string): NodeJS.ReadWriteStream {
  const rws = gulp.src(
    paths
      .filter(path => !/(\.map)$/.test(path), { read: false })
  );
  return rws;
}

export function transformPath(filepath: string, newBaseDir: string) {
  const namePos = filepath.lastIndexOf('/') + 1;
  const filename = filepath.substring(namePos);
  filepath = newBaseDir === '' ? filename : newBaseDir + '/' + filename;
  return filepath;
}

// TODO: Add an interface to register more template locals.
export const templateLocals = {
  APP_VERSION,
  APP_BASE
};



