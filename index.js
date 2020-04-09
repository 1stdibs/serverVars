'use strict';

const get = require('lodash.get');

let serverVars = null;

// on the client, this module exports the bootstrapped serverVars
if (typeof window !== 'undefined' && window.__SERVER_VARS__) {
    serverVars = window.__SERVER_VARS__;
    serverVars.get = function (key) {
        return get(serverVars, key);
    };
}

module.exports = serverVars;
