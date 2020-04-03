'use strict';

var get = require('lodash.get');
var jsesc = require('jsesc');
var serverVarsFactory = require('./serverVarsFactory');

var serverVars = serverVarsFactory();

serverVars.middleware = function(req, res, next) {
    if (res.serverVars === undefined) {
        res.serverVars = res.locals.serverVars = serverVarsFactory({
            injectEscapedJSONString: function() {
                const jsonString = jsesc(JSON.stringify(this.store), {
                    json: true,
                    isScriptContext: true,
                    minimal: true,
                });
                this.store = null; // helps w gc
                return `
                <script>
                    window.__SERVER_VARS__ = JSON.parse(${jsonString});
                </script>
            `;
            },
        });
        res.serverVars.add(Object.assign({}, serverVars.store)); // get a copy of app-wide serverVars
    }
    next();
};

module.exports = serverVars;
