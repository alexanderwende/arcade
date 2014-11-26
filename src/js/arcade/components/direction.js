class Direction {

    constructor (options) {

        if (options.angle) {

            this.x = -Math.sin(options.angle);
            this.y = Math.cos(options.angle);
            this.angle = options.angle;
        }
        else {

            this.x = options.x;
            this.y = options.y;

            let angle = Math.acos(this.x / this.length());

            this.angle = this.y < 0 ? PI_DOUBLE - angle : angle;
        }
    }

    length () {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalize () {

        var length = this.length();

        if (length !== 1) {

            this.x = this.x / length;
            this.y = this.y / length;
        }

        return this;
    }
}

export default Direction;
