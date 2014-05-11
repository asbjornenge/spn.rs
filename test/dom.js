module.exports = function () {
    if (typeof document != 'undefined') return
    console.log('initializing jsdom')
    var jsdom      = require("jsdom").jsdom;
    document       = jsdom('<html><body></body></html>');
    window         = document.createWindow();
    navigator      = window.navigator;    
}