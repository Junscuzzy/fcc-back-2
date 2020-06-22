/* eslint-disable camelcase */
'use strict'

const ObjectID = require('mongodb').ObjectID

const { isValidStringId } = require('../utils')

// const MongoClient = require('mongodb')
// const ObjectId = require('mongodb').ObjectID

// const CONNECTION_STRING = process.env.DB // MongoClient.connect(CONNECTION_STRING, function(err, db) {});

// TODO : 1) Write the unit tests
// TODO : 2) Connect the DB
// TODO : 3) Write code

/* Example issues 
{
  _id: "5871dda29faedc3491ff93bb" (string)
  issue_title: "Fix error in posting data" (string)
  issue_text: "When we post data it has an error." (string)
  created_on:"2017-01-08T06:35:14.240Z" (date/time|string)
  updated_on:"2017-01-08T06:35:14.240Z" (date/time|string)
  created_by: "Joe" (string)
  assigned_to: "Joe" (string)
  open: true (boolean)
  status_text: "In QA" (string)
} 
*/

module.exports = (app, db) => {
  app
    .route('/api/issues/:project')

    // - I can GET for an array of all issues on that specific project...
    //   ...with all the information for each issue as was returned when posted.
    // - I can filter my get request by also passing along any field and value in the query
    //   ...(ie. /api/issues/{project}?open=false).
    //   ...I can pass along as many fields/values as I want.
    .get((req, res) => {
      db.collection('issues')
        .find(req.query)
        .toArray((err, result) => {
          if (err) throw err
          return res.status(200).json(result || [])
        })
    })

    // - I can POST with form data containing required...
    //   ...issue_title, issue_text, created_by, and optional assigned_to and status_text
    // - The object saved (and returned) will include all of those fields (blank for optional no input)...
    //   ...and also include created_on(date/time), updated_on(date/time), open(boolean, true for open), and _id.
    .post((req, res) => {
      const { project } = req.params
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body

      if (!(issue_title && issue_text && created_by)) {
        return res.status(200).json({ message: 'Missing required fields' })
      }

      const issue = {
        project,
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      }

      // Create issue in DB
      db.collection('issues').insertOne(issue, (err, doc) => {
        if (err) throw err
        return res.status(200).json(doc.ops[0])
      })
    })

    // - I can PUT with a _id and any fields in the object with a value to object said object...
    //   ...Returned will be 'successfully updated' or 'could not update '+_id...
    //   ...This should always update updated_on...
    //   ...If no fields are sent return 'no updated field sent'.
    .put(async (req, res) => {
      const { _id, ...params } = req.body

      // console.log(req.body)

      if (!_id) {
        return res
          .status(200)
          .json({ message: 'Cannot update an issue without identifier (_id)' })
      }

      if (!isValidStringId(_id)) {
        return res
          .status(200)
          .json({ message: 'invalid identifier (_id) format' })
      }

      const query = { _id: ObjectID(_id) }
      const newValues = { $set: { ...params, updated_on: new Date() } }

      db.collection('issues').updateOne(query, newValues, (err, result) => {
        if (err) throw err

        // Updated
        if (result.modifiedCount) {
          return res.status(200).json({
            message: 'successfully updated',
          })
        }

        return res.status(200).json({ message: `could not update "${_id}"` })
      })
    })

    // - I can DELETE with a _id to completely delete an issue...
    //   ...If no _id is sent return '_id error',
    //   ...If success: 'deleted '+_id,
    //   ...If failed: 'could not delete '+_id.
    .delete(async (req, res) => {
      const { _id } = req.body

      if (!_id || !isValidStringId(_id)) {
        return res.status(200).json({ message: '_id error' })
      }

      try {
        const query = { _id: ObjectID(_id) }
        await db.collection('issues').deleteOne(query)
        return res.status(200).json({ message: `deleted ${_id}` })
      } catch (error) {
        return res.status(200).json({ message: `could not delete ${_id}` })
      }
    })
}
