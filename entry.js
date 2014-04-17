/** SPNRS ENTRYPOINT **/

require('./styles/main.styl')
require('./bower_components/firebase/firebase')
require('./bower_components/firebase-simple-login/firebase-simple-login')

var React    = require('react')
var Login    = require('./modules/components/login.jsx')
var Spnrs    = require('./modules/components/spnrs.jsx')
var emitter  = require('nanoemitter')()
var firefeed = require('./modules/firefeed')
var dom      = require('nanodom')
var avatar   = require('./modules/avatar')
var sync     = require('./modules/sync')
var _        = require('lodash')

React.initializeTouchEvents(true)

/** STATE **/

var localState   = localStorage.getItem('spn.rs');
var defaultState = {
    adding    : false,
    view      : 'global',
    global    : [],
    mine      : [],
    favorites : [],
    user      : null,
    avatars   : {},
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
state = localState ? JSON.parse(localState) : _.clone(defaultState, true);
function snapshot() {
    localStorage.setItem('spn.rs', JSON.stringify(state))
}

/** FEEDS **/

var root         = new Firebase('https://spnrs.firebaseio.com/')
var feeds        = {}
var syncListener = function() { emitter.trigger('sync') }
emitter.on('logged_in', function() {

    this.global = firefeed(root, state)
        .feed('global')
        .on('child_added', function(spnr) {
            state.global.unshift(spnr)
            emitter.trigger('render')
        })
        .on('child_removed', function(spnr) {
            console.log('removed')
        }).listen()

    this.mine = firefeed(root, state)
        .feed('mine')
        .on('child_added', function(spnr) {
            state.mine.unshift(spnr)
            emitter.trigger('render')
        })
        .on('child_changed', function(spnr) {
            state.mine.forEach(function(s) {
                if (s.uuid == spnr.uuid) {
                    _.merge(s, spnr)
                    // spanshot
                }
            })
        })
        .on('child_removed', function(spnr) {
            console.log('removed')
        }).listen()

    window.addEventListener('online', syncListener)

}.bind(feeds))
emitter.on('logged_out', function() {

    state = _.clone(defaultState, true)
    snapshot()
    this.global.pause()
    this.mine.pause()
    window.removeEventListener('online', syncListener)

}.bind(feeds))

/** SYNC **/

emitter.on('sync', function() {
    if (!navigator.onLine) return
    if (!state.user) return
    sync.mine(state.mine, root.child('users/'+state.user.uid+'/spnrs'), function(synced) {
        // Dersom vi plutselig har flere som har blitt synced, render...
        // TODO: Kanskje ikke her? tenke paa dette
        if (synced.length > 1) emitter.trigger('render')
    })
})

/** RENDER **/

// Render a "loading" view - or have it set by css default.
emitter.on('render', function() {
    console.log('rendering')
    var mountnode = dom('#container')[0];
    if (!state.user) {
        React.renderComponent(Login({state:state, emitter:emitter}), mountnode)
    } else {
        React.renderComponent(Spnrs({state:state, emitter:emitter}), mountnode)
    }
})

/** LOGIN / LOGOUT **/

emitter.on('login', function(service) {
    var options = {}
    switch(service) {
        case 'github':
            options = { rememberMe : true, scope : 'user'}
            break;
        case 'facebook':
            options = { rememberMe: true, scope: 'email' }
            break;
    }
    simplelogin.login(service, options);
})
emitter.on('logout', function() {
    simplelogin.logout()
    emitter.trigger('logged_out')
})

/** AVATARS **/

emitter.on('check_avatar', function(user_id) {
    avatar.check(user_id, state, 30, function(render) {
        if (render) emitter.trigger('render')
    })
})

/** ADD **/

emitter.on('add', function(spnr) {
    state.mine.unshift({
        spnr   : spnr,
        user   : state.user.uid,
        synced : false
    })
    emitter.trigger('render')
    emitter.trigger('sync')
})

/** INITIALIZE **/

var simplelogin = new FirebaseSimpleLogin(root, function(error, user) {
    state.user = user
    if (user) emitter.trigger('logged_in')
    emitter.trigger('render')
})

