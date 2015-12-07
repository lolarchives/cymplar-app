import * as argv from 'yargs';
import * as fs from 'fs';

const resolve = require.resolve;

const CWD = process.cwd();
const pkg = JSON.parse(fs.readFileSync(`${CWD}/package.json`, 'utf8'));

// --------------
// Configuration.
const ENV: string = argv['env'] || process.env.profile || 'dev';
process.env.profile = ENV;

export const PORT: number = argv['port'] || 5555;
export const LIVE_RELOAD_PORT: number = argv['reload-port'] || 4002;
export const APP_BASE: string = argv['base'] || '/';
export const APP_VERSION: string = pkg.version;

const CLIENT_SRC_BASE = `client`;
const DIST_BASE = `dist`;
const CLIENT_DEST_BASE = `${DIST_BASE}/${CLIENT_SRC_BASE}`;


export const PATH = {
  cwd: CWD,
  jslint: [
    `${CLIENT_SRC_BASE}/**/*.ts`,
    `${CWD}/server/**/*.ts`,
    `tools/**/*.ts`,
    `!tools/typings/**`,
    `${CWD}/gulpfile.ts`
  ],
  src: {
    base: CLIENT_SRC_BASE,
    jslib_inject: [
      // Order is quite important here for the HTML tag injection.
      resolve('es6-shim/es6-shim.min.js'),
      resolve('es6-shim/es6-shim.map'),
      resolve(`requirejs/require.js`),
      resolve(`angular/angular.js`),
      `${CWD}/bower_components/angular-bootstrap/ui-bootstrap.js`,
      `${CWD}/bower_components/angular-bootstrap/ui-bootstrap-tpls.js`,
      resolve(`angular-ui-router/build/angular-ui-router.js`),
      resolve('angular-sanitize/angular-sanitize.js'),    
      resolve('angular-messages/angular-messages.js'),    
      resolve('angular-toastr/dist/angular-toastr.js')
    ],
    jslib_copy_only: <string[]>[
    ],
    js_inject: [
      `${CWD}/${CLIENT_SRC_BASE}/bootstrap.ts`,
      `${CWD}/${CLIENT_SRC_BASE}/**/*.ts`,
      `!${CWD}/${CLIENT_SRC_BASE}/bootstrap.ts`, 
    ],
    csslib: [
      resolve('bootstrap/dist/css/bootstrap.min.css'),
      resolve('bootstrap/dist/css/bootstrap.css.map'),
      resolve('angular-toastr/dist/angular-toastr.css')
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
      `${CLIENT_SRC_BASE}/**/*.html`,
    ],
    css: [
      `${CLIENT_SRC_BASE}/**/*.scss`,
    ],
    ts: [`${CLIENT_SRC_BASE}/**/*.ts`, `!${CLIENT_SRC_BASE}/**/*_spec.ts`]
  },
  dest: {
    app: {
      base: DIST_BASE,
      lib: `${DIST_BASE}/lib`,
      css: `${DIST_BASE}/css`,
      font: `${DIST_BASE}/fonts`,
      client: `${CLIENT_DEST_BASE}`
    },
    test: 'test',
    tmp: '.tmp'
  }
};
