module.exports = {
  method: 'GET',
  path: '/api/updates/{id}/transformed',
  handler: getTransformedHandler
}

var Promise = require('pouchdb/extras/promise')
var failIfNotByUser = require('../utils/fail-if-not-by-user')

function getTransformedHandler (request, reply) {
  var server = request.connection.server
  var store = server.methods.getStore({
    name: 'raw-data',
    auth: request
  })
  var user = request.auth.credentials

  store.db.info()
    .then(function (info) {
      var promise = store.find(request.params.id)

      if (!user.isAdmin) {
        promise = promise.then(failIfNotByUser.bind(null, user))
      }

      var settings = server.settings && server.settings.apps && server.settings.app['transform-listener']
      return promise.then(prepareUpdateInfo(store, info.update_seq, settings))
        .then(reply)
        .catch(reply.pouchdbError.bind(reply))
    })
    .catch(reply.pouchdbError.bind(reply))
}

function prepareUpdateInfo (store, seq, settings) {
  settings = settings || {}

  return function (doc) {
    if (doc.transformedAt) {
      return {
        id: doc.id,
        transformedAt: doc.transformedAt,
        transformationErrors: doc.transformationErrors,
        transformationSummary: doc.transformationSummary
      }
    }
    var changesOptions = {
      since: seq,
      live: true,
      include_docs: true,
      doc_ids: [doc.id]
    }
    if ('timeout' in settings) {
      changesOptions.timeout = parseInt(settings.timeout, 10)
    }

    var changes = store.db.changes(changesOptions)

    return new Promise(function (resolve, reject) {
      changes.on('error', reject)
      changes.on('change', function (change) {
        if (!change.doc.transformedAt) return
        resolve({
          id: change.id,
          transformedAt: change.doc.transformedAt,
          transformationErrors: change.doc.transformationErrors,
          transformationSummary: change.doc.transformationSummary
        })
      })
    })
  }
}
