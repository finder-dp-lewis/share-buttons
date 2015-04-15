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
    'loadedClass': 'is-loaded', // class applied to the share button once the count is fetched
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

    this.bindEvent(button, provider);

    // only fetch the count if there's a dom element for it to go in
    if (button.querySelector(that.settings.countSelector)) {
      provider.fetchCount(button, function (count) {
        that.insertCount(button, count);
      });
    }
  },

  bindEvent: function (button, provider) {
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
