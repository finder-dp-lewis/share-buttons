/*global describe, it, expect, beforeEach, afterEach*/
var Sharebuttons = require('../src/sharebuttons.js');

Sharebuttons.prototype.addProviders([
  require('../src/provider/example.js')
]);

describe('sharebuttons', function () {
  var body = document.getElementsByTagName('body')[0],
    elem,
    countEl,
    linkEl,
    template = '<a data-sharebutton href="http://www.example.com">My Link <span data-sharecount>Not Loaded</span></a>';

  beforeEach(function () {
    // create element to hold the links
    elem = document.createElement('div');
    elem.innerHTML = template;

    // append the template to the body
    body.appendChild(elem);

    // find the element that will get the counter
    countEl = elem.querySelector('[data-sharecount]');
    linkEl = elem.querySelector('[data-sharebutton]');
  });

  afterEach(function () {
    linkEl.removeEventListener('shareCountLoaded');
    body.removeChild(elem);
  });

  it('should update counter with a number', function (done) {
    linkEl.addEventListener('shareCountLoaded', function () {
      expect(countEl.innerText).not.toBe('Not Loaded');
      done();
    }, false);

    var sharebuttons = new Sharebuttons('[data-sharebutton]');
  });

});
