/*global Sharebuttons*/

var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  'id': 'facebook',

  'neededBy': function (button) {
    var returnVal = false, hrefData = Sharebuttons.prototype.parseHref(button);
    if (hrefData.hostname.indexOf(this.id) !== -1) {
      returnVal = true;
    }
    return returnVal;
  },

  fetchShareCount: function (button, callback) {
    Sharebuttons.prototype.jsonp('https://graph.facebook.com', {
      id: decodeURIComponent(Sharebuttons.prototype.parseHref(button).parameters.u)
    }, function (result) {
      callback(result.shares);
    });
  }
};
