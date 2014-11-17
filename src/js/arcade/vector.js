const PI        = Math.PI;
const PI_HALF   = Math.PI / 2;
const PI_DOUBLE = Math.PI * 2;

class Vector {

    constructor (options) {

        this.x = options && options.x !== undefined ? options.x : 0;
        this.y = options && options.y !== undefined ? options.y : 1;
    }

    length () {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    angle (vector) {

        if (vector !== undefined) {

            return Vector.angle(this, vector);
        }

        return Math.atan2(this.x, this.y);
    }

    distance (vector) {

        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }

    normalize () {

        var length = this.length();

        if (length !== 1) {

            this.x = this.x / length;
            this.y = this.y / length;
        }

        return this;
    }

    translate (x, y) {

        this.x += x;
        this.y += y;

        return this;
    }

    scale (factor) {

        this.x *= factor;
        this.y *= factor;

        return this;
    }

    rotate (angle) {

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var x = this.x * cos - this.y * sin;
        var y = this.x * sin + this.y * cos;

        this.x = x;
        this.y = y;

        return this;
    }

    dotProduct (vector) {

        return Vector.dotProduct(this, vector);
    }

    clone () {

        return new this.constructor({
            x: this.x,
            y: this.y
        });
    }
}

/**
 * The angle product between two vectors
 *
 * @param {Vector} a
 * @param {Vector} b
 */
Vector.angle = function (a, b) {

    var dotProduct = Vector.dotProduct(a, b);

    if (dotProduct === 0) return PI_HALF;

    var lengthA = a.length();
    var lengthB = b.length();

    return Math.acos(dotProduct / (lengthA * lengthB));
};

/**
 * The distance product between two vectors
 *
 * @param {Vector} a
 * @param {Vector} b
 */
Vector.distance = function (a, b) {

    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

/**
 * The dot product of two vectors
 *
 * @param {Vector} a
 * @param {Vector} b
 */
Vector.dotProduct = function (a, b) {

    return a.x * b.x + a.y + b.y;
};

/**
 * Add two or more vectors
 *
 * @param {Vector} [...a]
 */
Vector.add = function () {

    let x = 0,
        y = 0;

    for (let i = 0; i < arguments.length; i++) {
        x += arguments[i].x;
        y += arguments[i].y;
    }

    return new Vector({x: x, y: y});
}

/**
 * Create a vector from an angle
 *
 * @param {number} angle
 */
Vector.fromAngle = function (angle) {

    return new Vector({
        x: -Math.sin(angle),
        y: Math.cos(angle)
    });
};

export default Vector;
