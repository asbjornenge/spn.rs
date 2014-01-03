require.config({
    baseUrl : '../app/scripts',
    paths: {
        chai    : '../bower_components/chai/chai',
        fb      : '../bower_components/firebase/lib',
        radio   : '../bower_components/Radio/radio',
        react   : '../bower_components/react/react',
        nanodom : '../bower_components/nanodom/nanodom',
        comp    : '../components'

    },
    urlArgs: "v="+(new Date()).getTime()
});

require([
    '../../test/scripts/feed.test.js',
    '../../test/scripts/localdb.test.js',
    '../../test/scripts/remotedb.test.js',
    '../../test/scripts/spnr.test.js',
],
function() {
    mocha.run()
});

