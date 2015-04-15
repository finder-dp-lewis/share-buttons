var parseLink = require('../util/parselink.js'),
  JSONP = require('../util/jsonp.js');

module.exports = {
  id: 'facebook',

  fetchCount: function (button, callback) {
    JSONP.get('https://graph.facebook.com', {
      id: decodeURIComponent(parseLink(button).params.u)
    }, function (result) {
      callback(result.shares);
    });
  }
};
