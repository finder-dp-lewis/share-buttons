/*jslint browser: true*/

var JSONP = require('./utils/jsonp.js'),
  urlvars = require('./utils/urlvars.js'),
  mergeobjects = require('./utils/mergeobjects.js');

var Sharebuttons = function (selector, options) {
  this.buttons = document.querySelectorAll(selector);
  this.assessButtons(this.buttons, this.providers);
  this.settings = mergeobjects(this.defaults, options || {});
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
    var i;
    // loop through buttons and determine what provider
    for (i = 0; i < buttons.length; i = i + 1) {
      // add click handler to buttons to make them pop up
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
    button.addEventListener('click', function (ev) {
      if (that.settings.newWindow === true) {
        ev.preventDefault();
        ev.stopPropagation();
        window.open(ev.currentTarget.href, 'sharebuttons', 'width=520,height=420');

        if (that.settings.onShare) {
          that.settings.onShare({
            provider: provider.id
          });
        }
      }
    }, false);

    // only fetch the count if there's a dom element for it to go in
    if (button.querySelector('[data-sharecount]')) {
      provider.fetchShareCount(button, function (count) {
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
      parameters: urlvars(button.href)
    };

    return hrefData;
  },

  jsonp: JSONP.get
};

module.exports = Sharebuttons;
