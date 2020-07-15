const express = require('express')
const serveIndex = require('serve-index')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const { cache, getCachedToken } = require('./cache')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cors())

app.get('/', (req, res) => {
    res.send(cache.getStats())
})

app.get('/flush', (req, res) => {
    cache.flushAll()
    res.redirect('/?cacheFlushed=true')
})

app.use('/cdn', express.static('./dist'), serveIndex('./dist'))

app.get('/:reportId', async (req, res) => {
    let result = await getCachedToken(req.params.reportId)
    res.status(result.status).send(result)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))