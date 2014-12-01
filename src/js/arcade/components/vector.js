const PI = Math.PI;
const PI_DOUBLE = 2 * PI;
const PI_HALF = 0.5 * PI;

class Vector {

    constructor (options) {

        this.x = options.x !== undefined ? options.x : 0;
        this.y = options.y !== undefined ? options.y : 0;
    }

    add (...vectors) {

        for (let i = 0, length = vectors.length; i < length; i++) {
            this.x += vectors[i].x;
            this.y += vectors[i].y;
        }

        return this;
    }

    subtract (...vectors) {

        for (let i = 0, length = vectors.length; i < length; i++) {
            this.x -= vectors[i].x;
            this.y -= vectors[i].y;
        }

        return this;
    }

    multiply (...vectors) {

        for (let i = 0, length = vectors.length; i < length; i++) {
            this.x *= vectors[i].x;
            this.y *= vectors[i].y;
        }

        return this;
    }

    dotProduct (vector) {

        return this.x * vector.x + this.y * vector.y;
    }

    scale (factor) {

        this.x *= factor;
        this.y *= factor;

        return this;
    }

    length () {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    orientation () {

        let orientation = Math.acos(this.x / this.length());

        return orientation * ((this.y < 0) ? -1 : 1);
    }

    rotate (angle) {

        angle = angle % PI_DOUBLE;

        if (angle > PI) {
            angle = -PI_DOUBLE + angle;
        }
        else if (angle < -PI) {
            angle = PI_DOUBLE + angle;
        }

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let x = this.x * cos - this.y * sin;
        let y = this.x * sin + this.y * cos;

        this.x = x;
        this.y = y;

        return this;
    }

    normalize () {

        let length = this.length();

        this.x /= length;
        this.y /= length;

        return this;
    }

    static add (...vectors) {

        let x = vectors[0].x,
            y = vectors[0].y;

        for (let i = 1, length = vectors.length; i < length; i++) {
            x += vectors[i].x;
            y += vectors[i].y;
        }

        return new this({ x: x, y: y });
    }

    static subtract (...vectors) {

        let x = vectors[0].x,
            y = vectors[0].y;

        for (let i = 1, length = vectors.length; i < length; i++) {
            x -= vectors[i].x;
            y -= vectors[i].y;
        }

        return new this({ x: x, y: y });
    }

    static multiply (...vectors) {

        let x = vectors[0].x,
            y = vectors[0].y;

        for (let i = 1, length = vectors.length; i < length; i++) {
            x *= vectors[i].x;
            y *= vectors[i].y;
        }

        return new this({ x: x, y: y });
    }

    static dotProduct (vector1, vector2) {

        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    static scale (vector, factor) {

        return new this({ x: vector.x * factor, y: vector.y * factor });
    }

    static magnitude (vector) {

        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    }

    static distance (vector1, vector2) {

        return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
    }

    static normalize (vector) {

        let length = Vector.length(vector);

        return new this({ x: vector.x / length, y: vector.y / length });
    }
}

export default Vector;
