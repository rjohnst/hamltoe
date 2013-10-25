var HAMLToe;

    HAMLToe = {};

(function () {
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    function identity(x) {
        return x;
    }

    function returnFalse(x) {
        return false;
    }

    function HookCollection() {
    }

    HookCollection.prototype = {

        chain: function (hookname, func) {
            var original = this[hookname];
            if (!original)
                throw new Error("unknown hook " + hookname);

            if (original === identity)
                this[hookname] = func;
            else
                this[hookname] = function (text) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[0] = original.apply(null, args);
                    return func.apply(null, args);
                };
        },
        set: function (hookname, func) {
            if (!this[hookname])
                throw new Error("unknown hook " + hookname);
            this[hookname] = func;
        },
        addNoop: function (hookname) {
            this[hookname] = identity;
        },
        addFalse: function (hookname) {
            this[hookname] = returnFalse;
        }
    };

    HAMLToe.HookCollection = HookCollection;


    HAMLToe.Converter = function () {
        this.makeHtml = function (text) {
            return haml.compileHaml({
                source: text.trim()
            });
        }
    }
})();
