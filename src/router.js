// Copyright 2019 Ben Brookes
// ben@pixelbeard.co
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function () {
  /**
   * View Router
   * Define route view on `template` elements by defining a view
   * path in the `data-route` attribute.
   * eg. `data-route="/"` or `data-route="/my-view"`
   * Define navigation links using `data-link` attribute referencing
   * the corresponding `data-route` template.
   */
  class Router {
    /**
     *
     * @param {string | HTMLElement} outlet Router outlet ID or element
     */
    constructor(outlet) {
      this._listeners = {};
      this._setupOutlet(outlet);
      this._registerWindowListener();
      this._registerClickEvents();
      // Initial navigation
      this._navigate(window.location.pathname);
    }

    /**
     * Register an event handler for the router
     * @param {string} eventName Event to subscribe to
     * @param {(target: HTMLElement, done: ()=> void)} handler
     */
    on(eventName, handler) {
      this._listeners[eventName] = this._listeners[eventName] ? [...this._listeners[(eventName, handler)]] : [handler];
    }

    use(plugin) {
      plugin(this);
    }

    /**
     * Notify all listeners of an event
     * @param {string} eventName Event name
     * @param {HTMLElement} data The relative element that is the target of the event
     * @param {function} callback Callback function
     */
    notify(eventName, data, callback) {
      if (typeof this._listeners[eventName] !== 'undefined') {
        for (var i = 0; i < this._listeners[eventName].length; i++) {
          var fn = this._listeners[eventName][i];
          var next = this._listeners[eventName][i + 1] || callback;
          console.log('Notifying');
          fn(data, next);
        }
      } else {
        callback();
      }
    }

    /**
     *
     * @param {string} path
     */
    _navigate(path) {
      this._unloadView(() => {
        window.history.pushState({}, path, window.location.origin + path);
        this._loadView(path);
      });
    }

    /**
     * Load a new template into view that matches the path
     * @param {string} path
     */
    _loadView(path) {
      var next = document.querySelectorAll(`template[data-route='${path}']`)[0];
      if (!next) throw `No template found for route ${path}`;
      // Get next content
      var content = next.content;
      // Create wrapper for view
      var viewWrap = document.createElement('div');
      viewWrap.classList.add('router-view');
      viewWrap.setAttribute('data-router-view', path);
      // Append content to the wrap
      viewWrap.appendChild(document.importNode(content, true));
      // Append the wrap to the view
      this._outlet.appendChild(viewWrap);
      // Keep reference to the current view
      this._currentView = viewWrap;
    }

    _unloadView(done) {
      /**
       * Only notify if the outlet has any children.
       * If the outlet has no children then the router
       * has likely not been initialised correctly.
       */
      if (this._outlet.childElementCount > 0 && this._currentView) {
        this.notify('unload', this._currentView, () => {
          this._clearElementChildren(this._outlet);
          done();
        });
      } else {
        done();
      }
    }

    _registerWindowListener() {
      window.onpopstate = () => this._navigate(window.location.pathname);
    }

    _registerClickEvents() {
      document.addEventListener(
        'click',
        event => {
          /**
           * Only interested in elements with `data-link` attributes
           */
          if (!event.target.matches('[data-link]')) return;
          // Don't follow link
          event.preventDefault();
          /**
           * Compare path and current path to ensure
           * the current view is not routed to again
           */
          var path = event.target.getAttribute('data-link');
          if (window.location.pathname === path) return;
          // Navigate to view
          this._navigate(path);
        },
        false
      );
    }

    /**
     *
     * @param {string | HTMLElement} outlet
     */
    _setupOutlet(outlet) {
      if (typeof outlet === 'string') {
        this._outlet = document.getElementById(outlet);
      } else if (typeof outlet === 'object' && this._isHTMLElement(outlet)) {
        // DOM Object
        this._outlet = outlet;
        throw 'Router outlet must either be a query selector string or a HTML element';
      }
      if (!this._outlet) throw 'Could not initialise the router';
    }

    /**
     * Returns true for an object that extends `HTMLElement`
     * @param {any} o Object to tes
     */
    _isHTMLElement(o) {
      return typeof HTMLElement === 'object' ?
        o instanceof HTMLElement :
        o &&
        typeof o === 'object' &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === 'string';
    }

    /**
     *
     * @param {HTMLElement} element
     */
    _clearElementChildren(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

  window.Router = Router;
})(window);