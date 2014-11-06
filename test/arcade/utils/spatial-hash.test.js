var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('SpatialHash', function () {

    'use strict';

    var SpatialHash;

    before(function (done) {

        System.import('./arcade/utils/spatial-hash')
            .then(function (module) {
                SpatialHash = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#constructor()', function () {

        it('should create a correct hash', function () {

            var hash = new SpatialHash({
                size: { x: 100, y: 100 },
                grid: { x: 25, y: 25 }
            });

            assert.lengthOf(hash.keys(), 16);
        });
    });

    describe('#hashKey()', function () {

        it('should create a correct hash key', function () {

            var hash = new SpatialHash({
                size: { x: 100, y: 100 },
                grid: { x: 25, y: 25 }
            });

            assert.equal(hash.hashKey({ x: 0, y : 0 }), '0:0');
            assert.equal(hash.hashKey({ x: 24, y : 24 }), '0:0');
            assert.equal(hash.hashKey({ x: 25, y : 25 }), '1:1');
            assert.equal(hash.hashKey({ x: 25, y : 99 }), '1:3');
            assert.equal(hash.hashKey({ x: 99, y : 99 }), '3:3');
        });
    });

    describe('#insert()', function () {

        it('should insert objects correctly', function () {

            var hash = new SpatialHash({
                size: { x: 100, y: 100 },
                grid: { x: 25, y: 25 }
            });

            var object = { x: 1, y : 1 };

            hash.insert(object);

            assert.equal(hash._hash['0:0'][0], object);
        });
    });

    describe('#hasValue()', function () {

        it('should find objects correctly', function () {

            var hash = new SpatialHash({
                size: { x: 100, y: 100 },
                grid: { x: 25, y: 25 }
            });

            var object = { x: 1, y : 1 };

            hash.insert(object);

            assert.ok(hash.hasValue(object));
            assert.notOk(hash.hasValue({ x: 2, y : 2 }));
            assert.notOk(hash.hasValue({ x: 200, y : 200 }));
        });
    });

    describe('#remove()', function () {

        it('should remove objects correctly', function () {

            var hash = new SpatialHash({
                size: { x: 100, y: 100 },
                grid: { x: 25, y: 25 }
            });

            var object = { x: 1, y : 1 };

            hash.insert(object);

            assert.equal(hash.remove(object), object);
            assert.lengthOf(hash._hash['0:0'], 0);
            assert.isUndefined(hash.remove(object));
            assert.isUndefined(hash.remove({ x: 150, y : 150 }));
        });
    });

    describe('#retrieve()', function () {

        it('should retrieve objects correctly', function () {

            var hash = new SpatialHash({
                size: { x: 100, y: 100 },
                grid: { x: 25, y: 25 }
            });

            var object1 = { x: 1, y : 1 };
            var object2 = { x: 2, y : 2 };
            var object3 = { x: 29, y : 12 };
            var object4 = { x: 99, y : 12 };

            hash.insert(object1);
            hash.insert(object2);
            hash.insert(object3);
            hash.insert(object4);

            assert.lengthOf(hash.retrieve(object1), 2);
            assert.deepEqual(hash.retrieve(object3), [object1, object2]);
            assert.deepEqual(hash.retrieve(object4), []);
            assert.lengthOf(hash.retrieve({ x: 1, y : 99 }), 0);
        });
    });

    describe('#clear()', function () {

        it('should clear the hash correctly', function () {

            var hash = new SpatialHash({
                size: { x: 100, y: 100 },
                grid: { x: 25, y: 25 }
            });

            var object1 = { x: 1, y : 1 };
            var object2 = { x: 2, y : 2 };
            var object3 = { x: 29, y : 12 };
            var object4 = { x: 99, y : 12 };

            hash.insert(object1);
            hash.insert(object2);
            hash.insert(object3);
            hash.insert(object4);

            hash.clear();

            assert.lengthOf(hash.retrieve(object1), 0);
            assert.notOk(hash.hasValue(object1));
            assert.notOk(hash.hasValue(object2));
            assert.notOk(hash.hasValue(object3));
            assert.notOk(hash.hasValue(object4));
        });
    });
});
