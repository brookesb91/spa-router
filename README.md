# spa-router

Simple single page router with plugin functionality.

> Note that this is a very simple implementation of single page routing and suitable for small projects.

[View Demo](https://spa-router.herokuapp.com)

## Usage

Include `router.js`

```html
<head>
  <!-- Include router.js -->
  <script src="path/to/router.js"></script>

  <!-- Include any router plugins, as an example,
      router animations -->
  <script src="path/to/plugins/router-animations.js"></script>
  <link rel="stylesheet" href="path/to/plugins/router-animations.css" />
</head>
```

Create navigation links by adding the `data-link` attribute.

```html
<nav role="navigation">
  <a href="/" data-link="/">Home</a>
  <a href="/about" data-link="/about">About</a>
</nav>
```

Create an router outlet where your content will be routed and displayed.

```html
<main id="router-outlet"></main>
```

Create your routed templates using `template` elements.
Add the `data-route` attribute to specify the path at which this template will be loaded.

```html
<template data-route="/">
  <h1>Hello From Home!</h1>
</template>

<template data-route="/about">
  <h1>Hello From About!</h1>
</template>
```

Initialise the router

```javascript
(function () {
  var router = new Router('router-outlet');
})();
```

## Plugins

Router plugins are defined as functions that take a `Router` ìnstance as an argument.

```js
function MyRouterPlugin(router) {
  // Now, router events can be listened to
  // Router events can be listened to by specifying the event name and passing a function that takes a HTMLElement as an argument

  // Router unload event.
  // Param `target` is the unloading element
  router.on('unload', function (target) {
    return new Promise(function (resolve) {
      // Do some stuff with target
      resolve(target);
    });
  });

  // Router load event
  // Param `target` is the loading element
  router.on('load', function (target) {
    return new Promise(function (resolve) {
      // Load stuff
      resolve(target);
    });
  });
}
```

Register your plugin

```javascript
(function () {
  var router = new Router('router-outlet');
  // Here
  router.use(MyRouterPlugin);
})();
```

## Demo

Ensure node is installed.

Install demo dependencies

```bash
npm i
```

Run demo

```bash
npm run demo
```

Open your browser at `localhost:420`
