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
    'radio',
    'lodash',
    'nanodom',
    'remotedb',
    'mutator',
    'transformator',
    'comp/login',
    'comp/spnrs'
    ],
function(
    radio,
    _,
    dom,
    remotedb,
    mutator,
    trans,
    Login,
    Spnrs)
{

    /** STATE **/

    var localState   = localStorage.getItem('spn.rs');
    var defaultState = {
        adding    : false,
        view      : 'global',
        global    : [],
        mine      : [],
        favorites : [],
        user      : null,
        latest    : {
            global : {
                loaded : null,
                seen   : null
            },
            mine : {
                loaded : null
            }
        }
    }
    state = localState ? JSON.parse(localState) : defaultState;

    /** REMOTE **/

    var rdb = new remotedb('https://spnrs.firebaseio.com/');

    rdb
    .on('login', function(user, error) {
        radio('state.change').broadcast({user:user})
        if (!user) return;

        // UPDATE USER DATA

        rdb('users').ref().child(user.uid+'/meta').set(user);

        // LISTEN TO ADD EVENTS

        rdb('global').from(state.latest.global.loaded)
            .on('child_added', function(snap) {
                var diff = mutator(state).add('global', trans.snap2spnr(snap)).diff();
                diff.latest = _.clone(state.latest, true);
                diff.latest.global.loaded = snap.name();
                radio('state.change').broadcast(diff);
            })
            .on('child_removed', function(snap) {
                console.log('removed')
            })

        rdb('mine').from(state.latest.mine.loaded)
            .on('child_added', function(snap) {
                var diff = mutator(state).add('mine', trans.snap2spnr(snap)).diff();
                diff.latest = _.clone(state.latest, true);
                diff.latest.mine.loaded = parseInt(snap.getPriority());
                radio('state.change').broadcast(diff);
            })
            .on('child_removed', function(snap) {
                console.log('removed')
            })

        // START LISTENING/PULLING DATA

        rdb.listen();
    })
    .on('logout', function() {
        rdb.dropFeeds();
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
        mutator(state).sync(rdb);
    }

    /** LISTENERS **/

    radio('state.change').subscribe(function(new_state) {
        if (Object.keys(new_state).length === 0) return;
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

    radio('ui.event.add').subscribe(function(snap) {
        var diff = mutator(state).add('mine', trans.val2spnr(snap)).diff();
        radio('state.change').broadcast(diff);
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
    rdb.listenLogin();
    if (!navigator.onLine) {
        view_switcher();
    } else {
        attempt_sync_with_server();
    }

});

