var through    = require("through2");

var WRAP_BEGIN = '__lol_define = window.define; window.define = null;'
var WRAP_END   = 'window.define = __lol_define;'

module.exports = function (browserify, opts) {
    var createStream = function () {
        var code = "";
        var stream = through.obj(function (buf, enc, next) {
            code += buf.toString();
            next();
        }, function (next) {
            this.push(new Buffer(WRAP_BEGIN+code+WRAP_END));
            next();
        });
        stream.label = "dedefine";
        return stream;
    };

    browserify.pipeline.get("wrap").push(createStream());
    browserify.on("reset", function () {
        browserify.pipeline.get("wrap").push(createStream());
    });
};
