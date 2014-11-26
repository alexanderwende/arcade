class Position {

    constructor (x, y) {

        this.x = x;
        this.y = y;
    }

    translate (x, y) {

        this.x += x;
        this.y += y;
    }

    scale (f) {

        this.x *= x;
        this.y *= y;
    }
}

export default Position;
