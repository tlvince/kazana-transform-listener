var routes = require('./lib/routes')

module.exports = {
  name: 'transform-listener',
  version: '1.0.0',
  config: {
    'transform-listener': {
      timeout: 60000
    }
  },
  routes: routes
}
