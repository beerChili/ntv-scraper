'use strict'

const request = require('request'),
    cheerio = require('cheerio'),
    assert = require('check-types').assert,
    debug = require('debug')('scraper'),
    newspapers = require('./lib/newspapers')

function GET(url, timeout = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            request(url, (err, response, body) => {
                if (err) return reject(err)
                if (response.statusCode == 200) return resolve(cheerio.load(response.body))
                else return reject(response.toJSON())
            })
        }, timeout)
    })
}

function getArticleURLs(source, date) {
    assert.nonEmptyString(source)
    assert.date(date)
    source = source.toUpperCase()
    return new Promise((resolve, reject) => {
        if (!newspapers.hasOwnProperty(source)) return reject(`Scraping for ${source} is not implemented`)
        debug('Get $s articles for %s', source, date.toDateString())
        GET(newspapers[source].getArchiveUrl(date))
            .then($ => resolve(newspapers[source].parseArchive($)))
            .catch(err => reject(err))
    })
}

function getArticle(url, timeout = 0) {
    assert.nonEmptyString(url)
    let source
    for (let key in newspapers) {
        if (newspapers.hasOwnProperty(key) && url.startsWith(newspapers[key].BASE_URL)) {
            source = key
            break
        }
    }
    return new Promise((resolve, reject) => {
        if (!source) return reject(`Scraping for ${url} is not implemented`)
        if (newspapers[source].hasPrintVersion) url = newspapers[source].getPrintUrl(url)
        GET(url, timeout)
            .then($ => resolve(newspapers[source].parseArticle($)))
            .catch(err => reject(err))
    })
}

module.exports = {
    getArticleURLs,
    getArticle
}
