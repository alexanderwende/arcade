var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('Vector', function () {

    'use strict';

    var Vector;

    before(function (done) {

        System.import('./arcade/vector')
            .then(function (module) {
                Vector = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#constructor()', function () {

        it('should create a correct vector', function () {

            var v = new Vector();

            assert.equal(v.x, 0);
            assert.equal(v.y, 1);
            assert.equal(v.length(), 1);
            assert.equal(v.angle(), 0);
        });
    });

    describe('#length()', function () {

        it('should get the correct length of a vector', function () {

            var v = new Vector({ x: 0, y: 4 });

            assert.equal(v.length(), 4);

            v = new Vector({ x: 0, y: -4 });

            assert.equal(v.length(), 4);

            v = new Vector({ x: 4, y: 0 });

            assert.equal(v.length(), 4);

            v = new Vector({ x: -4, y: 0 });

            assert.equal(v.length(), 4);

            v = new Vector({ x: 2, y: 2 });

            assert.equal(v.length(), Math.sqrt(8));
        });
    });

    describe('#angle()', function () {

        it('should get the correct angle of a vector', function () {

            var v = new Vector({ x: 0, y: 4 });

            assert.equal(v.angle(), 0);

            v = new Vector({ x: 0, y: -4 });

            assert.equal(v.angle(), Math.PI);

            v = new Vector({ x: 4, y: 0 });

            assert.equal(v.angle(), Math.PI / 2);

            v = new Vector({ x: -4, y: 0 });

            assert.equal(v.angle(), -Math.PI / 2);

            v = new Vector({ x: 2, y: 2 });

            assert.equal(v.angle(), Math.PI / 4);
        });
    });

    describe('#distance()', function () {

        it('should get the correct distance between two points/vectors', function () {

            var v1 = new Vector({ x: 2, y: 2 });
            var v2 = new Vector({ x: 4, y: 4 });

            assert.equal(v1.distance(v2), Math.sqrt(8));

            v1 = new Vector({ x: 2, y: 2 });
            v2 = new Vector({ x: 4, y: 2 });

            assert.equal(v1.distance(v2), 2);

            v1 = new Vector({ x: 2, y: 2 });
            v2 = new Vector({ x: 2, y: 0 });

            assert.equal(v1.distance(v2), 2);

            v1 = new Vector({ x: 2, y: 2 });
            v2 = new Vector({ x: -2, y: 2 });

            assert.equal(v1.distance(v2), 4);
        });
    });

    describe('#normalize()', function () {

        it('should normalize a vector', function () {

            var v = new Vector({ x: 3, y: 3 });

            assert.equal(v.length(), Math.sqrt(18));
            assert.equal(v.angle(), Math.PI / 4);

            v.normalize();

            // length should be 1
            assert.equal(v.length(), 1);
            // angle should not change
            assert.equal(v.angle(), Math.PI / 4);
        });
    });

    describe('#scale()', function () {

        it('should scale a vector', function () {

            var v = new Vector({ x: 3, y: 3 });

            assert.equal(v.length(), Math.sqrt(18));

            v.scale(2);

            assert.equal(v.length(), 2 * Math.sqrt(18));
            assert.equal(v.x, 6);
            assert.equal(v.y, 6);
        });
    });

    describe('#rotate()', function () {

        it('should rotate a vector', function () {

            var v = new Vector({ x: 3, y: 3 });

            assert.equal(v.angle(), Math.PI / 4);

            v.rotate(-Math.PI / 4);

            assert.equal(v.angle(), Math.PI / 2);

            v.rotate(Math.PI / 4);

            assert.equal(v.angle(), Math.PI / 4);

            v.rotate(Math.PI / 4);

            assert.equal(v.angle(), 0);
            assert.equal(v.x, 0);
        });
    });

    describe('#clone()', function () {

        it('should clone a vector', function () {

            var v1 = new Vector({ x: 3, y: 3 });
            var v2 = v1.clone();

            assert.deepEqual(v1, v2);
            assert.notEqual(v1, v2);
            assert.ok(v2 instanceof Vector);
        });
    });
});
