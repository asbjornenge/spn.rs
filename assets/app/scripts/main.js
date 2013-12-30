require.config({
    paths: {
        fb      : '../bower_components/firebase/lib',
        radio   : '../bower_components/Radio/radio',
        nanodom : '../bower_components/nanodom/nanodom'
    }
});

// TODO : Have a html splash screen while checking login

require(['radio','backend','nanodom'], function(radio, backend, dom) {
    /* SETUP LISTENERS */
    radio('user.login').subscribe(function(user) {
        console.log('user', user);
    })

    /* INITIALIZED */
    backend.init();
});

