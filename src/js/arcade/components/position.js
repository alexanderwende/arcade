class Position {

    constructor (options) {

        this.x = options.x !== undefined ? options.x : 0;
        this.y = options.y !== undefined ? options.y : 0;

        this.previous = {
            x: this.x,
            y: this.y
        };
    }
}

Position.id = 'position';

export default Position;
