class Force {

    constructor (options) {

        this.x = options.x !== undefined ? options.x : 0;
        this.y = options.y !== undefined ? options.y : 0;
    }
}

Force.name = 'force';

export default Force;
