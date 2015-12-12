var test = require('tap').test
var kazanaMockFactory = require('../../utils/kazana-mock-factory')
var routes = require('../../../index').routes

test('GET /api/updates/{id}/transformed', function (t) {
  var getUpdatesRoute = routes.filter(function (route) {
    return route.method === 'GET' && route.path === '/api/updates/{id}/transformed'
  })[0]

  t.ok(getUpdatesRoute, 'exists')

  t.test('authorization', function (t) {
    t.test('Returns update info for admin user', function (t) {
      var server = kazanaMockFactory()
      server.route(getUpdatesRoute)

      server.inject({
        method: 'GET',
        url: '/api/updates/bookkeeping_2015-3/transformed',
        headers: {
          authorization: 'Bearer AdminUser'
        }
      }, function (response) {
        t.is(response.statusCode, 200, 'returns 200')
        t.end()
      })
    })

    t.test('Returns update info for doc owner', function (t) {
      var server = kazanaMockFactory()
      server.route(getUpdatesRoute)

      server.inject({
        method: 'GET',
        url: '/api/updates/bookkeeping_2015-3/transformed',
        headers: {
          authorization: 'Bearer NormalUser'
        }
      }, function (response) {
        t.is(response.statusCode, 200, 'returns 200')
        t.end()
      })
    })

    t.test('Returns 404 on doc for non-owner', function (t) {
      var server = kazanaMockFactory()
      server.route(getUpdatesRoute)

      server.inject({
        method: 'GET',
        url: '/api/updates/bookkeeping_2015-3/transformed',
        headers: {
          authorization: 'Bearer OtherUser'
        }
      }, function (response) {
        t.is(response.statusCode, 404, 'returns 404')
        t.end()
      })
    })

    t.end()
  })

  t.test('Returns update info', function (t) {
    var server = kazanaMockFactory()
    server.route(getUpdatesRoute)

    server.inject({
      method: 'GET',
      url: '/api/updates/bookkeeping_2015-3/transformed',
      headers: {
        authorization: 'Bearer AdminUser'
      }
    }, function (response) {
      t.is(response.statusCode, 200, 'returns 200')
      t.is(response.result.id, 'bookkeeping_2015-3', 'id present')
      t.is(response.result.transformedAt, '2015-10-07T11:42:28.242Z', 'transformedAt present')
      t.deepEqual(response.result, {
        id: 'bookkeeping_2015-3',
        transformedAt: '2015-10-07T11:42:28.242Z',
        transformationErrors: null,
        transformationSummary: 'transformation summary'
      }, 'has correct update info')
      t.end()
    })
  })

  t.test('Waits for transformation finish', function (t) {
    var now = (new Date()).toJSON()
    kazanaMockFactory(function (server) {
      server.route(getUpdatesRoute)

      server.inject({
        method: 'GET',
        url: '/api/updates/bookkeeping_2015-2/transformed',
        headers: {
          authorization: 'Bearer AdminUser'
        }
      }, function (response) {
        t.is(response.statusCode, 200, 'returns 200')
        t.deepEqual(response.result, {
          id: 'bookkeeping_2015-2',
          transformedAt: now,
          transformationSummary: null,
          transformationErrors: 'transformation errors'
        }, 'has correct update info')
        t.end()
      })

      server.rawData.update('bookkeeping_2015-2', { foo: 'bar' })
        .then(function () {
          return server.rawData.update('bookkeeping_2015-2', { transformedAt: now, transformationErrors: 'transformation errors' })
        })
    })
  })

  t.end()
})
