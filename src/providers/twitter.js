/*global Sharebuttons*/
var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  id: 'twitter',

  neededBy: function (button) {
    return Sharebuttons.prototype.basicProviderVerification(button, this.id);
  },

  fetchShareCount: function (button, callback) {
    Sharebuttons.prototype.jsonp('https://cdn.api.twitter.com/1/urls/count.json', {
      url: decodeURIComponent(Sharebuttons.prototype.parseHref(button).parameters.url)
    }, function (result) {
      callback(result.count);
    });
  }
};
