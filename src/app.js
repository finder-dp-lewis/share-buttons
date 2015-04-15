/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

Sharebuttons.prototype.addProvider(require('./providers/facebook.js'));
Sharebuttons.prototype.addProvider(require('./providers/twitter.js'));
Sharebuttons.prototype.addProvider(require('./providers/stumbleupon.js'));
Sharebuttons.prototype.addProvider(require('./providers/reddit.js'));

window.Sharebuttons = Sharebuttons;

