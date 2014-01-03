require.config({
    paths: {
        fb      : '../bower_components/firebase/lib',
        radio   : '../bower_components/Radio/radio',
        react   : '../bower_components/react/react',
        nanodom : '../bower_components/nanodom/nanodom',
        comp    : '../components'
    }
});

// TODO : Have a html splash screen while checking login

require([
    'radio',
    'db',
    'nanodom',
    'comp/login',
    'comp/spnrs'
    ],
function(
    radio,
    db,
    dom,
    Login,
    Spnrs)
{

    /* FUNCTIONS */

    function view_switcher(user) {
        if (!user) { Login.attach(dom('#container')[0]); return; }
        else       { Spnrs.attach(dom('#container')[0]); return; }
    }

    /* SETUP LISTENERS */

    radio('user.logged_in').subscribe(function(user) {
        view_switcher(user);
    })

    /* INITIALIZE */

    db.remote.connect();
    db.remote.start();
    if (!navigator.onLine) {
        db.local.trigger('login', null);
    }

});

