(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

Sharebuttons.prototype.addProvider(require('./providers/facebook.js'));
Sharebuttons.prototype.addProvider(require('./providers/twitter.js'));
Sharebuttons.prototype.addProvider(require('./providers/stumbleupon.js'));
Sharebuttons.prototype.addProvider(require('./providers/reddit.js'));

window.Sharebuttons = Sharebuttons;


},{"./providers/facebook.js":2,"./providers/reddit.js":3,"./providers/stumbleupon.js":4,"./providers/twitter.js":5,"./sharebuttons.js":6}],2:[function(require,module,exports){
/*global Sharebuttons*/

var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  id: 'facebook',

  neededBy: function (button) {
    return Sharebuttons.prototype.basicProviderVerification(button, this.id);
  },

  fetchShareCount: function (button, callback) {
    Sharebuttons.prototype.jsonp('https://graph.facebook.com', {
      id: decodeURIComponent(Sharebuttons.prototype.parseHref(button).parameters.u)
    }, function (result) {
      callback(result.shares);
    });
  }
};

},{"../sharebuttons.js":6}],3:[function(require,module,exports){
/*global Sharebuttons*/

var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  id: 'reddit',

  neededBy: function (button) {
    return Sharebuttons.prototype.basicProviderVerification(button, this.id);
  }
};

},{"../sharebuttons.js":6}],4:[function(require,module,exports){
/*global Sharebuttons*/

var Sharebuttons = require('../sharebuttons.js');

module.exports = {
  id: 'stumbleupon',

  neededBy: function (button) {
    return Sharebuttons.prototype.basicProviderVerification(button, this.id);
  }
};

},{"../sharebuttons.js":6}],5:[function(require,module,exports){
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

},{"../sharebuttons.js":6}],6:[function(require,module,exports){
/*jslint browser: true*/

var JSONP = require('./utils/jsonp.js'),
  urlvars = require('./utils/urlvars.js'),
  mergeobjects = require('./utils/mergeobjects.js');

var Sharebuttons = function (selector, options) {
  this.settings = mergeobjects(this.defaults, options || {});
  this.buttons = document.querySelectorAll(selector);
  this.assessButtons(this.buttons, this.providers);

};

function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else
    obj.addEventListener( type, fn, false );
}

Sharebuttons.prototype = {
  providers: [],

  defaults: {
    'loadedCountClass': 'sharebuttons-count-loaded',
    'shareCountSelector': '[data-sharecount]',
    'newWindow': true,
    'defaultProviderId': 'unknown'
  },

  settings: {}, // settings will be an object creating from defaults and user supplied settings

  addProvider: function (provider) {
    this.providers.push(provider);
  },

  assessButtons: function (buttons, providers) {
    var i;
    // loop through buttons and update the DOM with provider info
    for (i = 0; i < buttons.length; i = i + 1) {
      this.updateDOM(buttons[i], this.checkProviders(buttons[i], providers));
    }
  },

  checkProviders: function (button, providers) {
    var i, validProvider;

    // loop through the providers and see if the button matches any of them
    for (i = 0; i < providers.length; i = i + 1) {
      if (providers[i].neededBy(button)) {
        validProvider = providers[i];
      }
    }

    return validProvider;
  },

  updateDOM: function (button, provider) {
    var that = this;


    addEvent(button, 'click', function (ev) {
      // if we're opening a new window then cancel default behaviour
      if (that.settings.newWindow === true) {
        ev.preventDefault();
        ev.stopPropagation();
        window.open(ev.currentTarget.href, 'sharebuttons', 'width=520,height=420');

        // if there's a callback for sharing trigger it with some data
        if (that.settings.onShare) {
          that.settings.onShare({
            provider: provider ? provider.id : that.settings.defaultProviderId
          });
        } // end if onShare
      } // end if newWindow
    }, false);



    // only fetch the count if there's a dom element for it to go in
    if (button.querySelector(that.settings.shareCountSelector)) {
      provider.fetchShareCount(button, function (count) {
        that.insertCounter(button, count);
      });
    }
  },

  insertCounter: function (button, number) {
    button.querySelector(this.settings.shareCountSelector).innerText = number;
    button.className = button.className + this.settings.loadedCountClass;
  },

  parseHref: function (link) {
    return {
      hostname: link.hostname,
      href: link.href,
      parameters: urlvars(link.href)
    };
  },

  basicProviderVerification: function (button, id) {
    var returnVal = false, hrefData = this.parseHref(button);
    if (hrefData.hostname.indexOf(id) !== -1) {
      returnVal = true;
    }
    return returnVal;
  },
  jsonp: JSONP.get
};

module.exports = Sharebuttons;

},{"./utils/jsonp.js":7,"./utils/mergeobjects.js":8,"./utils/urlvars.js":9}],7:[function(require,module,exports){
var JSONP = (function () {
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

module.exports = JSONP;

},{}],8:[function(require,module,exports){
/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */

module.exports = function (obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};

},{}],9:[function(require,module,exports){
function getUrlVars(href) {
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
}

module.exports = getUrlVars;

},{}]},{},[1]);
