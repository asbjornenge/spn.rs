var jsdom      = require("jsdom").jsdom;
document       = jsdom('');
window         = document.createWindow();
navigator      = window.navigator;

require('./spec.fireposer.js')
require('./spec.firefeed.js')
