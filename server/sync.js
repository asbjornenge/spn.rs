/** FIREBASE SYNC SERVER **/

var Firebase = require('firebase');
var root     = new Firebase('https://spnrs.firebaseio.com');

/** GET INITIAL STATE **/

// root.child('global').limit(1).once('value', function(latest_global_snap) {
//     if (latest_global_snap.val() === null) init(null);
//     var latest = latest_global_snap.val();
//     init(Object.keys(latest)[0])
//     // console.log(Object.keys(latest))
//     // console.log(latest_global_snap.name(), latest_global_snap.val())
// })

// function init(latest_global) {
//     listen_add(latest_global);
// }

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

// function listen_add(latest_global) {

// }

