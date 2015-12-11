module.exports = belongsToUser

var _ = require('lodash')

function belongsToUser (user, object) {
  return user.id === _.get(object, 'createdBy.id')
}
