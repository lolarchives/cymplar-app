import * as argv from 'yargs';
import * as fs from 'fs';
import * as slash from 'slash';

const resolve = require.resolve;

const CWD = process.cwd();
const pkg = JSON.parse(fs.readFileSync(`${CWD}/package.json`, 'utf8'));

// --------------
// Configuration.
const ENV: string = argv['env'] || process.env.profile || 'dev';
process.env.profile = ENV;

const CYMPLAR_MONGO_URI: string = argv['CYMPLAR_MONGO_URI'] || process.env.CYMPLAR_MONGO_URI || 
  //'mongodb://cymplarUser:cympl4rUs3r@ds033175.mongolab.com:33175/cymplar';
  'mongodb://cymplarUser:cympl4rUs3r@ds051575.mongolab.com:51575/cymplardev';
process.env.CYMPLAR_MONGO_URI = CYMPLAR_MONGO_URI;

const CYMPLAR_SECRET: string = argv['CYMPLAR_SECRET'] || process.env.CYMPLAR_SECRET || 'cymplarSecret';
process.env.CYMPLAR_SECRET = CYMPLAR_SECRET;

const CYMPLAR_SENDGRID_USER: string = argv['CYMPLAR_SENDGRID_USER'] || process.env.CYMPLAR_SENDGRID_USER || 'johannamail';
process.env.CYMPLAR_SENDGRID_USER = CYMPLAR_SENDGRID_USER;

const CYMPLAR_SENDGRID_PASSWORD: string = argv['CYMPLAR_SENDGRID_PASSWORD'] || process.env.CYMPLAR_SENDGRID_PASSWORD || 's3ndGr1d-3ng';
process.env.CYMPLAR_SENDGRID_PASSWORD = CYMPLAR_SENDGRID_PASSWORD;

const CYMPLAR_SENDGRID_ORIGIN: string = argv['CYMPLAR_SENDGRID_ORIGIN'] || process.env.CYMPLAR_SENDGRID_ORIGIN || 'johanna@neuli.net';
process.env.CYMPLAR_SENDGRID_ORIGIN = CYMPLAR_SENDGRID_ORIGIN;

export const PORT: number = argv['port'] || 5555;
export const LIVE_RELOAD_PORT: number = argv['reload-port'] || 4002;
export const APP_BASE: string = argv['base'] || '/';
export const APP_VERSION: string = pkg.version;

const CLIENT_SRC_BASE = `client`;
const DIST_BASE = `dist`;
const CLIENT_DEST_BASE = `${DIST_BASE}`;

const NM = `${CWD}/node_modules`;
const BC = `${CWD}/bower_components`;

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
    jslib: [
      // Order is quite important here for the HTML tag injection.
      slash(resolve('es6-shim/es6-shim.min.js')),
      slash(resolve('es6-shim/es6-shim.map')),
      slash(resolve('systemjs/dist/system.src.js')),
      `${CLIENT_SRC_BASE}/system.config.js`,
      slash(resolve('moment/moment.js')),
      `${BC}/jquery/dist/jquery.min.js`,
       slash(resolve('bootstrap/dist/js/bootstrap.min.js')),
      `${BC}/tinynav/tinynav.min.js`,
      `${BC}/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js`,
      slash(resolve(`angular/angular.js`)),
      slash(resolve(`angular-resource/angular-resource.js`)),
      slash(resolve(`angular-cookies/angular-cookies.js`)),
      `${BC}/angular-bootstrap/ui-bootstrap.js`,
      `${BC}/angular-multiple-transclusion/dist/angular-multiple-transclusion.min.js`,
      `${BC}/angular-bootstrap/ui-bootstrap-tpls.js`,
      `${BC}/angular-filter/dist/angular-filter.min.js`,
      `${BC}/angularjs-slider/dist/rzslider.min.js`,
      `${BC}/ng-tags-input/ng-tags-input.min.js`,
      slash(resolve(`angular-ui-router/release/angular-ui-router.js`)),
      slash(resolve('angular-sanitize/angular-sanitize.js')),    
      slash(resolve('angular-animate/angular-animate.js')),    
      slash(resolve('angular-touch/angular-touch.js')),    
      slash(resolve('angular-messages/angular-messages.js')),    
      slash(resolve('angular-toastr/dist/angular-toastr.js')),
      slash(resolve('angular-toastr/dist/angular-toastr.tpls.js')),
      slash(resolve('socket.io-client/socket.io.js'))
    ],
    jslib_copy_only: [
      slash(resolve('systemjs/dist/system-polyfills.js')),
      slash(resolve('systemjs/dist/system-polyfills.js.map'))
    ],
    csslib: [
      slash(resolve('bootstrap/dist/css/bootstrap.min.css')),
      slash(resolve('bootstrap/dist/css/bootstrap.css.map')),
      `${BC}/bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css`,
      `${BC}/angularjs-slider/dist/rzslider.min.css`,
      `${BC}/angular-custom-range-slider/styles/angular-custom-range-slide.css`,
      `${BC}/angular-custom-range-slider/styles/angular-custom-range-slide.css`,
      `${BC}/ng-tags-input/ng-tags-input.min.css`,
      `${BC}/ng-tags-input/ng-tags-input.bootstrap.min.css`,
      slash(resolve('angular-toastr/dist/angular-toastr.css'))
    ],
    font: [
      slash(resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.eot')),
      slash(resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.svg')),
      slash(resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.ttf')),
      slash(resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.woff')),
      slash(resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.woff2')),
    ],
    img: [
      `${CLIENT_SRC_BASE}/assets/img/**/*.*`,
    ],
    index: `${CLIENT_SRC_BASE}/index.html`,
    tpl: [
      `${CLIENT_SRC_BASE}/components/**/*.html`,
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
      font: `${DIST_BASE}/fonts`,
      img: `${DIST_BASE}/img`,
      client: `${CLIENT_DEST_BASE}`
    },
    test: 'test',
    tmp: '.tmp'
  }
};
