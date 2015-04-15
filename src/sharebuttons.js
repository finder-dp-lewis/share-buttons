/*jslint browser: true*/

var JSONP = require('./utils/jsonp.js'),
  urlvars = require('./utils/urlvars.js'),
  mergeobjects = require('./utils/mergeobjects.js'),
  addEvent = require('./utils/addEvent.js');

var Sharebuttons = function (selector, options) {
  this.settings = mergeobjects(this.defaults, options || {});
  this.buttons = document.querySelectorAll(selector);
  this.assessButtons(this.buttons, this.providers);
};


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
      var target;
      // if we're opening a new window then cancel default behaviour
      if (that.settings.newWindow === true) {
        if (ev.preventDefault && ev.stopPropagation) {
          ev.preventDefault();
          ev.stopPropagation();
        } else {
          ev.returnValue = false; // thanks IE8          
        }

        target = ev.currentTarget || ev.srcElement;

        window.open(target.href, 'sharebuttons', 'width=520,height=420');

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
