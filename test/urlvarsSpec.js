/*global describe, it, expect*/
var urlvars = require('../src/util/urlvars.js');

describe('urlvars', function () {

  it('should convert url parameters into JavaScript object', function () {
    var data, url = 'http://www.mydomain.com/?name=Winnie&job=Bear';

    data = urlvars(url);

    expect(typeof data).toBe('object');
    expect(data.name).toBe('Winnie');
    expect(data.job).toBe('Bear');
  });

});
