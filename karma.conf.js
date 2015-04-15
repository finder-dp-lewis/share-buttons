'use strict';

module.exports = function (karma) {
  karma.set({

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
      'test/**/*Spec.js'
    ],

    preprocessors: {
      'test/*Spec.js': [ 'browserify' ]
    },

    browsers: [ 'PhantomJS' ],

    singleRun: true,
    autoWatch: false

  });
};
