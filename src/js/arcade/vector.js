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

    orientation () {

        let angle = Math.acos(this.x / this.length());

        return this.y < 0 ? PI_DOUBLE - angle : angle;
    }

    angle (vector) {

        if (vector !== undefined) {

            return Vector.angle(this, vector);
        }

        return this.orientation();
    }

    distance (vector) {

        return Vector.distance(this, vector);
    }

    normalize () {

        var length = this.length();

        if (length !== 1) {

            this.x = this.x / length;
            this.y = this.y / length;
        }

        return this;
    }

    translate (vector) {

        this.x += vector.x;
        this.y += vector.y;

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

    add (...vectors) {

        let args = [this, ...vectors];

        return Vector.add(...args);
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

Vector.angle2 = function (a, b) {

    return Math.acos(2 * (Math.pow(a.x * b.x + a.y * b.y, 2) / ((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y))) - 1) / 2;
};

/**
 * The distance between two vectors
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

    return a.x * b.x + a.y * b.y;
};

/**
 * Add two or more vectors
 *
 * @param {...Vector} vectors
 */
Vector.add = function (...vectors) {

    let x = 0,
        y = 0;

    vectors.forEach(function (vector) {
        x += vector.x;
        y += vector.y;
    });

    return new Vector({x: x, y: y});
};

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
