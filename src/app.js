var Sharebuttons = require('./sharebuttons.js');

Sharebuttons.prototype.addProvider(require('./providers/facebook.js'));
Sharebuttons.prototype.addProvider(require('./providers/twitter.js'));

var sharebuttons = new Sharebuttons('[data-sharebutton]');
