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
    'comp/login'
    ],
function(
    radio,
    backend,
    dom,
    Login)
{
    /* SETUP LISTENERS */

    radio('user.logged_in').subscribe(function(user) {
        console.log(Login)
        if (user === null) { Login.attach(dom('#container')[0]); return; }
        if (typeof user === 'object') { console.log(user) }
    })
    radio('user.login').subscribe(function(provider) {
        backend.login(provider);
    })

    /* INITIALIZE */

    backend.init();
});

