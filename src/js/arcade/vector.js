class Vector {

    constructor (options) {

        this.x = options && options.x !== undefined ? options.x : 0;
        this.y = options && options.y !== undefined ? options.y : 1;
    }

    length () {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    angle () {

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

    clone () {

        return new this.constructor({
            x: this.x,
            y: this.y
        });
    }
}

Vector.fromAngle = function (angle) {

    return new Vector({
        x: -Math.sin(angle),
        y: Math.cos(angle)
    });
}

export default Vector;
