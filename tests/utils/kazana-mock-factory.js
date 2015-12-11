module.exports = kazanaMockFactory

/*
 * Mocks the work that kazana-server is doing
 * We need
 * 1) a Hapi server
 * 2) User authentication
 * 3) a data store
 */
var Hapi = require('hapi')
var Boom = require('boom')
var Promise = require('lie')

var PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-hoodie-api'))

function kazanaMockFactory (callback) {
  var server = new Hapi.Server({})
  server.connection()

  /*
   * To mock users being/not being logged in,
   * stub out the couchdbAuth strategy from kazana-server
   * users are read from fixtures/users.json,
   * they have fixed auth tokens,
   * and you choose which user to be logged in as
   * by picking token.
   */
  var validUsers = require('../fixtures/users')
  server.auth.scheme('fixture', function (server) {
    return {
      authenticate: function (request, reply) {
        var token = request.headers.authorization

        if (!!token && token in validUsers) {
          reply.continue({
            credentials: validUsers[token]
          })
        }

        // leave other users as unauthorized
        var response = reply('Unauthorized')
        response.statusCode = 401
        return response
      }
    }
  })
  // true makes this the default auth strategy for all routes
  server.auth.strategy('fixture', 'fixture', true)

  server.decorate('reply', 'pouchdbError', function (error) {
    return this.response(Boom.wrap(error, error.status))
  })
  server.app.utils = { Promise: Promise }

  // This mocks a CouchDB server loaded
  // with a bunch of reports
  // taken from kazana-server get-store.js
  // Give each test store a unique name
  var db = new PouchDB('rawData' + Math.random().toString().substring(2), { db: require('memdown') })
  // pre-populate docs
  var bootstrap = db.bulkDocs(require('../fixtures/reports').reports)

  if (typeof callback === 'function') {
    bootstrap.then(function () { return server }).then(callback)
  }

  var api = db.hoodieApi()
  server.method('getStore', function () {
    return api
  })
  server.rawData = api

  return server
}
