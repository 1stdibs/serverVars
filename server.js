'use strict';

const get = require('lodash.get');

const serverVarsFactory = function () {
    return Object.create({
        store: {},
        add: function (key, val) {
            if (typeof key === 'object') {
                // copy all properties into the store
                Object.assign(this.store, key);
            } else {
                // set on the store (copy if an object)
                this.store[key] =
                    !Array.isArray(val) && typeof val === 'object' ? Object.assign({}, val) : val;
            }
        },
        get: function (key) {
            if (!key) {
                // return a copy of the entire store
                return Object.create({}, this.store);
            }
            return get(this.store, key);
        },
        inject: function () {
            var stringified =
                '<script>window.__SERVER_VARS__ = ' +
                // safely embed JSON within HTML
                // see http://stackoverflow.com/a/4180424/266795
                JSON.stringify(this.store)
                    .replace(/</g, '\\u003c')
                    .replace(/-->/g, '--\\>')
                    .replace(/\u2028/g, '\\u2028')
                    .replace(/\u2029/g, '\\u2029') +
                ';</script>';
            this.store = {}; // helps w gc
            return stringified;
        },
        // inert script is faster for large objects
        injectInertScript: function () {
            const stringified = `<script id="serverVars_data" type="application/json">${JSON.stringify(
                this.store
            )
                .replace(/</g, '\\u003c')
                .replace(/>/g, '\\u003E')
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029')}</script>
                <script>window.__SERVER_VARS__ = JSON.parse(document.getElementById("serverVars_data").textContent);</script>`;
            this.store = null; // helps w gc
            return stringified;
        },
    });
};

const serverVars = serverVarsFactory();

serverVars.serverVarsFactory = serverVarsFactory;

serverVars.middleware = function (req, res, next) {
    if (res.serverVars === undefined) {
        res.serverVars = res.locals.serverVars = serverVarsFactory({});
        res.serverVars.add(Object.assign({}, serverVars.store)); // get a copy of app-wide serverVars
    }
    next();
};

module.exports = serverVars;
