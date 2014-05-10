var jsdom      = require("jsdom").jsdom;
document       = jsdom('');
window         = document.createWindow();
navigator      = window.navigator;

require('./spec.firefeed.js')
require('./spec.avatar.js')
require('./spec.sync.js')
require('./spec.utils.js')
