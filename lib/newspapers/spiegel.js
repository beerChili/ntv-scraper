'use strict'

const util = require('util')
const check = require('check-types')
const moment = require('moment')

module.exports = class Spiegel {

    static get BASE_URL() {
        return 'http://spiegel.de'
    }

    static get hasPrintVersion() {
        return true
    }

    static getArchiveUrl(date) {
        check.assert.date(date)
        return util.format(Spiegel.BASE_URL + '/nachrichtenarchiv/artikel-%s.html', moment.format(date, 'DD.MM.YYYY'))
    }

    static parseArchive($) {
        const urlList = []
        $('div#content-main div.column-wide li').each((index, el) => {
            const href = $('a', el).attr('href')
            if (!href.startsWith('http://')) {
                const url = Spiegel.BASE_URL + href
                urlList.push(url)
            }
        })
        return urlList
    }

    static parseArticle($) {
        $('.article-copyright').remove()
        return $('p').text()
    }

    static getPrintUrl(url) {
        return url.replace(/\.html/, '-druck.html')
    }

}