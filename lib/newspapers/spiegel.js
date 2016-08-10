'use strict'

const util = require('util')
const assert = require('check-types').assert
const moment = require('moment')

module.exports = class Spiegel {

    static get BASE_URL() {
        return 'http://spiegel.de'
    }

    static get hasPrintVersion() {
        return true
    }

    static getArchiveUrl(date) {
        assert.date(date)
        return util.format(Spiegel.BASE_URL + '/nachrichtenarchiv/artikel-%s.html', moment(date).format('DD.MM.YYYY'))
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
        let article = {}
        $('.article-copyright').remove()
        $('.obfuscated').remove()
        $('p').last().has('i').remove()
        article.text = $('p').map((i, el) => $(el).text()).get().join(' ')
        article.headline = $('.lp-article-title h1').text() + ': ' + $('.headline').text()
        return article
    }

    static getPrintUrl(url) {
        return url.replace(/\.html/, '-druck.html')
    }

}
