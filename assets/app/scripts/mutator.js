define([
    'lodash'
], function(
    _
) {

    function stateMutatur(state) {
        this.orig  = state;
        this.state = _.clone(state, true);
        this.new   = {}
    }

    stateMutatur.prototype.add = function(feed, spnr) {

        /** Already got it? **/

        var found = synced = local = false;
        var index = 0;
        this.state[feed].forEach(function(s,i) {
            if (s.uuid === spnr.uuid) {
                synced = s.synced == spnr.synced;
                found  = true;
                index  = i;
            }
        }.bind(this))

        /** LOCAL STATES **/

        if (!found && !spnr.synced) {
            console.log('new local', feed)
            this.new[feed] = this.state[feed];
            this.state[feed].unshift(spnr);
        }

        /** REMOTE **/

        if (!found && spnr.synced) {
            this.new[feed] = this.state[feed];
            this.new[feed].unshift(spnr);
        }

        /** INCONSISTENT **/

        if (found && !synced) {
            console.log('fixing inconsistent');
            this.new[feed] = this.state[feed];
            this.state[feed][index].synced = true;
        }

        if (found && synced) {
            console.log('all good - already got it', feed);
            // console.log(spnr)
        }

        return this;
    };

    stateMutatur.prototype.remove = function(spnr) {

        return this;
    }

    stateMutatur.prototype.sync = function(rdb) {
        this.state.mine.forEach(function(s) {
            if (!s.synced) {
                console.log('syncing')
                s.synced = true;
                rdb('mine').ref().child(s.uuid).setWithPriority(s,0);
            }
        })
        return this;
    }

    stateMutatur.prototype.diff = function() {
        return this.new;
    }

    return function(state) { return new stateMutatur(state); }

})
