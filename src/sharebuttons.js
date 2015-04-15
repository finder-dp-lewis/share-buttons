/*jslint browser: true*/
/*global ActiveXObject*/


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

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function mergeOptions(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

// determine the URL to get counts for

var Sharebuttons = function (selector, options) {
  this.buttons = document.querySelectorAll(selector);
  this.assessButtons(this.buttons, this.providers);
  this.settings = mergeOptions(this.defaults, options || {});
};

Sharebuttons.prototype = {
  providers: [],

  defaults: {
    'loadedCountClass': 'sharebuttons-count-loaded',
    'newWindow': true
  },

  settings: {},

  addProvider: function (provider) {
    this.providers.push(provider);
  },

  assessButtons: function (buttons, providers) {
    var i, that = this;
    // loop through buttons and determine what provider
    for (i = 0; i < buttons.length; i = i + 1) {
      // add click handler to buttons to make them pop up
      buttons[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (that.settings.newWindow === true) {
          window.open(ev.currentTarget.href, 'sharebuttons', 'width=520,height=420');
        }
      }, false);
      this.checkProviders(buttons[i], providers);
    }
  },

  checkProviders: function (button, providers) {
    var i, validProvider, that = this;

    // loop through the providers and see if the button matches any of them
    for (i = 0; i < providers.length; i = i + 1) {
      if (providers[i].neededBy(button)) {
        validProvider = providers[i];
      }
    }

    if (validProvider) {
      validProvider.fetchShareCount(button, function (count) {
        that.insertCounter(button, count);
      });
    }

  },

  insertCounter: function (button, number) {
    button.querySelector('[data-sharecount]').innerText = number;
    button.classList.add(this.settings.loadedCountClass);
  },

  parseHref: function (button) {
    var hrefData = {
      hostname: button.hostname,
      href: button.href,
      parameters: getUrlVars(button.href)
    };

    return hrefData;
  },

  jsonp: JSONP.get
};
