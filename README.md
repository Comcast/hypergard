# HyperGard

[![Build Status](https://travis-ci.org/Comcast/hypergard.svg?branch=master)](https://travis-ci.org/Comcast/hypergard)

Javascript client for HAL APIs, with support for Hypermedia Forms


## Installation

When using [npm](https://www.npmjs.com/)

```bash
npm install --save hypergard
```

## Usage

### Initialize HyperGard instance
```javascript
const HOMEPAGE_ENDPOINT = 'https://hypermedia-endpoint.com/'
const HalApi = new HyperGard(HOMEPAGE_ENDPOINT, {});
```

### Fetch Homepage
```javascript
const homepageResource = await HalApi.fetchHomepage();
```

### Options

#### `cacheHomepage`

Default value: `false`

Determines whether to keep locally closed over reference to homepage response, since the Homepage resource should be highly cache-able by Hypermedia standards.

#### `preloadHomepage`

Default: `true`

Auto-fetch homepage endpoint on initialization of HyperGard object.

#### `xhr`

Network request that will be passed along to [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Additionally `hypergard` implements a timeout around any network fetch, which will default to `60000` milliseconds

```js
{
  // Headers to be added to each network fetch
  headers: {
    ['X-Custom-Header']: "value",
  }
  // Timeout period in milliseconds
  timeout: 2000,
}
```

#### `applyMiddlewareStack`

Allows you to pass an array of middleware function to wrap around each fetch.

Each middleware function should:
* Have a method signature with arguments `url`, `options`, and `next`
* Return the remaining stack `return next(url, options)` so the promise chain isn't broken

#### Example of Middleware for accessing calls before fetch. (Replaces `beforeFetch` and `uniqueFetchHeaders` functionality)
```
function setCustomHeader(url, options, next) {
  var newOptions = Object.assign({}, options, {
    headers: {
      'X-MoneyTrace': 'hey nowwwww',
    }
  });

  // Call next piece of middleware
  return next(url, newOptions);
}
```

#### Example of Middleware for accessing calls after fetch  (Replaces `afterFetchSuccess` and `afterFetchFailure` functionality)
```
function loggerMiddleware(url, options, next) {
  // Call next piece of middleware
  var promiseChain = next(url, options);

  // Log any 401
  promiseChain.catch(function(error) {
      if (error.status === '401') {
        mockLogger.log('Unauthorized', {error: error});
      }
    })

  // Return un-caught promise chain
  return promiseChain;
}
```

#### Example of Applying middleware stack

Middleware can be applied to an initialized `HyperGard` object, and will be executed based on order of array.

```
HalApi.applyMiddlewareStack([
  setCustomHeader,
  loggerMiddleware,
]);
```

## Running Tests

### Install Dependencies

```
$ npm run setup
```

### Running tests to manually validate a patchset

```
$ npm test
```

### Running tests during development

```
$ gulp test
```

That `gulp test` command will load up Chrome. Click the "Debug" button and then open the JavaScript Console to see the test results. You can also use `console` methods to be able to debug your tests.

Note that if you make a code change, you cannot simply reload http://localhost:8080/debug.html in Chrome. You have to stop the `gulp test` process with `Control+C` and then rerun the command (there's probably a better way to handle that, but it does the job for now).
