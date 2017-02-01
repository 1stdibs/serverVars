/* global require:false, module:true */
/**
 * Created by timwhidden
 * Date: 5/7/15
 * Time: 7:12:06PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */
"use strict";

var findNamespaceValue = require('find-namespace-value');

var serverVarsFactory = function () {
    return Object.create({
        store: {},
        add: function (key, val) {
            if (typeof key === 'object') {
                // copy all properties into the store
                Object.assign(this.store, key);
            } else {
                // set on the store (copy if an object)
                this.store[key] = typeof val === 'object' ? Object.assign({}, val) : val;
            }
        },
        get: function(key) {
            if (!key) {
                // return a copy of the entire store
                return Object.create({}, this.store);
            }
            return findNamespaceValue(key, this.store);
        },
        inject: function () {
            return '<script type="text/javascript">' +
                'window.__SERVER_VARS__ = ' +
                    // safely embed JSON within HTML
                    // see http://stackoverflow.com/a/4180424/266795
                JSON.stringify(this.store)
                    .replace(/</g, '\\u003c')
                    .replace(/-->/g, '--\\>')
                    .replace(/\u2028/g, '\\u2028')
                    .replace(/\u2029/g, '\\u2029') +
                ';</script>';
        }
    });
};

var serverVars = serverVarsFactory();

serverVars.middleware = function (req, res, next) {
    res.serverVars = res.locals.serverVars = serverVarsFactory();
    res.serverVars.add(Object.assign({}, serverVars.store)); // get a copy of app-wide serverVars
    next();
};

// on the client, this module exports the bootstrapped serverVars
if (typeof window !== 'undefined' && window.__SERVER_VARS__) {
    serverVars = window.__SERVER_VARS__;
    serverVars.get = function (key) {
        return findNamespaceValue(key, serverVars);
    };
}

module.exports = serverVars;