class Point {

    constructor (options) {

        this.x = options.x !== undefined ? options.x : 0;
        this.y = options.y !== undefined ? options.y : 0;
    }

    translate (x, y) {

        this.x += x;
        this.y += y;

        return this;
    }
}

export default Point;
