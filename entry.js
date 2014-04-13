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
state = localState ? JSON.parse(localState) : defaultState;
function snapshot() {
    localStorage.setItem('spn.rs', JSON.stringify(state))
}

/** FEEDS **/

var root  = new Firebase('https://spnrs.firebaseio.com/')
var feeds = {}
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
        .on('child_removed', function(spnr) {
            console.log('removed')
        }).listen()

}.bind(feeds))
emitter.on('logged_out', function() {

    this.global.pause()
    this.mine.pause()

}.bind(feeds))

/** VIEWS **/

React.initializeTouchEvents(true)
// Render a waiting view - or have it set by css default.
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

/** INITIALIZE **/

var simplelogin = new FirebaseSimpleLogin(root, function(error, user) {
    state.user = user
    if (user) emitter.trigger('logged_in')
    emitter.trigger('render')
})

// /** REMOTE **/

// var rdb = new remotedb('https://spnrs.firebaseio.com/');

// rdb
// .on('login', function(user, error) {
//     radio('state.change').broadcast({user:user})
//     if (!user) return;

//     // UPDATE USER DATA

//     rdb('users').ref().child(user.uid+'/meta').set(user);

//     // LISTEN TO ADD EVENTS

//     rdb('global').from(state.latest.global.loaded)
//         .on('child_added', function(snap) {
//             var diff = mutator(state).add('global', trans.snap2spnr(snap)).diff();
//             diff.latest = _.clone(state.latest, true);
//             diff.latest.global.loaded = snap.name();
//             radio('state.change').broadcast(diff);
//         })
//         .on('child_removed', function(snap) {
//             console.log('removed')
//         })

//     rdb('mine').from(state.latest.mine.loaded)
//         .on('child_added', function(snap) {
//             var diff = mutator(state).add('mine', trans.snap2spnr(snap)).diff();
//             diff.latest = _.clone(state.latest, true);
//             diff.latest.mine.loaded = parseInt(snap.getPriority());
//             radio('state.change').broadcast(diff);
//         })
//         .on('child_removed', function(snap) {
//             console.log('removed')
//         })

//     // START LISTENING/PULLING DATA

//     rdb.listen();
// })
// .on('logout', function() {
//     rdb.dropFeeds();
// })

// /** FUNCTIONS **/

// function view_switcher() {
//     if (!state.user) { Login.attach(dom('#container')[0]); return; }
//     else             { Spnrs.attach(dom('#container')[0], state); return;}
// }

// function snapshot() {
//     localStorage.setItem('spn.rs', JSON.stringify(state))
// }

// function attempt_sync_with_server() {
//     mutator(state).sync(rdb);
// }

// /** LISTENERS **/

// radio('state.change').subscribe(function(new_state, force) {
//     if (force) { view_switcher(); snapshot(); }
//     if (Object.keys(new_state).length === 0) return;
//     _.assign(state, new_state)
//     view_switcher();
//     snapshot();
// })

// radio('ui.event.login').subscribe(function(provider) {
//     rdb.login(provider);
// })

// radio('ui.event.logout').subscribe(function() {
//     state = defaultState;
//     snapshot();
//     rdb.logout();
// })

// radio('ui.event.add').subscribe(function(snap) {
//     var diff = mutator(state).add('mine', trans.val2spnr(snap)).diff();
//     radio('state.change').broadcast(diff);
//     if (navigator.onLine) attempt_sync_with_server();
// })

// radio('ui.event.remove').subscribe(function(spnr) {
//     /* Never synced */
//     if (!navigator.onLine && spnr.uuid.length == 36) {
//         radio('state.change').broadcast({
//             global : state.global.reduce(function(a,b) {
//                 return b.uuid !== spnr.uuid ? a.concat([b]) : a;
//             },[])
//         })
//         return;
//     }
//     /* Synced - but not online - can't delete */
//     if (!navigator.onLine && spnr.uuid.length < 36) return;
//     /* Delete */
//     rdb('global').remove(spnr.uuid, function(error) {
//         if (error) console.log('remove error', error)
//     })
// })

// radio('ui.avatar.check').subscribe(function(user) {
//     if (state.avatars[user]) {
//         var diff = moment().diff(moment(state.avatars[user].updated), 'days')
//         if (diff < 30) return
//     }
//     var url;
//     if (user.indexOf('github') === 0) {
//         url = 'https://avatars.githubusercontent.com/u/'+user.split(':')[1]+'?s=32'
//     }
//     if (user.indexOf('facebook') === 0) {
//         url = 'http://graph.facebook.com/'+user.split(':')[1]+'/picture?type=small'
//     }
//     if (!url) return
//     utils.convertImgToBase64(url, function(base64Img){
//         state.avatars[user] = { url : base64Img, updated : new Date().getTime() }
//         radio('state.change').broadcast({}, true)
//     });
// })

// window.addEventListener('online', function(e) {
//     attempt_sync_with_server();
// });

// /** INITIALIZE **/

// rdb.connect();
// rdb.listenLogin();
// if (!navigator.onLine) {
//     view_switcher();
// } else {
//     attempt_sync_with_server();
// }
