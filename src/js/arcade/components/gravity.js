class Gravity {

    constructor (options) {

        this.gravityScale = options.gravityScale !== undefined ? options.gravityScale : 1;
    }
}

Gravity.id = 'gravity';

export default Gravity;
