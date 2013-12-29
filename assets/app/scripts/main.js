require.config({
    paths: {
        fb    : '../bower_components/firebase/lib',
        radio : '../bower_components/Radio/radio'
    }
});

require(['radio','backend'], function(radio, backend) {
    /* SETUP LISTENERS */
    radio('user.login').subscribe(function(user) {
        console.log('user', user);
    })

    /* INITIALIZED */
    backend.init();
});

