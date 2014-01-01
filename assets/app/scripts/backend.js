define([
    'radio',
    'spnr',
    'localstore',
    'fb/firebase',
    'fb/firebase-simple-login'
], function(radio, spnr, localstore) {

    function backend() {
        this.auth = null;
        this.root = new Firebase('https://spnrs.firebaseio.com/');
    }
    backend.prototype.init = function() {
        this.auth = new FirebaseSimpleLogin(this.root, function(error, user) {
            radio('user.logged_in').broadcast(error ? error : user ? user : null)
        });
        return this;
    }
    backend.prototype.login = function(provider) {
        var options = {}
        switch(provider) {
            case 'github':
                options = { rememberMe : true, scope : 'user'}
                break;
            default:
                console.log('Unknown provider '+provider); return;
        }
        this.auth.login(provider, options)
        return this;
    }
    backend.prototype.logout = function() {
        this.auth.logout();
        return this;
    }
    backend.prototype.setuser = function(user) {
        this.user = user;
        return this;
    }
    backend.prototype.listen = function() {
        /* BACKEND */
        var global_last_read = localstore.get('feeds.global.lastread');
        var global_bulk_ref  = this.root.child('spnrs').endAt(global_last_read).limit(10);

        global_bulk_ref.once('value', function(data) {
            // TODO: What about having that bulk data in localStorage?
            var bulk = [];
            data.forEach(function(snap) { bulk.push(new spnr.Spnr(snap)) })
            var last = bulk.pop()
            radio('feeds.global.bulk').broadcast(bulk.reverse());
            this.root.child('spnrs').startAt(null, last.uuid).on('child_added', function(child) {
                radio('feeds.global.new').broadcast(new spnr.Spnr(child))
            })
        }.bind(this))
        /* FRONTEND */
        radio('spnrs.add').subscribe(function(spnr) {
            this.root.child('spnrs').push({user:this.user.id, spnr:spnr})
        }.bind(this))
    }

    return new backend();

})
