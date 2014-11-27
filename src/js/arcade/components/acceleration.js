class Acceleration {

    constructor (options) {

        this.x = options.x !== undefined ? options.x : 0;
        this.y = options.y !== undefined ? options.y : 0;
    }
}

Acceleration.name = 'acceleration';

export default Acceleration;
