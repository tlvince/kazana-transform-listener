# kazana-transform-listener
Listen for transformation updates.

[![Build
Status](https://travis-ci.org/eHealthAfrica/kazana-transform-listener.svg?branch=master)](https://travis-ci.org/eHealthAfrica/kazana-transform-listener)

## Usage
```js
module.exports = {
  name: 'myapp',
  version: '1.0.0',
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
