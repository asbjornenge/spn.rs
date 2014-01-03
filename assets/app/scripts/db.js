define([
    'radio',
    'remotedb',
    'localdb'
], function(radio, remotedb, localdb) {

    /** VARIABLES **/

    var rdb = new remotedb('https://spnrs.firebaseio.com/');
    var ldb = new localdb()

    /** LOCAL **/

    ldb
        .on('feed.global.added', function(spnr) {
            // broadcast
            // console.log('feed.global.added', spnr)
        })
        .on('feed.user.added', function(spnr) {
            // broadcast
        })
        .on('login', function(user) {
            // broadcast
            // radio('user.logged_in').broadcast(navigator.onLine ? user : ldb.user)
            radio('user.logged_in').broadcast(user);
            console.log('login', user)
        })

    /** REMOTE **/

    rdb('spnrs')
        .from(ldb.last_seen('global'))
        .on('added', function(spnr) {
            // TODO: convert to spnr
            ldb.trigger('feed.global.added', spnr);
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
    })

    /** RETURN **/

    return {
        remote : rdb,
        local  : ldb
    };

})
