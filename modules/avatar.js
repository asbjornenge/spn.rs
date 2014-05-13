// var tob64  = require('to-base64')
var utils  = require('./utils')
var moment = require('moment')

// TO TEST: https://github.com/mathiasbynens/base64

var avatar = {
    check : function(user, state, days, callback) {
        if (state.avatars[user]) {
            var diff = moment().diff(moment(state.avatars[user].updated), 'days')
            if (diff < days) { callback(false); return }
        }
        var url;
        console.log(user)
        if (!user) { callback(false); return }
        if (user.indexOf('github') === 0) {
            url = 'https://avatars.githubusercontent.com/u/'+user.split(':')[1]+'?s=32'
        }
        if (user.indexOf('facebook') === 0) {
            url = 'http://graph.facebook.com/'+user.split(':')[1]+'/picture?type=small'
        }
        if (!url) {callback(false); return }
        state.avatars[user] = { url : '', update : new Date().getTime() }
        utils.convertImgToBase64(url, function(result) {
            state.avatars[user] = { url : result, updated : new Date().getTime() }
            callback(true)
        })
    }
}

module.exports = avatar
