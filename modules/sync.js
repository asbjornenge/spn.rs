var utils = require('./utils')
var _     = require('lodash')

var sync = {

    mine : function(mine, root, callback) {
        var to_sync     = mine.filter(function(s) { return !s.synced })
        var synced      = []
        var counter     = 0
        var cbcollector = function(err) {
            if (!err) {
                this.local.synced = true
                this.local.uuid   = this.clone.uuid
                synced.push(this.local)
            }
            counter++
            if (counter == to_sync.length) callback(synced)
        }
        to_sync.forEach(function(s) {
            s.uuid       = utils.uid(20)
            var clone    = _.clone(s, true)
            clone.synced = true
            root.child(clone.uuid).setWithPriority(clone, 0, cbcollector.bind({local:s, clone:clone}))
        })
        if (to_sync.length == 0) callback([])
    }

}

module.exports = sync
