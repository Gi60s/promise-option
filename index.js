"use strict";
// This file provides a function that allows another function to use either a callback
// paradigm or a Promise paradigm.

var Promise             = require('bluebird');

module.exports = promiseOption;

function promiseOption(scope, multiArgs, callback) {
    var config = {};
    var promisified;

    // determine which arguments were passed in
    if (arguments.length === 1 && isFunction(arguments[0])) {
        callback = arguments[0];
        scope = null;
        multiArgs = null;
    } else if (arguments.length === 2 && isFunction(arguments[1])) {
        callback = arguments[1];
        if (isObject(arguments[0])) {
            scope = arguments[0];
            multiArgs = false;
        } else {
            multiArgs = arguments[0];
        }
    } else if (arguments.length >= 3 && !isFunction(arguments[2])) {
        throw new Error('Promise option "callback" must be a function.');
    }

    // add to the config object
    if (scope) config.context = scope;
    if (multiArgs) config.multiArgs = true;

    // get the promisified callback
    promisified = Promise.promisify(callback, config);

    return function() {
        var factory = {};
        var args = arguments;

        // convert arguments into an array
        function getArgs() {
            var result = [];
            var i;
            for (i = 0; i < args.length; i++) result.push(args[i]);
            return result;
        }

        /**
         * Call the function with a callback argument.
         * @param cb
         */
        factory.callback = function(cb) {
            var args = getArgs();
            args.push(cb);
            callback.apply(scope, args);
        };

        factory.catch = function(callback) {
            var args = getArgs();
            return promisified.apply(Promise, args).catch(callback);
        };

        factory.then = function(callback) {
            var args = getArgs();
            return promisified.apply(Promise, args).then(callback);
        };

        Object.defineProperty(factory, 'promise', {
            configurable: true,
            numerable: true,
            get: function() {
                var args = getArgs();
                return promisified.apply(Promise, args);
            }
        });

        return factory;
    };
}

function isFunction(value) {
    return typeof value === 'function';
}

function isObject(value) {
    return typeof value === 'object' && value;
}