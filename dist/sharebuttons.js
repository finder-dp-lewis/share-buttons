(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

Sharebuttons.prototype.addProviders([
  require('./provider/facebook.js'),
  require('./provider/twitter.js'),
  require('./provider/stumbleupon.js'),
  require('./provider/reddit.js')
]);

window.Sharebuttons = Sharebuttons;


},{"./provider/facebook.js":2,"./provider/reddit.js":3,"./provider/stumbleupon.js":4,"./provider/twitter.js":5,"./sharebuttons.js":6}],2:[function(require,module,exports){
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

},{"../util/jsonp.js":7,"../util/parselink.js":9}],3:[function(require,module,exports){
module.exports = {
  id: 'reddit'
};

},{}],4:[function(require,module,exports){
module.exports = {
  id: 'stumbleupon'
};

},{}],5:[function(require,module,exports){
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

},{"../util/jsonp.js":7,"../util/parselink.js":9}],6:[function(require,module,exports){
/*jslint browser: true*/
var mergeobjects = require('./util/mergeobjects.js');

function basicProviderVerification(button, id) {
  var returnVal = false;
  if (button.hostname.indexOf(id) !== -1) {
    returnVal = true;
  }
  return returnVal;
}

var Sharebuttons = function (selector, options) {
  this.settings = mergeobjects(this.defaults, options || {});
  this.buttons = document.querySelectorAll(selector);
  this.prepButtons(this.buttons, this.providers);
};

Sharebuttons.prototype = {
  providers: [], // array of provider plugins

  defaults: {
    'loadedClass': 'sharebuttons-count-loaded', // class applied to the share button once the count is fetched
    'countSelector': '[data-sharecount]', // selector for the child element that contains the count number
    'newWindow': true, // determines whether a new window should be opened
    'defaultProviderId': 'unknown', // if there is no provider plugin, the ID will default to this
    'onShare': function () { return; } // This callback is dispatched after a share button is clicked on
  },

  settings: {}, // settings will be an object creating from defaults and user supplied settings

  prepButtons: function (buttons, providers) {
    var i;
    // loop through buttons and update the DOM with provider info
    for (i = 0; i < buttons.length; i = i + 1) {
      this.updateDOM(buttons[i], this.findProvider(buttons[i], providers));
    }
  },

  findProvider: function (button, providers) {
    var i, validProvider;

    // loop through the providers and see if the button matches any of them
    for (i = 0; i < providers.length; i = i + 1) {
      if ((providers[i].neededBy && providers[i].neededBy(button)) || (providers[i].id && basicProviderVerification(button, providers[i].id))) {
        validProvider = providers[i];
      }
    }

    return validProvider;
  },

  updateDOM: function (button, provider) {
    var that = this;

    if (button.addEventListener) {
      button.addEventListener('click', function (ev) {
        // if we're opening a new window then cancel default behaviour
        // but we'll let IE8 fallback to a default link
        if (that.settings.newWindow === true && ev.preventDefault) {
          ev.preventDefault();
          ev.stopPropagation();

          window.open(ev.currentTarget.href, 'sharebuttons', 'width=520,height=420,resizable=yes,scrollbars=yes');

          // if there's a callback for sharing trigger it with some data
          that.settings.onShare({
            provider: provider ? provider.id : that.settings.defaultProviderId
          });
        } // end if newWindow
      }, false);
    }

    // only fetch the count if there's a dom element for it to go in
    if (button.querySelector(that.settings.countSelector)) {
      provider.fetchCount(button, function (count) {
        that.insertCount(button, count);
      });
    }
  },

  insertCount: function (button, number) {
    button.querySelector(this.settings.countSelector).innerText = number;
    button.className += this.settings.loadedClass;
  },

  addProviders: function (providers) {
    var i;
    for (i = 0; i < providers.length; i = i + 1) {
      this.providers.push(providers[i]);
    }
  }
};

module.exports = Sharebuttons;

},{"./util/mergeobjects.js":8}],7:[function(require,module,exports){
module.exports = (function () {
  var counter = 0,
    head,
    window = this,
    config = {};

  function load(url, pfnError) {
    var script = document.createElement('script'),
      done = false;
    script.src = url;
    script.async = true;

    var errorHandler = pfnError || config.error;
    if (typeof errorHandler === 'function') {
      script.onerror = function (ex) {
        errorHandler({
          url: url,
          event: ex
        });
      };
    }

    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
    };

    if (!head) {
      head = document.getElementsByTagName('head')[0];
    }
    head.appendChild(script);
  }

  function encode(str) {
    return encodeURIComponent(str);
  }

  function jsonp(url, params, callback, callbackName) {
    var query = (url || '').indexOf('?') === -1 ? '?' : '&',
      key;

    callbackName = (callbackName || config.callbackName || 'callback');
    var uniqueName = callbackName + "_json" + (++counter);

    params = params || {};
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        query += encode(key) + "=" + encode(params[key]) + "&";
      }
    }

    window[uniqueName] = function (data) {
      callback(data);
      try {
        delete window[uniqueName];
      } catch (e) {

      }
      window[uniqueName] = null;
    };

    load(url + query + callbackName + '=' + uniqueName);
    return uniqueName;
  }

  function setDefaults(obj) {
    config = obj;
  }
  return {
    get: jsonp,
    init: setDefaults
  };
}());

},{}],8:[function(require,module,exports){
/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
module.exports = function (obj1, obj2) {
  var obj3 = {},
    attrname;
  for (attrname in obj1) {
    obj3[attrname] = obj1[attrname];
  }
  for (attrname in obj2) {
    obj3[attrname] = obj2[attrname];
  }
  return obj3;
};

},{}],9:[function(require,module,exports){
var urlvars = require('./urlvars.js');

module.exports = function (link) {
  return {
    host: link.hostname,
    href: link.href,
    params: urlvars(link.href)
  };
}

},{"./urlvars.js":10}],10:[function(require,module,exports){
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

},{}]},{},[1]);
