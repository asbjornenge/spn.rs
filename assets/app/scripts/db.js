define([
    'radio',
    'lodash',
    'remotedb',
    'localdb',
    'spnr'
], function(radio, _, remotedb, localdb, Spnr) {

    /** VARIABLES **/

    var rdb = new remotedb('https://spnrs.firebaseio.com/');
    var ldb = new localdb()

    /** LOCAL **/

    ldb
        .on('feed.global.added', function(spnr) {
            // broadcast
            console.log('added',spnr)
        })
        .on('feed.user.added', function(spnr) {
            // broadcast
        })
        .on('login', function(user) {
            // broadcast
            radio('user.logged_in').broadcast(navigator.onLine ? user : ldb.user);
        })

    /** REMOTE **/

    rdb('spnrs')
        .from(ldb.last('global','loaded'))
        .on('added', function(snap) {
            var data = snap.val()
            var uuid = snap.name()
            // TODO: Should work without flatten
            if (_.contains(_.flatten(ldb.feeds.global,'uuid'), uuid)) { return }
            ldb.trigger('feed.global.added', new Spnr(data.spnr, data.user, uuid));
            ldb.latest.global.loaded = uuid;
        })
        .on('login', function(user, error) {
            ldb.trigger('login', user)
        })

    /** VIEWS **/

    radio('user.login').subscribe(function(provider) {
        rdb.login(provider)
    })

    radio('user.logout').subscribe(function() {
        rdb.logout()
        ldb.user = null
        // TODO: Reset more?
    })

    /** RETURN **/

    return {
        remote : rdb,
        local  : ldb
    };

})
