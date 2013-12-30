define([
    'radio',
    'fb/firebase',
    'fb/firebase-simple-login'
], function(radio) {

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
        this.root.child('spnrs').on('child_added', function(child) {
            radio('feeds.global').broadcast(child.val())
        })
        /* FRONTEND */
        radio('spnrs.add').subscribe(function(spnr) {
            this.root.child('spnrs').push({user:this.user.id, spnr:spnr})
        }.bind(this))
    }

    return new backend();

})
