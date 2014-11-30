import Vector from './vector';

class Position extends Vector {

    constructor (options) {

        super(options);

        this.previous = {
            x: this.x,
            y: this.y
        };
    }
}

Position.id = 'position';

export default Position;
