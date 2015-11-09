import * as argv from 'yargs';
import * as fs from 'fs';

const resolve = require.resolve;

const CWD = process.cwd();
const pkg = JSON.parse(fs.readFileSync(`${CWD}/package.json`, 'utf8'));

// --------------
// Configuration.
export const ENV: string = argv['env'] || process.env.profile || 'dev';
export const DEBUG: boolean = argv['debug'] || false;
export const PORT: number = argv['port'] || 5555;
export const LIVE_RELOAD_PORT: number = argv['reload-port'] || 4002;
export const APP_BASE: string = argv['base'] || '/';

const CLIENT_SRC_BASE = 'client';
const CLIENT_DEST_BASE = 'dist';
export const ANGULAR_BUNDLES = './node_modules/angular2/bundles';
export const APP_VERSION: string = pkg.version;


export const PATH = {
  cwd: CWD,
  tools: 'tools',
  dest: {
    base: CLIENT_DEST_BASE,
    dev: {
      base: `${CLIENT_DEST_BASE}/${ENV}`,
      lib: `${CLIENT_DEST_BASE}/${ENV}/lib`,
      css: `${CLIENT_DEST_BASE}/${ENV}/css`,
      font: `${CLIENT_DEST_BASE}/${ENV}/fonts`,
      component: `${CLIENT_DEST_BASE}/${ENV}/components`
    },
    test: 'test',
    tmp: '.tmp'
  },
  src: {
    base: CLIENT_SRC_BASE,
    jslib_inject: [
      // Order is quite important here for the HTML tag injection.
      resolve('es6-shim/es6-shim.min.js'),
      resolve('es6-shim/es6-shim.map'),
      resolve('systemjs/dist/system.src.js'),
      `${CLIENT_SRC_BASE}/system.config.js`,
      `${ANGULAR_BUNDLES}/angular2.dev.js`,
      `${ANGULAR_BUNDLES}/router.dev.js`,
      `${ANGULAR_BUNDLES}/http.dev.js`
    ],
    jslib_copy_only: [
      resolve('systemjs/dist/system-polyfills.js'),
      resolve('systemjs/dist/system-polyfills.js.map')
    ],
    csslib: [
      resolve('bootstrap/dist/css/bootstrap.min.css'),
      resolve('bootstrap/dist/css/bootstrap.css.map')
    ],
    font: [
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.eot'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.svg'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.ttf'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.woff'),
      resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.woff2')
    ],
    index: `${CLIENT_SRC_BASE}/index.html`,
    tpl: [
      `${CLIENT_SRC_BASE}/components/**/*.html`,
    ],
    ts: [`${CLIENT_SRC_BASE}/**/*.ts`, `!${CLIENT_SRC_BASE}/**/*_spec.ts`]
  }
};


