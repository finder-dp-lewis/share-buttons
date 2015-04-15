/*global Sharebuttons*/

var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  id: 'stumbleupon',

  neededBy: function (button) {
    return Sharebuttons.prototype.basicProviderVerification(button, this.id);
  }
};
