import Command from './command';

class Input {

    constructor (options) {

        this.keys = options && options.keys || {};
    }
}

Input.id = 'input';

export default Input;
