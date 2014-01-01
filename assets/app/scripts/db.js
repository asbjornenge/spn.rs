define([
    'radio',
    'remotedb',
    'localdb'
], function(radio, remotedb, localdb) {

    // backend.prototype.setuser = function(user) {
    //     this.user = user;
    //     return this;
    // }
    // backend.prototype.listen = function() {
    //     /* BACKEND */
    //     var global_last_read = localstore.get('feeds.global.lastread');
    //     var global_bulk_ref  = this.root.child('spnrs').endAt(global_last_read).limit(10);

    //     global_bulk_ref.once('value', function(data) {
    //         // TODO: What about having that bulk data in localStorage?
    //         var bulk = [];
    //         data.forEach(function(snap) { bulk.push(new spnr.Spnr(snap)) })
    //         var last = bulk.pop()
    //         radio('feeds.global.bulk').broadcast(bulk.reverse());
    //         this.root.child('spnrs').startAt(null, last.uuid).on('child_added', function(child) {
    //             radio('feeds.global.new').broadcast(new spnr.Spnr(child))
    //         })
    //     }.bind(this))
    //     /* FRONTEND */
    //     radio('spnrs.add').subscribe(function(spnr) {
    //         this.root.child('spnrs').push({user:this.user.id, spnr:spnr})
    //     }.bind(this))
    // }

    /** VARIABLES **/

    var rdb = new remotedb('https://spnrs.firebaseio.com/')
    var ldb = new localdb(rdb)

    /** LISTENERS **/

    ldb
    .on('feed.global.new', function(spnr) {
        console.log('feed.global.new', spnr)
        // broadcast
    })
    .on('feed.user.new', function(spnr) {
        // broadcast
    })
    .on('login', function(user) {

    })

    /** RETURN **/

    return ldb;

})
