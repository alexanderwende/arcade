import Vector from './vector';

class Position extends Vector {

    constructor (x, y) {

        super(x, y);

        this.previous = {
            x: this.x,
            y: this.y
        };
    }
}

Position.id = 'position';

export default Position;
