/**
 * @class SpatialHash
 */
export default class SpatialHash {

    /**
     * @param {{size: {x: number, y: number}, grid: {x: number, y: number}}} options
     */
    constructor (options) {

        this.size = options.size;
        this.grid = options.grid;

        /**
         * @param {Object.<string, Array.<object>>}
         */
        this._hash = {};

        this._initHash();
    }

    /**
     * @private
     */
    _initHash () {

        var sizeX = this.size.x,
            sizeY = this.size.y,
            x,
            y;

        for (y = 0; y < sizeY; y += this.grid.y) {

            for (x = 0; x < sizeX; x += this.grid.x) {

                this._initHashCell(x, y);
            }
        }
    }

    /**
     * @private
     */
    _initHashCell (x, y) {

        var key = this.hashKey({ x: x, y: y });

        this._hash[key] = [];
    }

    /**
     * @private
     * @param {string} key
     * @returns {[]}
     */
    _convertHashKey (key) {

        key = key.split(':');

        // Math.floor() converts a string to an integer faster than parseInt()
        return [Math.floor(key[0]), Math.floor(key[1])];
    }

    /**
     * @param {{x: number, y: number}} object
     * @return {string}
     */
    hashKey (object) {

        var x = Math.floor(object.x / this.grid.x);
        var y = Math.floor(object.y / this.grid.y);

        return x + ':' + y;
    }

    /**
     * @returns {number}
     */
    get length () {

        var length = 0;

        for (let i of Object.keys(this._hash)) {
            length += this._hash[i].length;
        }

        return length;
    }

    /**
     * @return {Array.<string>}
     */
    keys () {

        return Object.keys(this._hash);
    }

    /**
     * @param {string}
     * @return {boolean}
     */
    hasKey (key) {

        return this._hash.hasOwnProperty(key);
    }

    /**
     * @param {object}
     * @return {boolean}
     */
    hasValue (object) {

        var key = this.hashKey(object);

        if (this.hasKey(key)) {

            return this._hash[key].indexOf(object) !== -1;
        }

        return false;
    }

    /**
     * @param {object} object
     */
    insert (object) {

        var key = this.hashKey(object);

        if (this.hasKey(key)) {

            this._hash[key].push(object);
        }
    }

    /**
     * @param {object} object
     * @param {string} [key]
     * @return {object}
     */
    remove (object, key) {

        var index;

        key = key || this.hashKey(object);

        if (this.hasKey(key)) {

            index = this._hash[key].indexOf(object);

            if (index !== -1) {
                return this._hash[key].splice(index, 1)[0];
            }
        }

        return undefined;
    }

    /**
     * @param {object} object
     * @return {Array.<object>}
     */
    retrieve (object) {

        var key = this.hashKey(object),
            result = [],
            x,
            y;

        if (this.hasKey(key)) {

            [x, y] = this._convertHashKey(key);

            result = result
                .concat(this._hash[(x - 1) + ':' + (y - 1)] || [])
                .concat(this._hash[(x) + ':' + (y - 1)] || [])
                .concat(this._hash[(x + 1) + ':' + (y - 1)] || [])

                .concat(this._hash[(x - 1) + ':' + (y)] || [])
                .concat(this._hash[key].filter(function (item) { return item !== object; }))
                .concat(this._hash[(x + 1) + ':' + (y)] || [])

                .concat(this._hash[(x - 1) + ':' + (y + 1)] || [])
                .concat(this._hash[(x) + ':' + (y + 1)] || [])
                .concat(this._hash[(x + 1) + ':' + (y + 1)] || []);
        }

        return result;
    }

    clear () {

        var i;

        for (i in this._hash) {

            if (this._hash.hasOwnProperty(i)) {

                this._hash[i] = [];
            }
        }
    }

    /**
     * @param {function} callback
     * @param {*} [thisArg]
     */
    forEach (callback, thisArg) {

        for (let i of Object.keys(this._hash)) {
            for (let k of this._hash[i]) {
                callback.call(thisArg, k);
            }
        }
    }
}
