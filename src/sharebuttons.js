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
    var i, that = this;
    // loop through buttons and determine what provider

    function eventHandler(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (that.settings.newWindow === true) {
        window.open(ev.currentTarget.href, 'sharebuttons', 'width=520,height=420');
      }
    }

    for (i = 0; i < buttons.length; i = i + 1) {
      buttons[i].addEventListener('click', eventHandler, false);

      if (buttons[i].querySelector('[data-sharecount]')) {
        // add click handler to buttons to make them pop up
        this.checkProviders(buttons[i], providers);
      }

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
      parameters: urlvars(button.href)
    };

    return hrefData;
  },

  jsonp: JSONP.get
};

module.exports = Sharebuttons;
