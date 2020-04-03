'use strict';

var get = require('lodash.get');
var serverVarsFactory = require('./serverVarsFactory');

var serverVars = serverVarsFactory();

serverVars.middleware = function(req, res, next) {
    if (res.serverVars === undefined) {
        res.serverVars = res.locals.serverVars = serverVarsFactory();
        res.serverVars.add(Object.assign({}, serverVars.store)); // get a copy of app-wide serverVars
    }
    next();
};

// on the client, this module exports the bootstrapped serverVars
if (typeof window !== 'undefined' && window.__SERVER_VARS__) {
    serverVars = window.__SERVER_VARS__;
    serverVars.get = function(key) {
        return get(serverVars, key);
    };
}

module.exports = serverVars;
