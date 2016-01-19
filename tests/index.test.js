"use strict";
var expect          = require('chai').expect;
var promiseOption   = require('../index');

describe('promise-option', function() {
    var gv = promiseOption(getValue);
    var ge = promiseOption(getError);

    it('callback paradigm value', function(done) {
        gv(100, 25).callback(function(err, value) {
            expect(err).to.be.null;
            expect(value).to.be.equal(125);
            done();
        });
    });

    it('callback paradigm error', function(done) {
        ge('ThrowError').callback(function(err, value) {
            expect(err).to.be.instanceof(Error);
            expect(err.message).to.be.equal('ThrowError');
            expect(value).to.be.null;
            done();
        });
    });

    it('promise paradigm value', function() {
        return gv(10, 13)
            .then(function(value) {
                expect(value).to.be.equal(23);
            });
    });

    it('promise paradigm error', function() {
        return ge('FooError')
            .catch(function(err) {
                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('FooError');
            });
    });

    it('promise object', function() {
        var p = gv(1, 2).promise;
        expect(p.constructor.name).to.be.equal('Promise');
    });

});

function getValue(a, b, callback) {
    callback(null, a + b);
}

function getError(msg, callback) {
    callback(new Error(msg), null);
}