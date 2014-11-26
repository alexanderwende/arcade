import Point from './point';

class Vector extends Point {

    constructor (options) {

        super(options);
    }

    magnitude () {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    orientation () {

        let angle = Math.acos(this.x / this.length());

        return this.y < 0 ? PI_DOUBLE - angle : angle;
    }
}

export default Vector;
