var parseLink = require('../utils/parselink.js'),
  JSONP = require('../utils/jsonp.js');

module.exports = {
  id: 'twitter',
  fetchCount: function (button, callback) {
    JSONP.get('https://cdn.api.twitter.com/1/urls/count.json', {
      url: decodeURIComponent(parseLink(button).parameters.url)
    }, function (result) {
      callback(result.count);
    });
  }
};
