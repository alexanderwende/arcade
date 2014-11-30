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

    orientation () {}

    normalize () {

        let length = this.length();

        this.x /= length;
        this.y /= length;

        return this;
    }
}

export default Vector;
