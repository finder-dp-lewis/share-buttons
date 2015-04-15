/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

Sharebuttons.prototype.addProvider(require('./providers/facebook.js'));
Sharebuttons.prototype.addProvider(require('./providers/twitter.js'));


window.Sharebuttons = Sharebuttons;

