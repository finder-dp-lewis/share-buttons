var urlvars = require('./urlvars.js');

module.exports = function (link) {
  return {
    hostname: link.hostname,
    href: link.href,
    parameters: urlvars(link.href)
  };
}
