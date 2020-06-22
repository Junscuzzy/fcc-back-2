/* eslint-disable camelcase */
const chaiHttp = require('chai-http')
const chaiDateTime = require('chai-datetime')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)
chai.use(chaiDateTime)

suite('Functional Tests', () => {
  // suite('POST /api/issues/{project} => object with issue data', () => {
  //   test('Every field filled in', done => {
  //     chai
  //       .request(server)
  //       .post('/api/issues/test')
  //       .send({
  //         issue_title: 'Title',
  //         issue_text: 'text',
  //         created_by: 'Functional Test - Every field filled in',
  //         assigned_to: 'Chai and Mocha',
  //         status_text: 'In QA',
  //       })
  //       .end((err, res) => {
  //         if (err) throw err

  //         const date = new Date()
  //         const {
  //           issue_title,
  //           issue_text,
  //           created_by,
  //           assigned_to,
  //           status_text,
  //           created_on,
  //           updated_on,
  //           open,
  //         } = res.body

  //         assert.equal(res.status, 200)
  //         assert.equal(issue_title, 'Title')
  //         assert.equal(issue_text, 'text')
  //         assert.equal(created_by, 'Functional Test - Every field filled in')
  //         assert.equal(assigned_to, 'Chai and Mocha')
  //         assert.equal(status_text, 'In QA')
  //         assert.equalDate(new Date(created_on), date)
  //         assert.equalDate(new Date(updated_on), date)
  //         assert.equal(open, true)
  //         assert.property(res.body, '_id')

  //         done()
  //       })
  //   })

  //   test('Required fields filled in', done => {
  //     chai
  //       .request(server)
  //       .post('/api/issues/test')
  //       .send({
  //         issue_title: 'Title',
  //         issue_text: 'text',
  //         created_by: 'Functional Test - Every field filled in',
  //       })
  //       .end((err, res) => {
  //         if (err) throw err

  //         const date = new Date()
  //         const {
  //           issue_title,
  //           issue_text,
  //           created_by,
  //           assigned_to,
  //           status_text,
  //           created_on,
  //           updated_on,
  //           open,
  //         } = res.body

  //         assert.equal(res.status, 200)
  //         assert.equal(issue_title, 'Title')
  //         assert.equal(issue_text, 'text')
  //         assert.equal(created_by, 'Functional Test - Every field filled in')
  //         assert.equal(assigned_to, '')
  //         assert.equal(status_text, '')
  //         assert.equalDate(new Date(created_on), date)
  //         assert.equalDate(new Date(updated_on), date)
  //         assert.equal(open, true)
  //         assert.property(res.body, '_id')

  //         done()
  //       })
  //   })

  //   test('Missing required fields', done => {
  //     chai
  //       .request(server)
  //       .post('/api/issues/test')
  //       .send({
  //         issue_title: 'Title',
  //       })
  //       .end((err, res) => {
  //         if (err) throw err
  //         assert.equal(res.status, 200)
  //         assert.equal(res.body.message, 'Missing required fields')

  //         done()
  //       })
  //   })
  // })

  suite('PUT /api/issues/{project} => text', () => {
    // test('If _id is missing', done => {
    //   chai
    //     .request(server)
    //     .put('/api/issues/test')
    //     .send({})
    //     .end((err, res) => {
    //       if (err) throw err
    //       assert.equal(res.status, 200)
    //       assert.equal(
    //         res.body.message,
    //         'Cannot update an issue without identifier (_id)',
    //       )

    //       done()
    //     })
    // })

    test('If _id (issue) is invalid', done => {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({ _id: 'fake_id' })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.equal(res.body.message, `invalid identifier (_id) format`)

          done()
        })
    })

    test('If _id (issue) doesn t exist', done => {
      const _id = '5ef0a876f417032bbe16aa21'
      chai
        .request(server)
        .put('/api/issues/test')
        .send({ _id })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.equal(res.body.message, `could not update "${_id}"`)

          done()
        })
    })

    test('If no body', done => {
      const _id = '5ef0a876d417032bbe16aa20'
      chai
        .request(server)
        .put('/api/issues/test')
        .send({ _id })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'successfully updated')

          done()
        })
    })

    test('One field to update', done => {
      const _id = '5ef0a876d417032bbe16aa20'
      chai
        .request(server)
        .put('/api/issues/test')
        .send({ _id, issue_title: 'My super title' })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'successfully updated')

          done()
        })
    })

    test('Multiple fields to update', done => {
      const _id = '5ef0a876d417032bbe16aa20'
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id,
          issue_title: 'My super title',
          created_by: 'Julien',
          issue_text: 'do that',
        })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'successfully updated')

          done()
        })
    })
  })

  suite('GET /api/issues/{project} => Array of objects with issue data', () => {
    test('No filter', done => {
      chai
        .request(server)
        .get('/api/issues/test')
        .query({})
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')
          done()
        })
    })

    test('One filter', done => {
      chai
        .request(server)
        .get('/api/issues/test')
        .query({ created_by: 'Julien' })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')

          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Julien')
          })
          done()
        })
    })

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', done => {
      chai
        .request(server)
        .get('/api/issues/test')
        .query({ created_by: 'Julien', status_text: 'In QA' })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')

          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Julien')
            assert.equal(issue.status_text, 'In QA')
          })
          done()
        })
    })
  })

  suite('DELETE /api/issues/{project} => text', () => {
    test('No _id', done => {
      chai
        .request(server)
        .delete('/api/issues/test')
        .send({})
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.equal(res.body.message, `_id error`)

          done()
        })
    })

    test('Valid _id', done => {
      const _id = '5ef0a8e90e65e12c2cf0cedc'
      chai
        .request(server)
        .delete('/api/issues/test')
        .send({ _id })
        .end((err, res) => {
          if (err) throw err
          assert.equal(res.status, 200)
          assert.equal(res.body.message, `deleted ${_id}`)

          done()
        })
    })
  })
})
