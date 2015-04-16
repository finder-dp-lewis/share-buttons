/*global describe, it, expect*/
var jsonp = require('../src/util/jsonp.js');

describe('jsonp', function () {

  it('should fetch and object from an API that supports JSONP', function (done) {

    jsonp.get('https://graph.facebook.com', {
      id: decodeURIComponent('http://www.finder.com.au')
    }, function (result) {
      expect(typeof result).toBe('object');
      done();
    });

  });

});
