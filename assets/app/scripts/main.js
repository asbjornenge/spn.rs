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

    /* STATE */

    var localState = localStorage.getItem('spn.rs');
    // TODO: expose state globally?
    state = localState ? JSON.parse(localState) : {
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

    /** REMOTE **/

    var rdb = new remotedb('https://spnrs.firebaseio.com/');

    rdb('spnrs').from(state.latest.global.loaded)
        .on('added', function(snap) {
            console.log('added')
            var data = snap.val()
            var uuid = snap.name()
            if (_.contains(_.flatten(state.global,'uuid'), uuid)) { return }
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
        .on('login', function(user, error) {
            radio('state.change').broadcast({user:user})
        })

    /** FUNCTIONS **/

    function view_switcher() {
        if (!state.user) { Login.attach(dom('#container')[0]); return; }
        else             { Spnrs.attach(dom('#container')[0], state); return;}
    }

    function snapshot() {
        localStorage.setItem('spn.rs', JSON.stringify(state))
    }

    /** LISTENERS **/

    radio('user.logged_in').subscribe(function(user) {
        state.user = user;
        view_switcher();
    })

    radio('state.change').subscribe(function(new_state) {
        _.assign(state, new_state)
        view_switcher();
        snapshot();
    })

    radio('ui.event.login').subscribe(function(provider) {
        rdb.login(provider);
    })

    radio('ui.event.logout').subscribe(function() {
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
    })

    /** INITIALIZE **/

    rdb.connect();
    rdb.start();
    if (!navigator.onLine) {
        view_switcher();
    }

});

