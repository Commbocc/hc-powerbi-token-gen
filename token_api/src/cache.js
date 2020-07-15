const NodeCache = require("node-cache")
const { DateTime, Duration } = require('luxon')
const getToken = require('./token')

const appCache = new NodeCache()

exports.cache = appCache

exports.getCachedToken = async (reportId) => {
    let key = `token-${reportId}`
    let token = appCache.get(key)
    if (token === undefined) {
        token = await getToken(reportId)
        appCache.set(key, token, expiresInSeconds(token.expiration))
    }
    return token
}

const expiresInSeconds = (date) => {
    let durastion = DateTime.fromISO(date).diffNow('seconds').toObject()
    return (date) ? Math.floor(durastion.seconds) : 1
}