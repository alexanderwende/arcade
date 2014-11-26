import Vector from './vector';

class DirectionVector {

    constructor (options) {

        this.orientation = options.orientation !== undefined ? options.orientation : 0;

        super({
            x: Math.cos(this.orientation)
            y: Math.sin(this.orientation)
        });
    }

    get orientation () {

        return this.orientation;
    }

    set orientation (orientation) {

        this.orientation = orientation;

        this.x = Math.cos(orientation);
        this.y = Math.sin(orientation);
    }
}

export default DirectionVector;
