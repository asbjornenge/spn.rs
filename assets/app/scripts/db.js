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
            radio('feed.global.added').broadcast(spnr);
        })
        .on('feed.user.added', function(spnr) {
            // broadcast
        })
        .on('login', function(user) {
            radio('user.logged_in').broadcast(navigator.onLine ? user : ldb.user);
        })

    /** REMOTE **/

    rdb('spnrs')
        .from(ldb.last('global','loaded'))
        .on('added', function(snap) {
            var data = snap.val()
            var uuid = snap.name()
            if (_.contains(_.flatten(ldb.feeds.global,'uuid'), uuid)) { return }
            ldb.trigger('feed.global.added', new Spnr(data.spnr, data.user, uuid));
            ldb.latest.global.loaded = uuid;
            ldb.saveLocal();
        })
        .on('login', function(user, error) {
            ldb.trigger('login', user)
            ldb.saveLocal();
        })

    /** VIEWS **/

    radio('user.login').subscribe(function(provider) {
        rdb.login(provider)
    })

    radio('user.logout').subscribe(function() {
        rdb.logout()
        ldb.user = null
        // TODO: Reset more?
        ldb.saveLocal();
    })

    radio('spnrs.add').subscribe(function(s) {
        ldb.trigger('feed.global.added', new Spnr(s, ldb.user.id));
        ldb.saveLocal();
    })

    /** RETURN **/

    return {
        remote : rdb,
        local  : ldb
    };

})
