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
            console.log('feed.global.added', spnr)
            // broadcast
        })
        .on('feed.user', function(spnr) {
            // broadcast
        })
        .on('login', function(user) {

        })

    /** REMOTE **/

    rdb('spnrs')
        .from(ldb.last_seen('global'))
        .on('added', function(spnr) {
            console.log('global added', spnr);
        })

    /** RETURN **/

    return {
        remote : rdb,
        local  : ldb
    };

})
