/** FIREBASE SYNC SERVER **/

var Firebase = require('firebase');
var root     = new Firebase('https://spnrs.firebaseio.com');

/** UNSYNCED ADDS - PRIORITY 0 **/

root.child('users').on('child_added', function(user) {

    user.ref().child('spnrs').startAt(0).endAt(0).on('child_added', function(spnr_snap) {
        var spnr = spnr_snap.val();
        if (spnr.global) { console.log('pri 0 and synced', spnr); return }

        var ref = root.child('global').push(spnr);
        spnr_snap.ref().child('global').set(ref.name());
        spnr_snap.ref().setPriority(new Date().getTime());
        console.log('synced', spnr)

    })
})

