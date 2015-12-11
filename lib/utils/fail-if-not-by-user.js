module.exports = failIfNotByUser

// var Boom = require('boom')

var belongsToUser = require('./belongs-to-user')

function failIfNotByUser (user, object) {
  if (belongsToUser(user, object)) return object

  // this should be caught by reply-pouchdb-error
  var error = new Error('Not found')
  error.status = 404
  throw error
}
