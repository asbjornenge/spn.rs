define(['radio'], function(radio) {

    function listen() {
        radio('feeds.global.new').subscribe(function(spnr) {
            set('feeds.global.lastread', spnr.uuid)
        })
    }

    function set(key, value) {
        localStorage.setItem(key, value);
    }

    function get(key) {
        return localStorage.getItem(key);
    }

    return {
        listen : listen,
        get    : get
    }
})
