var parseLink = require('../util/parselink.js'),
  JSONP = require('../util/jsonp.js');

module.exports = {
  id: 'twitter',
  fetchCount: function (button, callback) {
    JSONP.get('https://cdn.api.twitter.com/1/urls/count.json', {
      url: decodeURIComponent(parseLink(button).params.url)
    }, function (result) {
      callback(result.count);
    });
  }
};
