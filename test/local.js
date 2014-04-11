var jsdom      = require("jsdom").jsdom;
document       = jsdom('');
window         = document.createWindow();
navigator      = window.navigator;

// require('./spec.feed.js')
