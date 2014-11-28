class Velocity {

    constructor (options) {

        this.x = options.x !== undefined ? options.x : 0;
        this.y = options.y !== undefined ? options.y : 0;
    }
}

Velocity.id = 'velocity';

export default Velocity;
