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
    'backend',
    'nanodom',
    'comp/login',
    'comp/spnrs'
    ],
function(
    radio,
    backend,
    dom,
    Login,
    Spnrs)
{
    /* SETUP LISTENERS */

    radio('user.logged_in').subscribe(function(user) {
        if (user === null)            { Login.attach(dom('#container')[0]); return; }
        if (typeof user === 'object') { Spnrs.attach(dom('#container')[0], {user:user}, function() {
            backend.setuser(user).listen();
        }); return; }
    })
    radio('user.login').subscribe(function(provider) {
        backend.login(provider);
    })
    radio('user.logout').subscribe(function() {
        backend.logout();
    })

    /* INITIALIZE */

    backend.init();
});

