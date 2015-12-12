# kazana-transform-listener
Listen for transformation updates.

[![NPM version](https://badge.fury.io/js/kazana-transform-listener.svg)](https://www.npmjs.com/package/kazana-transform-listener)
[![Build Status](https://travis-ci.org/eHealthAfrica/kazana-transform-listener.svg?branch=master)](https://travis-ci.org/eHealthAfrica/kazana-transform-listener)
[![Coverage Status](https://coveralls.io/repos/eHealthAfrica/kazana-transform-listener/badge.svg?branch=master&service=github)](https://coveralls.io/github/eHealthAfrica/kazana-transform-listener?branch=master)
[![Dependency Status](https://david-dm.org/eHealthAfrica/kazana-transform-listener.svg)](https://david-dm.org/eHealthAfrica/kazana-transform-listener)

## Usage
```js
module.exports = {
  name: 'myapp',
  version: '1.0.0',
  config: {
    app: {
      'transform-listener': {
        timeout: 60000
      } 
    }
  },
  plugins: [
    require('kazana-transform-listener')
  ]
}
```

## Routes

User must be authenticated for all routes

```
GET /api/updates/{id}/transformed
```

## Test
```
npm test
```

## Credit

Brought to you by [eHealth Africa](http://ehealthafrica.org/)
— good tech for hard places.

## License

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
