import Vector from './vector';

class Direction extends Vector {

    constructor (options) {

        this._orientation = options.orientation !== undefined ? options.orientation : 0;

        this.x = Math.cos(this._orientation);
        this.y = Math.sin(this._orientation);
    }
}

Direction.name = 'direction';

export default Direction;
