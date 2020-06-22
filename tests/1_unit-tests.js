const { assert } = require('chai')

const { isValidStringId } = require('../utils')

suite('Unit Tests', () => {
  suite('Utils functions', () => {
    suite('isValidStringId(id)', () => {
      test('if is a string of 24 hex characters', done => {
        assert.isTrue(isValidStringId('5e63c3a5e4232e4cd0274ac2'))
        done()
      })
      test('if is not a string of 24 hex characters', done => {
        assert.isFalse(isValidStringId('uhuh'))
        done()
      })
    })
  })
})
