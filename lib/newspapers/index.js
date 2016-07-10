'use strict'
module.exports = require('require-directory')(module, {
    rename: (name) => name.toUpperCase()
})
