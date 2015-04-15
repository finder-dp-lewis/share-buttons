/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

Sharebuttons.prototype.addProviders([
  require('./providers/facebook.js'),
  require('./providers/twitter.js'),
  require('./providers/stumbleupon.js'),
  require('./providers/reddit.js')
]);

window.Sharebuttons = Sharebuttons;

