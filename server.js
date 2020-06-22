'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const mongo = require('mongodb').MongoClient

const apiRoutes = require('./routes/api.js')
const fccTestingRoutes = require('./routes/fcctesting.js')
const runner = require('./test-runner')

require('dotenv').config()

const port = process.env.PORT || 3000

const app = express()

app.use('/public', express.static(process.cwd() + '/public'))
app.use(helmet())
app.use(cors({ origin: '*' })) // For FCC testing purposes only

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pass = encodeURI(process.env.MONGO_PASS)
const MONGO_URI = `mongodb+srv://zzfcc:${pass}@fcc-mongodb-71tms.mongodb.net/test?retryWrites=true&w=majority`

mongo.connect(MONGO_URI, (err, client) => {
  if (err) {
    console.error('database connection error', err)
    throw err
  } else {
    console.log('Successfull database connection')
  }

  const db = client.db('issue_tracker')

  // Sample front-end
  app.route('/:project/').get((req, res) => {
    res.sendFile(process.cwd() + '/views/issue.html')
  })

  // Index page (static HTML)
  app.route('/').get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html')
  })

  // For FCC testing purposes
  fccTestingRoutes(app)

  // Routing for API
  apiRoutes(app, db)

  // 404 Not Found Middleware
  app.use((req, res, next) => {
    res.status(404).type('text').send('Not Found')
  })

  // Start our server and tests!
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...')
      setTimeout(() => {
        try {
          runner.run()
        } catch (e) {
          const error = e
          console.log('Tests are not valid:')
          console.log(error)
        }
      }, 3500)
    }
  })
})

module.exports = app // for testing
