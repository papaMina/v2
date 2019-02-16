requirejs.config({
    min: false,
    urlArgs: "r=" + (+new Date()),
    baseUrl: '/js',
    context: 'yep',
    shim: {
        "v2.rsm": ['v2'],
        "v2.tool": ['v2']
    },
    paths: {
        vue: 'lib/vue/vue'
    },
    packages: {
        name: 'v2',
        main: 'core',
        location: 'packages/'
    }
});
var r = /https?:\/\/([\w-]+\.)*[\w-]+\/(([\w-]+\/)+)?(([\w-]+)(\.[\w-]+|\?|#|$)|\?|#|$)/i;
require(["v2", "v2.rsm"], function () {
    if (r = r.exec(location.href)) {
        return require(["views/" + r[2] + (r[5] || "index")]);
    }
    return require(["views/index"]);
});