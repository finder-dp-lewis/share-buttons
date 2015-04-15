/*global Sharebuttons*/

var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  id: 'facebook',

  neededBy: function (button) {
    return Sharebuttons.prototype.basicProviderVerification(button, this.id);
  },

  fetchShareCount: function (button, callback) {
    Sharebuttons.prototype.jsonp('https://graph.facebook.com', {
      id: decodeURIComponent(Sharebuttons.prototype.parseHref(button).parameters.u)
    }, function (result) {
      callback(result.shares);
    });
  }
};
