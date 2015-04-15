module.exports = function (href) {
  var vars = [],
    hash,
    i,
    hashes = href.slice(href.indexOf('?') + 1).split('&');
  for (i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
};
