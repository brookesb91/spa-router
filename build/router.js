var Router = /** @class */ (function () {
    function Router(outletId) {
        this.listeners = new Map();
        this.setupOutlet(outletId);
    }
    Router.prototype.on = function (event, handler) {
        var handlers = [handler];
        if (this.listeners.has(event)) {
            handlers.concat(this.listeners.get(event));
        }
        this.listeners.set(event, handlers);
    };
    Router.prototype.use = function (plugin) { };
    Router.prototype.notify = function (event, target, done) {
        if (this.listeners.has(event)) {
            for (var i = 0; i < this.listeners.get(event).length; i++) {
                var current = this.listeners.get(event)[i];
                var next = this.listeners.get(event)[i + 1] || null;
                // current(target, next);
            }
        }
        done();
    };
    Router.prototype.navigate = function () { };
    Router.prototype.loadView = function () { };
    Router.prototype.unloadView = function () { };
    Router.prototype.registerPopStateListener = function () { };
    Router.prototype.registerClickEvents = function () { };
    Router.prototype.setupOutlet = function (outletId) {
        if (!document.getElementById(outletId)) {
            throw 'No outlet found with the given ID';
        }
        this.outlet = document.getElementById(outletId);
    };
    Router.prototype.clearChildren = function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };
    return Router;
}());
