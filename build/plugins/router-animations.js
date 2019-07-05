(function () {
  function RouterAnimations(router) {
    router.on('unload', function (target) {
      return new Promise(function (resolve) {
        target.classList.add('router-view-unloading');
        target.addEventListener('animationend', () => resolve(target));
      });
    });
  }
  window.RouterAnimations = RouterAnimations;
})(window, document);