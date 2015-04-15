var parseLink = require('../utils/parselink.js'),
  JSONP = require('../utils/jsonp.js');

module.exports = {
  id: 'facebook',

  fetchCount: function (button, callback) {
    JSONP.get('https://graph.facebook.com', {
      id: decodeURIComponent(parseLink(button).parameters.u)
    }, function (result) {
      callback(result.shares);
    });
  }
};
