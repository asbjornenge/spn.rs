/** SPNRS ENTRYPOINT **/

require('./styles/main.styl')
require('./styles/spnrs.styl')
require('./styles/login.styl')
require('./bower_components/firebase/firebase')
require('./bower_components/firebase-simple-login/firebase-simple-login')

var React     = require('react')
var dom       = require('nanodom')
var emitter   = require('nanoemitter')()
var _         = require('lodash')
var SpnrLogin = require('./modules/components/SpnrLogin')
var SpnrApp   = require('./modules/components/SpnrApp')
var firefeed  = require('./modules/firefeed')
var avatar    = require('./modules/avatar')
var sync      = require('./modules/sync')

React.initializeTouchEvents(true)

/** STATE **/

var defaultState = {
    view      : 'global',
    global    : [],
    mine      : [],
    favorites : [],
    current   : null,
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

var SpnrState = React.createClass({
    render : function() {
        console.log('main render')
        this.snapshot()
        var App = this.state.user == null ? SpnrLogin({state:this.state, emitter:emitter}) : SpnrApp({state:this.state, emitter:emitter})
        return (
            App
        )
    },
    getInitialState : function() {
        return _.clone(defaultState, true)
    },
    componentWillMount : function() {
        var localState = localStorage.getItem('spn.rs');
        if (localState) { this.setState(JSON.parse(localState)) }
    },
    componentDidMount : function() {
        this.firebase = {}
        this.firebase.root  = new Firebase('https://spnrs.firebaseio.com/')
        this.firebase.login = new FirebaseSimpleLogin(this.firebase.root, function(error, user) {
                emitter.trigger('logged_in', user)
        }.bind(this))

        this.initEmitter();
    },
    initEmitter : function(simplelogin) {

        emitter.on('change_view', function(new_view) {
            this.setState({ view : new_view })
        }.bind(this))

        emitter.on('set_current', function(spnr) {
            this.setState({ current : spnr })
        }.bind(this))

        emitter.on('logged_in', function(user) {
            this.setState({user:user})
            this.initFeeds()
        }.bind(this))

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
            this.firebase.login.login(service, options);
        }.bind(this))

        emitter.on('logout', function() {
            this.firebase.login.logout()
            this.firefeeds.global.pause()
            this.firefeeds.mine.pause()
            window.removeEventListener('online', this.syncWithServer)
            this.setState(_.clone(defaultState, true))
        }.bind(this))

        emitter.on('check_avatar', function(user_id) {
            avatar.check(user_id, this.state, 30, function(render) {
                //
            })
        }.bind(this))

// emitter.on('add', function(spnr) {
//     state.mine.unshift({
//         spnr   : spnr,
//         user   : state.user.uid,
//         synced : false
//     })
//     emitter.trigger('render')
//     emitter.trigger('sync')
// })

    },
    initFeeds : function() {
        if (this.state.user == null) return
        this.firefeeds = {}
        this.firefeeds.global = firefeed(this.firebase.root, this.state)
            .feed('global')
            .on('child_added', function(spnr) {
                this.setState({ global : this.state.global.concat([spnr])})
            }.bind(this))
            .on('child_removed', function(spnr) {
                console.log('removed')
            }).listen()

        this.firefeeds.mine = firefeed(this.firebase.root, this.state)
            .feed('mine')
            .on('child_added', function(spnr) {
                this.setState({ mine : this.state.mine.concat([spnr])})
            }.bind(this))
            .on('child_changed', function(spnr) {
                console.log('mine changed')
                var changed = false
                this.state.mine.forEach(function(s) {
                    if (s.uuid == spnr.uuid) {
                        _.merge(s, spnr)
                        changed = true
                    }
                })
                if (changed) this.setState({ mine : this.state.mine })
            }.bind(this))
            .on('child_removed', function(spnr) {
                console.log('removed')
            }).listen()
        window.addEventListener('online', this.syncWithServer)
    },
    syncWithServer : function() {
        if (!navigator.onLine) return
        if (!state.user) return
        sync.mine(this.state.mine, this.state.firebaseroot.child('users/'+this.state.user.uid+'/spnrs'), function(synced) {
            // Dersom vi plutselig har flere som har blitt synced, render...
            // TODO: Kanskje ikke her? tenke paa dette
            if (synced.length > 1) this.setState({ mine : this.state.mine })
        }.bind(this))
    },
    snapshot : function() {
        localStorage.setItem('spn.rs', JSON.stringify(this.state))
    }
})

/** INITIALIZE **/

React.renderComponent(SpnrState({}), dom('#SpnrAppContainer')[0])

/** MONKEYBUSINESS **/

document.addEventListener('touchmove', function(event) {
   if (event.target.parentNode.className.indexOf('scrollable') < 0) event.preventDefault()
}, false);

