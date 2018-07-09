const _ = require('lodash')
const path = require('path')

function getDateTime(date = new Date(), format = 'HH:mm:ss') {
    let fn = d => {
        return ('0' + d).slice(-2)
    }
    if (date && _.isString(date)) {
        date = new Date(Date.parse(date))
    }
    const formats = {
        YYYY: date.getFullYear(),
        MM: fn(date.getMonth() + 1),
        DD: fn(date.getDate()),
        HH: fn(date.getHours()),
        mm: fn(date.getMinutes()),
        ss: fn(date.getSeconds())
    }
    return format.replace(/([a-z])\1+/gi, function(a) {
        return formats[a] || a
    })
}

module.exports = {
    getDateTime
}
