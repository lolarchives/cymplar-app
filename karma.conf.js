// Karma configuration
// Generated on Wed Jul 15 2015 09:44:02 GMT+0200 (Romance Daylight Time)

module.exports = function(config) {
  config.set({    

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'source-map-support'],
    
    // list of files / patterns to load in the browser
    files: [     
      
      {pattern: 'node_modules/angular2/**/*.js', included: false, watched: false},    
                
      'node_modules/es6-shim/es6-shim.js',
      
      // zone-microtask must be included first as it contains a Promise monkey patch
      'node_modules/zone.js/dist/zone-microtask.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/jasmine-patch.js',

      'node_modules/systemjs/dist/system.src.js',
      {pattern: 'node_modules/@reactivex/rxjs/dist/cjs/**', included: false, watched: false, served: true},
      'node_modules/reflect-metadata/Reflect.js',    
      
      {pattern: 'test/**', included: false, watched: true},      
      'tools/build/file2modulename.js',
      'test-main.js'
    ],

    // list of files / patterns to exclude
    exclude: [
      'node_modules/angular2/bundles/**',
      'node_modules/angular2/es6/**',
      'node_modules/angular2/examples/**',
      'node_modules/angular2/**/*_spec.js',
      'node_modules/angular2/**/*.min.js',
      'node_modules/@reactivex/rxjs/dist/cjs/**/*.ts'
    ],    

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome',
      // 'PhantomJS2'
    ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  });

  if (process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci'];
    config.singleRun = true;
  }
};
