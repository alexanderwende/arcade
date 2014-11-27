class Direction {

    constructor (options) {

        this.orientation = options.orientation !== undefined ? options.orientation : 0;

        this.x = Math.cos(this.orientation);
        this.y = Math.sin(this.orientation);
    }

    get orientation () {

        return this.orientation;
    }

    set orientation (orientation) {

        this.orientation = orientation;

        this.x = Math.cos(this.orientation);
        this.y = Math.sin(this.orientation);
    }
}

Direction.name = 'direction';

export default Direction;
