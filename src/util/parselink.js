var urlvars = require('./urlvars.js');

module.exports = function (link) {
  return {
    host: link.hostname,
    href: link.href,
    params: urlvars(link.href)
  };
};
