module.exports = function(config) {

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'example/js/vendor/angular/angular.js',
      'example/js/vendor/jquery/dist/jquery.js',
      'example/js/vendor/angular-mocks/angular-mocks.js',
      'components/Service.js',
      'components/*.js',
      'tests/Spec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: true
  });
};