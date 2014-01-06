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
    'db',
    'nanodom',
    'comp/login',
    'comp/spnrs'
    ],
function(
    radio,
    _,
    db,
    dom,
    Login,
    Spnrs)
{

    /* FUNCTIONS */

    // Read from db.local
    var state = {
        adding : false,
        view   : 'global',
        global : db.local.all('global'),
        user   : null
    }

    function view_switcher() {
        if (!state.user) { Login.attach(dom('#container')[0]); return; }
        else             { Spnrs.attach(dom('#container')[0], state); return;}
    }

    /* SETUP LISTENERS */

    radio('user.logged_in').subscribe(function(user) {
        state.user = user;
        view_switcher();
    })

    radio('state.change').subscribe(function(new_state) {
        _.merge(state, new_state)
        view_switcher();
    })

    /* INITIALIZE */

    // db.local.reset()

    db.remote.connect();
    db.remote.start();
    // db.local.saveLocalTimer(5000);
    if (!navigator.onLine) {
        db.local.trigger('login', null);
    }

});

