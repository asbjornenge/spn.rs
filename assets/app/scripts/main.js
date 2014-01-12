require.config({
    paths: {
        fb      : '../bower_components/firebase/lib',
        radio   : '../bower_components/Radio/radio',
        react   : '../bower_components/react/react',
        lodash  : '../bower_components/lodash/dist/lodash',
        uuid    : '../bower_components/node-uuid/uuid',
        nanodom : '../bower_components/nanodom/nanodom',
        comp    : '../components'
    }
});

// TODO : Have a html splash screen while checking login

require([
    'uuid',
    'radio',
    'lodash',
    'nanodom',
    'remotedb',
    'comp/login',
    'comp/spnrs'
    ],
function(
    uuid,
    radio,
    _,
    dom,
    remotedb,
    Login,
    Spnrs)
{

    /** STATE **/

    var localState   = localStorage.getItem('spn.rs');
    var defaultState = {
        adding : false,
        view   : 'global',
        global : [],
        user   : null,
        latest : {
            global : {
                loaded : null,
                seen   : null
            }
        }
    }
    state = localState ? JSON.parse(localState) : defaultState;

    /** REMOTE **/

    var rdb = new remotedb('https://spnrs.firebaseio.com/');

    rdb('global').from(state.latest.global.loaded)
        .on('child_added', function(snap) {
            var data  = snap.val()
            var uuid  = snap.name()
            var abort = false;
            state.global.forEach(function(spnr) {
                if (uuid === spnr.uuid) abort = true;
                if (data.uuid === spnr.uuid) {
                    // Cheat ?
                    spnr.uuid = uuid;
                    radio('state.change').broadcast({});
                    abort = true;
                }
            })
            if (abort) return;
            var spnr = {
                spnr : data.spnr,
                user : data.user,
                uuid : uuid
            };
            radio('state.change').broadcast({
                global : [spnr].concat(state.global),
                latest : { global : { loaded : uuid }}
            })
        })
        .on('child_removed', function(snap) {
            var removed_uuid = snap.name()
            // TODO: Reset latest
            radio('state.change').broadcast({
                global : state.global.reduce(function(a,b) {
                    return b.uuid !== removed_uuid ? a.concat([b]) : a;
                },[])
            })
        })
        .on('login', function(user, error) {
            if (user) rdb('users').ref().child(user.id).set(user);
            radio('state.change').broadcast({user:user})
        })
        .on('logout', function() {
            console.log("Firebase logged out");
        })

    /** FUNCTIONS **/

    function view_switcher() {
        if (!state.user) { Login.attach(dom('#container')[0]); return; }
        else             { Spnrs.attach(dom('#container')[0], state); return;}
    }

    function snapshot() {
        localStorage.setItem('spn.rs', JSON.stringify(state))
    }

    function attempt_sync_with_server() {
        state.global.map(function(spnr) {
            if (spnr.uuid.length == 36) {
                var ref = rdb('global').add(spnr)
                console.log(ref.name())
                // console.log(ref.val())
            }
        })
    }

    /** LISTENERS **/

    radio('state.change').subscribe(function(new_state) {
        _.assign(state, new_state)
        view_switcher();
        snapshot();
    })

    radio('ui.event.login').subscribe(function(provider) {
        rdb.login(provider);
    })

    radio('ui.event.logout').subscribe(function() {
        state = defaultState;
        snapshot();
        rdb.logout();
    })

    radio('ui.event.add').subscribe(function(spnr) {
        var val = {
            spnr : spnr,
            user : state.user.id,
            uuid : uuid.v4()
        }
        radio('state.change').broadcast({
            global : [val].concat(state.global)
        })
        if (navigator.onLine) attempt_sync_with_server();
    })

    radio('ui.event.remove').subscribe(function(spnr) {
        /* Never synced */
        if (!navigator.onLine && spnr.uuid.length == 36) {
            radio('state.change').broadcast({
                global : state.global.reduce(function(a,b) {
                    return b.uuid !== spnr.uuid ? a.concat([b]) : a;
                },[])
            })
            return;
        }
        /* Synced - but not online - can't delete */
        if (!navigator.onLine && spnr.uuid.length < 36) return;
        /* Delete */
        rdb('global').remove(spnr.uuid, function(error) {
            if (error) console.log('remove error', error)
        })
    })

    window.addEventListener('online', function(e) {
        attempt_sync_with_server();
    });

    /** INITIALIZE **/

    rdb.connect();
    rdb.start();
    if (!navigator.onLine) {
        view_switcher();
    } else {
        attempt_sync_with_server();
    }

});

