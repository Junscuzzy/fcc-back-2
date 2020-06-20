'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const apiRoutes = require('./routes/api.js')
const fccTestingRoutes = require('./routes/fcctesting.js')
const runner = require('./test-runner')

require('dotenv').config()

const port = process.env.PORT || 3000

const app = express()

app.use('/public', express.static(process.cwd() + '/public'))

app.use(cors({ origin: '*' })) // For FCC testing purposes only

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
apiRoutes(app)

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

module.exports = app // for testing
