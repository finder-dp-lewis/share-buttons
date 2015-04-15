/*global Sharebuttons*/

var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  id: 'reddit',

  neededBy: function (button) {
    return Sharebuttons.prototype.basicProviderVerification(button, this.id);
  }
};
