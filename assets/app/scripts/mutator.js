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

    stateMutatur.prototype.add = function(spnr) {

        console.log('add',spnr)

        /** Already got it? **/

        var found = synced = local = false;
        var index = 0;
        this.state.global.forEach(function(s,i) {
            if (s.uuid === spnr.uuid) {
                synced = s.synced == spnr.synced;
                found  = true;
                index  = i;
            }
        }.bind(this))

        /** LOCAL STATES **/

        if (!found && !spnr.synced) {
            console.log('new local')
            this.new.global = this.state.global;
            this.state.global.unshift(spnr);
        }

        /** REMOTE **/

        if (!found && spnr.synced) {
            console.log('new global')
            this.new.global = this.state.global;
            this.state.global.unshift(spnr);
        }

        /** INCONSISTENT **/

        if (found && !synced) {
            console.log('fixing inconsistent');
            this.new.global = this.state.global;
            this.state.global[index].synced = true;
        }

        if (found && synced) {
            console.log('all good - already got it');
        }

        return this;
    };

    stateMutatur.prototype.remove = function(spnr) {

        return this;
    }

    stateMutatur.prototype.sync = function(rdb) {
        this.state.global.forEach(function(s) {
            if (!s.synced) {
                console.log('syncing')
                s.synced = true;
                rdb('global').ref().child(s.uuid).set(s);
            }
        })
        return this;
    }

    stateMutatur.prototype.diff = function() {
        return this.new;
    }

    return function(state) { return new stateMutatur(state); }

})
