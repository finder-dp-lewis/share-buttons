/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

Sharebuttons.prototype.addProviders([
  require('./provider/facebook.js'),
  require('./provider/twitter.js'),
  require('./provider/stumbleupon.js'),
  require('./provider/reddit.js')
]);

window.Sharebuttons = Sharebuttons;

